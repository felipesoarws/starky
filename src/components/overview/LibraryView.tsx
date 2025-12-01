// Decks prontos
import { Download, Library, CirclePlus } from "lucide-react";
import decksThemes from "../../assets/data/links.json";
import { Button } from "../ui/Button";

const LibraryView = () => {
  const addDeckToDash = (deckName: string, filePath: string) => {
    console.log(deckName, filePath);
  };

  return (
    <div className="animate-fade-in text-center py-20">
      <h2 className="text-3xl font-bold text-white mb-4">
        Biblioteca Comunitária
      </h2>
      <p className="text-zinc-400 mb-8">
        Baixe decks prontos criados pela comunidade Starky.
      </p>
      <div className="flex flex-wrap gap-18 items-center justify-center ">
        {decksThemes.map((deck, id) => (
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
              <h3 className="text-left text-xl font-bold text-white mb-2 line-clamp-2">
                {deck.category}
              </h3>
              <div className="text-sm text-zinc-400 mb-6 flex items-center gap-2">
                <Library className="w-4 h-4" /> {deck.length} cards
              </div>
              <p className="text-sm text-zinc-400 mb-6 flex items-center gap-2">
                {deck.description}
              </p>
              <div>
                <Button
                  onClick={() => addDeckToDash(deck.category, deck.file)}
                  className="w-full justify-between group/btn"
                >
                  Adicionar Deck
                  <CirclePlus className="w-4 h-4 text-white/50 group-hover/btn:scale-110 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryView;
