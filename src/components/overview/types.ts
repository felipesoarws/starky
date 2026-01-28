export interface Card {
  id: number;
  question: string;
  answer: string;
  difficulty?: "easy" | "good" | "medium" | "hard";
  lastReviewed?: Date | null;
  nextReviewDate?: string | null; // ISO string
  interval?: number | null; // Minutes
}

export interface Deck {
  id: number;
  title: string;
  category: string;
  cards: Card[];
  language?: string;
  lastStudied?: string;
}

export interface HistoryEntry {
  id: number;
  timestamp: string;
  deckTitle: string;
  cardQuestion: string;
  cardAnswer: string;
  difficulty: "easy" | "good" | "medium" | "hard";
}

export type TabType =
  | "decks_view"
  | "decks_locked"
  | "library"
  | "stats_view"
  | "stats_locked"
  | "history";
