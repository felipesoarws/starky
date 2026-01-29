import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db/index.js";
import { users, decks, cards, history } from "./db/schema.js";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import validator from "validator";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET must be set in .env and be at least 32 characters long");
  console.error("Generate a secure secret with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
  process.exit(1);
}

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Muitas tentativas. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Muitas tentativas de verificação. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: 'Muitas requisições. Tente novamente em breve.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth_token || (req.headers['authorization']?.split(' ')[1]);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};

const resendKey = process.env.RESEND_API_KEY;
if (!resendKey) {
  console.warn("⚠️  RESEND_API_KEY is missing. Emails will fall back to console logging.");
}

const resend = new Resend(resendKey || "re_123");

import { getVerificationEmailHtml } from "./email-template.js";


const sendVerificationEmail = async (email: string, code: string) => {
  if (process.env.NODE_ENV === 'development') {
    const redactedEmail = email.replace(/(?<=.{2}).(?=.*@)/g, '*');
    console.log(`[EMAIL] To: ${redactedEmail}, Code: [REDACTED]`);
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("Missing RESEND_API_KEY. Email will not be sent (console only).");
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Starky <contato@starky.app.br>',
      to: [email],
      subject: 'Seu código de verificação Starky',
      html: getVerificationEmailHtml(code)
    });

    if (error) {
      console.error("Resend Error:", error);
    } else if (process.env.NODE_ENV === 'development') {
      console.log("Email sent successfully");
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2 || name.length > 100) {
    return res.status(400).json({ message: "Nome inválido (2-100 caracteres)" });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Email inválido" });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ message: "Senha deve ter no mínimo 8 caracteres" });
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return res.status(400).json({
      message: "Senha deve conter letras maiúsculas, minúsculas e números"
    });
  }

  next();
};

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Email inválido" });
  }

  if (!password) {
    return res.status(400).json({ message: "Senha é obrigatória" });
  }

  next();
};

const validateDeck = (req: Request, res: Response, next: NextFunction) => {
  const { title, category } = req.body;

  if (!title || title.trim().length < 1 || title.length > 200) {
    return res.status(400).json({ message: "Título inválido (1-200 caracteres)" });
  }

  if (!category || category.trim().length < 1 || category.length > 100) {
    return res.status(400).json({ message: "Categoria inválida (1-100 caracteres)" });
  }

  next();
};


app.post("/api/auth/register", validateRegistration, authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    const existingUser = await db.select().from(users).where(eq(users.email, email));

    let userId;

    if (existingUser.length > 0) {
      const user = existingUser[0];
      if (user.isVerified) {
        return res.status(400).json({ message: "Email already in use" });
      } else {
        const [updatedUser] = await db.update(users).set({
          name,
          passwordHash: hashedPassword,
          verificationCode,
          verificationCodeExpiresAt: expiresAt,
          createdAt: new Date()
        }).where(eq(users.id, user.id)).returning();
        userId = updatedUser.id;
      }
    } else {
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

app.post("/api/auth/verify", verifyLimiter, async (req, res) => {
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

    const [updatedUser] = await db.update(users).set({
      isVerified: true,
      verificationCode: null,
      verificationCodeExpiresAt: null
    })
      .where(eq(users.id, user.id))
      .returning();

    const token = jwt.sign({ id: updatedUser.id, email: updatedUser.email }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ token, user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/login", validateLogin, authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first", requiresVerification: true });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

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

app.get("/api/decks", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

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

app.post("/api/decks", authenticateToken, validateDeck, async (req, res) => {
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

app.put("/api/decks/:id", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const deckId = parseInt(req.params.id);
    const { title, category, language, cards: incomingCards, lastStudied } = req.body;

    console.log(`[PUT /api/decks/${deckId}] Updating deck`, req.body);

    const [deck] = await db.select().from(decks).where(and(eq(decks.id, deckId), eq(decks.userId, userId)));
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    let parsedLastStudied = deck.lastStudied;
    if (lastStudied && lastStudied !== "Nunca") {
      const d = new Date(lastStudied);
      if (!isNaN(d.getTime())) {
        parsedLastStudied = d;
      }
    }

    await db.update(decks).set({
      title: title || deck.title,
      category: category || deck.category,
      language: language || deck.language,
      lastStudied: parsedLastStudied
    }).where(eq(decks.id, deckId));

    if (incomingCards && Array.isArray(incomingCards)) {
      const existingCardsInDb = await db.select({ id: cards.id }).from(cards).where(eq(cards.deckId, deckId));
      const dbCardIds = existingCardsInDb.map(c => c.id);

      const incomingCardIds = incomingCards.map(c => c.id).filter(id => id && id <= 2147483647);
      const idsToDelete = dbCardIds.filter(id => !incomingCardIds.includes(id));

      if (idsToDelete.length > 0) {
        const { inArray } = await import("drizzle-orm");
        await db.delete(cards).where(and(eq(cards.deckId, deckId), inArray(cards.id, idsToDelete)));
      }

      for (const card of incomingCards) {
        if (card.id && typeof card.id === 'number' && card.id <= 2147483647) {
          await db.update(cards).set({
            question: card.question,
            answer: card.answer,
            nextReviewDate: card.nextReviewDate === null ? null : (card.nextReviewDate ? new Date(card.nextReviewDate) : undefined),
            lastReviewed: card.lastReviewed === null ? null : (card.lastReviewed ? new Date(card.lastReviewed) : undefined),
            interval: card.interval,
            difficulty: card.difficulty
          }).where(eq(cards.id, card.id));
        } else {
          await db.insert(cards).values({
            deckId: deckId,
            question: card.question,
            answer: card.answer,
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

app.put("/api/cards/:id", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const cardId = parseInt(req.params.id);
    const { difficulty, nextReviewDate, interval, lastReviewed } = req.body;

    const [card] = await db
      .select({ deckUserId: decks.userId })
      .from(cards)
      .innerJoin(decks, eq(cards.deckId, decks.id))
      .where(eq(cards.id, cardId));

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.deckUserId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

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

export default app;

if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  setInterval(() => { }, 60000);
}
