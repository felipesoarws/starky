import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db/index.js";
import { users, decks, cards, history } from "./db/schema.js";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};


// --- AUTH ROUTES ---

const resendKey = process.env.RESEND_API_KEY;
if (!resendKey) {
  console.warn("⚠️  RESEND_API_KEY is missing. Emails will fall back to console logging.");
} else {
  console.log("✅ RESEND_API_KEY found starting with", resendKey.substring(0, 5) + "...");
}

const resend = new Resend(resendKey || "re_123");

import { getVerificationEmailHtml } from "./email-template.js";

// Helper to send email
const sendVerificationEmail = async (email: string, code: string) => {
  // For development, still log it just in case
  console.log(`[EMAIL] To: ${email}, Code: ${code}`);

  if (!process.env.RESEND_API_KEY) {
    console.warn("Missing RESEND_API_KEY. Email will not be sent (console only).");
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Starky <onboarding@resend.dev>', // Use resend.dev for testing if verified, or user's domain
      to: [email],
      subject: 'Seu código de verificação Starky',
      html: getVerificationEmailHtml(code)
    });

    if (error) {
      console.error("Resend Error:", error);
    } else {
      console.log("Email sent:", data);
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));

    let userId;

    if (existingUser.length > 0) {
      const user = existingUser[0];
      if (user.isVerified) {
        return res.status(400).json({ message: "Email already in use" });
      } else {
        // Update existing unverified user
        const [updatedUser] = await db.update(users).set({
          name,
          passwordHash: hashedPassword,
          verificationCode,
          verificationCodeExpiresAt: expiresAt,
          createdAt: new Date() // specific behavior: reset creation time? Optional.
        }).where(eq(users.id, user.id)).returning();
        userId = updatedUser.id;
      }
    } else {
      // Create new user
      const [newUser] = await db.insert(users).values({
        name,
        email,
        passwordHash: hashedPassword,
        isVerified: false,
        verificationCode,
        verificationCodeExpiresAt: expiresAt
      }).returning();
      userId = newUser.id;
    }

    // Send code
    await sendVerificationEmail(email, verificationCode);

    res.json({
      message: "Verification code sent",
      userId: userId,
      requiresVerification: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/verify", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Missing email or code" });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    if (user.verificationCodeExpiresAt && new Date() > user.verificationCodeExpiresAt) {
      return res.status(400).json({ message: "Code expired" });
    }

    // Verify user
    const [updatedUser] = await db.update(users).set({
      isVerified: true,
      verificationCode: null,
      verificationCodeExpiresAt: null
    })
      .where(eq(users.id, user.id))
      .returning();

    const token = jwt.sign({ id: updatedUser.id, email: updatedUser.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first", requiresVerification: true });
      // NOTE: Frontend can trigger the verify UI if it sees this specific error or flag
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) return res.sendStatus(404);

    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- DECK ROUTES ---

// Get all decks for user (including cards)
app.get("/api/decks", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    // Using Drizzle query builders to fetch related cards
    const userDecks = await db.query.decks.findMany({
      where: eq(decks.userId, userId),
      with: {
        cards: true,
      },
      orderBy: (decks, { desc }) => [desc(decks.createdAt)],
    });

    res.json(userDecks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new deck
app.post("/api/decks", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    console.log(`[POST /api/decks] Creating deck for user ${userId}`, req.body);
    const { title, category, language, cards: initialCards } = req.body;

    const [newDeck] = await db.insert(decks).values({
      title,
      category,
      language: language || "pt-BR",
      userId,
    }).returning();

    console.log(`[POST /api/decks] Deck created with ID ${newDeck.id}`);

    if (initialCards && initialCards.length > 0) {
      console.log(`[POST /api/decks] Inserting ${initialCards.length} cards`);
      const cardsToInsert = initialCards.map((c: any) => ({
        deckId: newDeck.id,
        question: c.question,
        answer: c.answer,
      }));
      await db.insert(cards).values(cardsToInsert);
    }

    // Fetch full deck to return
    const fullDeck = await db.query.decks.findFirst({
      where: eq(decks.id, newDeck.id),
      with: { cards: true }
    });

    res.json(fullDeck);
  } catch (error) {
    console.error("[POST /api/decks] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update deck metadata (title, category)
app.put("/api/decks/:id", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const deckId = parseInt(req.params.id);
    const { title, category, language, cards: incomingCards, lastStudied } = req.body;

    console.log(`[PUT /api/decks/${deckId}] Updating deck`, req.body);

    // Verify ownership
    const [deck] = await db.select().from(decks).where(and(eq(decks.id, deckId), eq(decks.userId, userId)));
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    // Fix Date parsing: Handle "Nunca" or invalid strings
    let parsedLastStudied = deck.lastStudied;
    if (lastStudied && lastStudied !== "Nunca") {
      const d = new Date(lastStudied);
      if (!isNaN(d.getTime())) {
        parsedLastStudied = d;
      }
    }

    // Update Deck Info
    await db.update(decks).set({
      title: title || deck.title,
      category: category || deck.category,
      language: language || deck.language,
      lastStudied: parsedLastStudied
    }).where(eq(decks.id, deckId));

    if (incomingCards && Array.isArray(incomingCards)) {
      // 1. Obter IDs dos cards atuais no banco
      const existingCardsInDb = await db.select({ id: cards.id }).from(cards).where(eq(cards.deckId, deckId));
      const dbCardIds = existingCardsInDb.map(c => c.id);

      // 2. Identificar quais cards foram removidos (estão no banco mas não no payload)
      const incomingCardIds = incomingCards.map(c => c.id).filter(id => id && id <= 2147483647);
      const idsToDelete = dbCardIds.filter(id => !incomingCardIds.includes(id));

      if (idsToDelete.length > 0) {
        // Multi-delete (Drizzle syntax check: inArray is standard)
        const { inArray } = await import("drizzle-orm");
        await db.delete(cards).where(and(eq(cards.deckId, deckId), inArray(cards.id, idsToDelete)));
      }

      // 3. Atualizar ou Inserir cards do payload
      for (const card of incomingCards) {
        if (card.id && typeof card.id === 'number' && card.id <= 2147483647) {
          // Update
          await db.update(cards).set({
            question: card.question,
            answer: card.answer,
            nextReviewDate: card.nextReviewDate === null ? null : (card.nextReviewDate ? new Date(card.nextReviewDate) : undefined),
            lastReviewed: card.lastReviewed === null ? null : (card.lastReviewed ? new Date(card.lastReviewed) : undefined),
            interval: card.interval,
            difficulty: card.difficulty
          }).where(eq(cards.id, card.id));
        } else {
          // Insert (no ID or temporary timestamp ID)
          await db.insert(cards).values({
            deckId: deckId,
            question: card.question,
            answer: card.answer,
            // se vier com progresso (ex: importação), salva também
            nextReviewDate: card.nextReviewDate ? new Date(card.nextReviewDate) : null,
            lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
            interval: card.interval || 0,
            difficulty: card.difficulty || null
          });
        }
      }
    }

    const updatedDeck = await db.query.decks.findFirst({
      where: eq(decks.id, deckId),
      with: { cards: true }
    });

    res.json(updatedDeck);
  } catch (error) {
    console.error(`[PUT /api/decks/${req.params.id}] Error:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete deck
app.delete("/api/decks/:id", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const deckId = parseInt(req.params.id);

    const [deck] = await db.select().from(decks).where(and(eq(decks.id, deckId), eq(decks.userId, userId)));
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    await db.delete(decks).where(eq(decks.id, deckId)); // Logic delete cascading usually handled by DB, but we added cascade in schema 

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- CARD ROUTES ---

// Update single card (for study session essentially)
app.put("/api/cards/:id", authenticateToken, async (req, res) => {
  try {
    const cardId = parseInt(req.params.id);
    const { difficulty, nextReviewDate, interval, lastReviewed } = req.body;

    // TODO: Validate card ownership via deck->user join

    await db.update(cards).set({
      difficulty,
      nextReviewDate: nextReviewDate ? new Date(nextReviewDate) : undefined,
      interval,
      lastReviewed: lastReviewed ? new Date(lastReviewed) : undefined
    }).where(eq(cards.id, cardId));

    res.json({ message: "Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Bulk delete category
app.delete("/api/categories/:name", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const categoryName = req.params.name;

    console.log(`[DELETE /api/categories/${categoryName}] Deleting all decks in category for user ${userId}`);

    await db.delete(decks)
      .where(and(eq(decks.userId, userId), eq(decks.category, categoryName)));

    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error(`[DELETE /api/categories] Error:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Bulk update category name
app.put("/api/categories/:name", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const oldName = req.params.name;
    const { newName } = req.body;

    if (!newName) return res.status(400).json({ message: "New name required" });

    console.log(`[PUT /api/categories/${oldName}] Renaming to ${newName} for user ${userId}`);

    await db.update(decks)
      .set({ category: newName })
      .where(and(eq(decks.userId, userId), eq(decks.category, oldName)));

    res.json({ message: "Category updated" });
  } catch (error) {
    console.error(`[PUT /api/categories] Error:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- HISTORY ROUTES ---

app.get("/api/history", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    console.log(`[GET /api/history] Fetching history for user ${userId}`);
    const userHistory = await db.select().from(history)
      .where(eq(history.userId, userId))
      .orderBy(desc(history.reviewedAt));
    res.json(userHistory);
  } catch (error) {
    console.error("[GET /api/history] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/history", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { deckTitle, cardQuestion, cardAnswer, difficulty } = req.body;
    console.log(`[POST /api/history] Adding entry for user ${userId}: ${deckTitle}`);

    const [newEntry] = await db.insert(history).values({
      userId,
      deckTitle,
      cardQuestion,
      cardAnswer,
      difficulty
    }).returning();

    res.json(newEntry);
  } catch (error) {
    console.error("[POST /api/history] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/history", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    console.log(`[DELETE /api/history] Clearing history for user ${userId}`);
    await db.delete(history).where(eq(history.userId, userId));
    res.json({ message: "History cleared" });
  } catch (error) {
    console.error("[DELETE /api/history] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Export app for Vercel
export default app;

// Only listen if run directly (not imported as a module)
// In Vercel, this file is imported, so listen won't run.
// locally 'npm run server' runs this file directly.


if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Workaround: Prevent process from exiting immediately when running locally
  // This is necessary because app.listen() is not holding the event loop open
  // in this specific environment (Node + Drizzle + dotenv combination)
  setInterval(() => { }, 60000);
}
