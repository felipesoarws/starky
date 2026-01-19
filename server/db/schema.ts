import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  verificationCode: text("verification_code"),
  verificationCodeExpiresAt: timestamp("verification_code_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const decks = pgTable("decks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  lastStudied: timestamp("last_studied"),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").references(() => decks.id, { onDelete: 'cascade' }).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: text("difficulty"), // 'easy', 'medium', 'hard', 'good'
  lastReviewed: timestamp("last_reviewed"),
  nextReviewDate: timestamp("next_review_date"),
  interval: integer("interval"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  decks: many(decks),
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  user: one(users, {
    fields: [decks.userId],
    references: [users.id],
  }),
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one }) => ({
  deck: one(decks, {
    fields: [cards.deckId],
    references: [decks.id],
  }),
}));
