import { useState } from "react";
import { Download, Library, CirclePlus, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import type { Card, Deck } from "./types";
import { useAuth } from "../../context/AuthContext";

import decksThemes from "../../assets/data/links.json";

import inglesA1 from "../../assets/data/decks/ingles_a1.json";
import inglesB1 from "../../assets/data/decks/ingles_b1.json";
import inglesC1 from "../../assets/data/decks/ingles_c1.json";
import espanholA1 from "../../assets/data/decks/espanhol_a1.json";
import espanholB1 from "../../assets/data/decks/espanhol_b1.json";
import espanholC1 from "../../assets/data/decks/espanhol_c1.json";
import francesA1 from "../../assets/data/decks/frances_a1.json";
import francesB1 from "../../assets/data/decks/frances_b1.json";
import francesC1 from "../../assets/data/decks/frances_c1.json";
import italianoA1 from "../../assets/data/decks/italiano_a1.json";
import italianoB1 from "../../assets/data/decks/italiano_b1.json";
import italianoC1 from "../../assets/data/decks/italiano_c1.json";

interface LibraryViewProps {
  decks: Deck[];
  onAddDeck: (deck: Deck) => void;
}

import { useDialog } from "../../context/DialogContext";

const LibraryView = ({ decks, onAddDeck }: LibraryViewProps) => {
  const { showAlert } = useDialog();
  const savedDecks = [
    inglesA1[0],
    inglesB1[0],
    inglesC1[0],
    espanholA1[0],
    espanholB1[0],
    espanholC1[0],
    francesA1[0],
    francesB1[0],
    francesC1[0],
    italianoA1[0],
    italianoB1[0],
    italianoC1[0],
  ];

  const { isAuthenticated } = useAuth();

  const [addingDeckId, setAddingDeckId] = useState<string | null>(null);

  const addDeckToDash = async (deckName: string) => {
    if (!isAuthenticated) {
      showAlert("Acesso Restrito", "Crie uma conta gratuita para salvar este deck na sua biblioteca!");
      return;
    }

    const selectedDeck = savedDecks.find((deck) => deck.title === deckName);
    if (!selectedDeck) return;

    const isDeckAlreadyAdded = decks.some(
      (d) => d.title === selectedDeck.title
    );
    if (isDeckAlreadyAdded) {
      showAlert("Deck já adicionado", "Você já possui este deck na sua biblioteca!");
      return;
    }

    setAddingDeckId(deckName);

    try {
      const normalizedCards = selectedDeck.cards.map((card, idx) => {
        return {
          id: Date.now() + idx,
          question: card.question,
          answer: card.answer,
          difficulty: undefined,
          lastReviewed: null,
          nextReviewDate: null,
          interval: 0
        } satisfies Card;
      });

      let language = "pt-BR";
      const titleLower = selectedDeck.title.toLowerCase();
      if (titleLower.includes("inglês")) language = "en-US";
      else if (titleLower.includes("espanhol")) language = "es-ES";
      else if (titleLower.includes("francês")) language = "fr-FR";
      else if (titleLower.includes("italiano")) language = "it-IT";

      const normalizedDeck: Deck = {
        title: selectedDeck.title,
        category: selectedDeck.category,
        id: 0,
        lastStudied: "Nunca",
        cards: normalizedCards,
        language,
      };

      await onAddDeck(normalizedDeck);
    } finally {
      setAddingDeckId(null);
    }
  };

  const handleDownloadDeck = (deckTitle: string) => {
    const selectedDeck = savedDecks.find((deck) => deck.title === deckTitle);
    if (!selectedDeck) return;

    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      decks: [{
        title: selectedDeck.title,
        category: selectedDeck.category,
        cards: selectedDeck.cards.map((c: any) => ({
          question: c.question,
          answer: c.answer
        }))
      }]
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `starky-community-${selectedDeck.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in text-center py-20">
      <h2 className="text-3xl font-bold text-white mb-4">
        Biblioteca Comunitária
      </h2>
      <p className="text-zinc-400 mb-8">
        Baixe decks prontos criados pela comunidade Starky.
      </p>
      <div className="flex flex-wrap gap-10 items-start justify-center ">
        {decksThemes.map((deck, id) => {
          const isAdded = decks.some((d) => d.title == deck.title);

          return (
            <div
              key={id}
              className="lg:h-68 group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/50 transition-all flex flex-col justify-between h-full min-h-[200px] w-[20rem] md:min-w-[20rem]"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-2 w-10 rounded-full bg-zinc-800 group-hover:bg-accent/50 transition-colors"></div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDownloadDeck(deck.title)}
                      className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                      title="Baixar JSON (Importável)"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <h3 className="text-left text-[1.1rem] font-bold text-white mb-2 line-clamp-2">
                    {deck.title}
                  </h3>
                  <p className="mb-2 text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {deck.category}
                  </p>
                </div>
                <div className="text-sm text-zinc-400 mb-6 flex items-center gap-2">
                  <Library className="w-4 h-4" /> {deck.length} cards
                </div>
                <p className="text-left text-[1rem] text-zinc-400 mb-6 flex items-center gap-2">
                  {deck.description}
                </p>
                <div>
                  <Button
                    variant={isAdded ? "secondary" : "primary"}
                    className={`w-full justify-center ${(isAdded || addingDeckId === deck.title) ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => addDeckToDash(deck.title)}
                    disabled={isAdded || addingDeckId === deck.title}
                  >
                    {addingDeckId === deck.title ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adicionando...
                      </>
                    ) : isAdded ? (
                      <>
                        <Check className="w-4 h-4 mr-2" /> Adicionado
                      </>
                    ) : (
                      <>
                        <CirclePlus className="w-4 h-4 mr-2" /> Adicionar Deck
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryView;
