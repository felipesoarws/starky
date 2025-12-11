import { Download, Library, CirclePlus, Check } from "lucide-react";
import { Button } from "../ui/Button";
import type { Card, Deck } from "./types";
import { useAuth } from "../../context/AuthContext";

// Decks prontos
import decksThemes from "../../assets/data/links.json";

import inglesA1 from "../../assets/data/decks/starky_ingles_a1.json";
import inglesB1 from "../../assets/data/decks/starky_ingles_b1.json";
import inglesC1 from "../../assets/data/decks/starky_ingles_c1.json";
import ingles_corporativo from "../../assets/data/decks/starky_ingles_corporativo.json";
import geografia from "../../assets/data/decks/starky_geografia.json";
import ciencia from "../../assets/data/decks/starky_ciencia.json";
import historia from "../../assets/data/decks/starky_historia.json";
import cinema from "../../assets/data/decks/starky_cinema.json";

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
    ingles_corporativo[0],
    geografia[0],
    ciencia[0],
    historia[0],
    cinema[0],
  ];

  const { isAuthenticated } = useAuth();
  
  const addDeckToDash = (deckName: string) => {
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

    const normalizedCards = selectedDeck.cards.map((card, idx) => {
      if ("id" in card) {
        return card as Card;
      }

      return {
        id: Date.now() + idx,
        question: card.question,
        answer: card.answer,
      } satisfies Card;
    });

    const normalizedDeck: Deck = {
      title: selectedDeck.title,
      category: selectedDeck.category,
      // No ID, so it is treated as creation
      id: 0, 
      lastStudied: "Nunca",
      cards: normalizedCards,
    };

    onAddDeck(normalizedDeck);
  };

  return (
    <div className="animate-fade-in text-center py-20">
      <h2 className="text-3xl font-bold text-white mb-4">
        Biblioteca Comunitária
      </h2>
      <p className="text-zinc-400 mb-8">
        Baixe decks prontos criados pela comunidade Starky.
      </p>
      <div className="flex flex-wrap gap-18 items-start justify-start ">
        {decksThemes.map((deck, id) => {
          const isAdded = decks.some((d) => d.title == deck.title);

          return (
            <div
              key={id}
              className="lg:h-[17rem] group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/50 transition-all flex flex-col justify-between h-full min-h-[200px] w-[20rem] md:min-w-[20rem]"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-2 w-10 rounded-full bg-zinc-800 group-hover:bg-accent/50 transition-colors"></div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={deck.file} download>
                      <button
                        className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                        title="Baixar Deck"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </a>
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
                <p className="text-left text-[0.8rem] text-zinc-400 mb-6 flex items-center gap-2">
                  {deck.description}
                </p>
                <div>
                  <Button
                    variant={isAdded ? "secondary" : "primary"}
                    className={`w-full justify-center ${isAdded ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => addDeckToDash(deck.title)}
                    disabled={isAdded}
                  >
                    {isAdded ? (
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
