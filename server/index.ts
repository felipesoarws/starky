import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db";
import { users, decks, cards } from "./db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      name,
      email,
      passwordHash: hashedPassword,
    }).returning();

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
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
    const { title, category, cards: initialCards } = req.body;

    const [newDeck] = await db.insert(decks).values({
      title,
      category,
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
        const { title, category, cards: incomingCards, lastStudied } = req.body;
        
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
            lastStudied: parsedLastStudied 
        }).where(eq(decks.id, deckId));
        
        if (incomingCards && Array.isArray(incomingCards)) {
             for (const card of incomingCards) {
                 if (card.id && typeof card.id === 'number') {
                     // Check if this ID is a valid DB ID (not a timestamp from legacy/frontend gen)
                     // A timestamp like 1730000000000 is too big for integer usually if serial?
                     // Serial is integer (4 bytes) -> max 2.1 billion.
                     // Timestamp (ms) is 1.7 trillion. 
                     // Postgres 'integer' will overflow if we try to query where id = timestamp.
                     // IMPORTANT: Drizzle 'serial' maps to 'integer'. 
                     // If frontend sends Date.now() as ID, and we try to query `where(eq(cards.id, card.id))`
                     // It might crash because value out of range for integer type in SQL parameter?
                     // Or it might just not find it.
                     // Let's check range. Max int is ~2e9. Date.now() is ~1.7e12.
                     // So yes, passing Date.now() to an integer column query will likely fail or overflow.
                     
                     // Heuristic: If ID > 2147483647, it's a temp ID. Insert it as new.
                     
                     if (card.id > 2147483647) {
                         // Treat as new
                         await db.insert(cards).values({
                             deckId: deckId,
                             question: card.question,
                             answer: card.answer
                         });
                     } else {
                         // Try update
                         const existing = await db.select().from(cards).where(eq(cards.id, card.id));
                         if (existing.length > 0) {
                             await db.update(cards).set({
                                 question: card.question,
                                 answer: card.answer,
                                 // Update progress fields if they are present in the payload (null resets them)
                                 nextReviewDate: card.nextReviewDate === null ? null : (card.nextReviewDate ? new Date(card.nextReviewDate) : undefined),
                                 lastReviewed: card.lastReviewed === null ? null : (card.lastReviewed ? new Date(card.lastReviewed) : undefined),
                                 interval: card.interval
                             }).where(eq(cards.id, card.id));
                         } else {
                             // Insert
                             await db.insert(cards).values({
                                 deckId: deckId,
                                 question: card.question,
                                 answer: card.answer
                             });
                         }
                     }
                 } else {
                     // No ID, definitely new
                     await db.insert(cards).values({
                         deckId: deckId,
                         question: card.question,
                         answer: card.answer
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
