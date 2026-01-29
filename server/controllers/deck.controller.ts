import { Request, Response } from "express";
import { db } from "../db/index.js";
import { decks, cards, history } from "../db/schema.js";
import { eq, and, desc, inArray } from "drizzle-orm";
import { StudyService, Difficulty } from "../services/study.service.js";

export class DeckController {
    static async getDecks(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const userDecks = await db.query.decks.findMany({
                where: eq(decks.userId, userId),
                with: { cards: true },
                orderBy: (decks, { desc }) => [desc(decks.createdAt)],
            });
            res.json(userDecks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async createDeck(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { title, category, language, cards: initialCards } = req.body;

            const [newDeck] = await db.insert(decks).values({
                title,
                category,
                language: language || "pt-BR",
                userId,
            }).returning();

            if (initialCards && initialCards.length > 0) {
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
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateDeck(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const deckId = parseInt(req.params.id);
            const { title, category, language, cards: incomingCards, lastStudied } = req.body;

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
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteDeck(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const deckId = parseInt(req.params.id);

            const [deck] = await db.select().from(decks).where(and(eq(decks.id, deckId), eq(decks.userId, userId)));
            if (!deck) return res.status(404).json({ message: "Deck not found" });

            await db.delete(decks).where(eq(decks.id, deckId));
            res.json({ message: "Deleted" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateCardStudy(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const cardId = parseInt(req.params.id);
            const { difficulty } = req.body;

            if (!difficulty) {
                return res.status(400).json({ message: "Difficulty is required" });
            }

            const [card] = await db
                .select({ id: cards.id, deckUserId: decks.userId })
                .from(cards)
                .innerJoin(decks, eq(cards.deckId, decks.id))
                .where(eq(cards.id, cardId));

            if (!card) {
                return res.status(404).json({ message: "Card not found" });
            }

            if (card.deckUserId !== userId) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            // integração da regra de negócio (srs)
            const srsUpdate = StudyService.calculateSRS(difficulty as Difficulty);

            await db.update(cards).set({
                difficulty,
                nextReviewDate: srsUpdate.nextReviewDate,
                interval: srsUpdate.interval,
                lastReviewed: new Date()
            }).where(eq(cards.id, cardId));

            res.json({ message: "Updated", ...srsUpdate });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteCategory(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const categoryName = req.params.name;
            await db.delete(decks).where(and(eq(decks.userId, userId), eq(decks.category, categoryName)));
            res.json({ message: "Category deleted" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async renameCategory(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const oldName = req.params.name;
            const { newName } = req.body;
            if (!newName) return res.status(400).json({ message: "New name required" });

            await db.update(decks).set({ category: newName }).where(and(eq(decks.userId, userId), eq(decks.category, oldName)));
            res.json({ message: "Category updated" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getHistory(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const userHistory = await db.select().from(history).where(eq(history.userId, userId)).orderBy(desc(history.reviewedAt));
            res.json(userHistory);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async createHistory(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { deckTitle, cardQuestion, cardAnswer, difficulty } = req.body;
            const [newEntry] = await db.insert(history).values({ userId, deckTitle, cardQuestion, cardAnswer, difficulty }).returning();
            res.json(newEntry);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteHistory(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            await db.delete(history).where(eq(history.userId, userId));
            res.json({ message: "History cleared" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
