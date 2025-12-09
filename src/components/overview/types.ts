export interface Card {
  id: number;
  question: string;
  answer: string;
  difficulty?: "easy" | "good" | "medium" | "hard";
  lastReviewed?: Date;
  nextReviewDate?: string; // ISO string
  interval?: number; // Minutes
}

export interface Deck {
  id: number;
  title: string;
  category: string;
  cards: Card[];
  lastStudied?: string;
}

export type TabType =
  | "decks_view"
  | "decks_locked"
  | "library"
  | "stats_view"
  | "stats_locked";
