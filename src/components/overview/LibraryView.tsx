import { Download, Library, CirclePlus, Check } from "lucide-react";
import { Button } from "../ui/Button";
import type { Card, Deck } from "./types";

// Decks prontos
import decksThemes from "../../assets/data/links.json";

import inglesA1 from "../../assets/data/decks/starky_ingles_a1.json";
import inglesB1 from "../../assets/data/decks/starky_ingles_b1.json";
import inglesC1 from "../../assets/data/decks/starky_ingles_c1.json";
import ingles_corporativo from "../../assets/data/decks/starky_ingles_corporativo.json";

interface LibraryViewProps {
  decks: Deck[];
  onAddDeck: (deck: Deck) => void;
}

const LibraryView = ({ decks, onAddDeck }: LibraryViewProps) => {
  const savedDecks = [
    inglesA1[0],
    inglesB1[0],
    inglesC1[0],
    ingles_corporativo[0],
  ];

  const addDeckToDash = (deckName: string) => {
    const selectedDeck = savedDecks.find((deck) => deck.title === deckName);
    if (!selectedDeck) return;

    const isDeckAlreadyAdded = decks.some(
      (d) => d.title === selectedDeck.title
    );
    if (isDeckAlreadyAdded) {
      alert("Você já possui este deck na sua biblioteca!");
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
      ...selectedDeck,
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
      <div className="flex flex-wrap gap-18 items-center justify-start ">
        {decksThemes.map((deck, id) => {
          const isAdded = decks.some((d) => d.title == deck.title);

          return (
            <div
              key={id}
              className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/50 transition-all flex flex-col justify-between h-full min-h-[200px] w-[20rem] md:min-w-[20rem]"
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
                  <h3 className="text-left text-xl font-bold text-white mb-2 line-clamp-2">
                    {deck.title}
                  </h3>
                  <p className="mb-2 text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {deck.category}
                  </p>
                </div>
                <div className="text-sm text-zinc-400 mb-6 flex items-center gap-2">
                  <Library className="w-4 h-4" /> {deck.length} cards
                </div>
                <p className="text-left text-sm text-zinc-400 mb-6 flex items-center gap-2">
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
