import { useState } from "react";
import {
  CheckCircle,
  ChevronRight,
  Edit2,
  Folder,
  LayoutGrid,
  Library,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../ui/Button";
import type { Deck } from "./types";

interface DecksViewProps {
  decks: Deck[];
  isLocked: boolean;
  onCreateDeck: () => void;
  onEditDeck: (deck: Deck) => void;
  onDeleteDeck: (id: number) => void;
  onStudyDeck: (deck: Deck) => void;
  onUpdateCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (categoryName: string) => void;
}

const DecksView = ({
  decks,
  isLocked,
  onCreateDeck,
  onEditDeck,
  onDeleteDeck,
  onStudyDeck,
  onUpdateCategory,
  onDeleteCategory,
}: DecksViewProps) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const uniqueCategories: string[] = Array.from(
    new Set(decks.map((d) => d.category))
  );

  const startEditCategory = (catName: string) => {
    setEditingCategory(catName);
    setNewCategoryName(catName);
  };

  const saveCategoryName = (oldName: string) => {
    onUpdateCategory(oldName, newCategoryName);
    setEditingCategory(null);
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
          <Folder className="w-8 h-8 text-zinc-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Crie sua conta</h2>
        <p className="text-zinc-400 max-w-md mb-8">
          Para criar e salvar seus próprios decks de estudo, você precisa de uma
          conta gratuita no Starky.
        </p>
        <Button size="lg" className="w-full sm:w-auto">
          Criar Conta Grátis
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Meus Decks
          </h1>
          <p className="text-zinc-400">Gerencie seus decks e categorias.</p>
        </div>

        <div className="hidden md:block">
          <Button onClick={onCreateDeck} size="md">
            <Plus className="w-4 h-4 mr-2" /> Novo Deck
          </Button>
        </div>

        <div className="block md:hidden">
          <Button onClick={onCreateDeck} size="sm">
            <Plus className="w-4 h-4 mr-2" /> Novo Deck
          </Button>
        </div>
      </div>

      {decks.length === 0 && (
        <div className="text-center p-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
          <LayoutGrid className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Você ainda não tem decks
          </h3>
          <p className="text-zinc-500 mb-6">
            Crie seu primeiro deck para começar.
          </p>
          <Button onClick={onCreateDeck}>Criar Deck</Button>
        </div>
      )}

      {uniqueCategories.map((category) => {
        const categoryDecks = decks.filter((d) => d.category === category);

        return (
          <div key={category} className="animate-slide-up">
            <div className="flex items-center gap-4 mb-6 pb-2 border-b border-zinc-800/50">
              <div className="flex items-center gap-3 flex-1">
                <Folder className="w-5 h-5 text-(--accent-color)" />
                {editingCategory === category ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-lg font-bold outline-none focus:border-(--accent-color)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={() => saveCategoryName(category)}
                      className="p-1 hover:text-green-400 text-zinc-400"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="p-1 hover:text-red-400 text-zinc-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold text-white">{category}</h2>
                )}
                <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">
                  {categoryDecks.length}
                </span>
              </div>

              {/* Ações de categoria */}
              <div className="flex items-center md:gap-2">
                <button
                  onClick={() => startEditCategory(category)}
                  className="text-xs font-medium text-zinc-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3 h-3" /> Editar
                </button>
                <button
                  onClick={() => onDeleteCategory(category)}
                  className="text-xs font-medium text-zinc-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-900/10 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3 h-3" /> Excluir Grupo
                </button>
              </div>
            </div>

            {/* Grid de decks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 gap-y-12">
              {categoryDecks.map((deck) => (
                <div
                  key={deck.id}
                  className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/50 transition-all flex flex-col justify-between h-full min-h-[200px] w-[20rem] md:min-w-[20rem]"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-2 w-10 rounded-full bg-zinc-800 group-hover:bg-accent/50 transition-colors"></div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditDeck(deck)}
                          className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg"
                          title="Editar Deck"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDeck(deck.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg"
                          title="Excluir Deck"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {deck.title}
                    </h3>
                    <div className="text-sm text-zinc-400 mb-6 flex items-center gap-2">
                      <Library className="w-4 h-4" /> {deck.cards.length} cards
                    </div>
                  </div>

                    <div>
                    <Button 
                      className="w-full justify-between group/btn"
                      onClick={() => onStudyDeck(deck)}
                    >
                      Estudar Agora{" "}
                      <ChevronRight className="w-4 h-4 text-white/50 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DecksView;
