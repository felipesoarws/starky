import { useState } from "react";
import Sidebar from "../components/overview/Sidebar";
import OverviewHeader from "../components/overview/OverviewHeader";
import StatsView from "../components/overview/StatsView";
import DecksView from "../components/overview/DecksView";
import LibraryView from "../components/overview/LibraryView";

import {
  ArrowLeft,
  CheckCircle,
  Layers,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { INITIAL_DECKS } from "../components/overview/decksData";

import type { Card, Deck, TabType } from "../components/overview/types";
import { Button } from "../components/ui/Button";

function Overview() {
  // View dividida de logada / não logada para ver o layout, dps tem que tirar
  const [activeTab, setActiveTab] = useState<TabType>("decks_view");

  // Estados gerais de visualização
  const [viewState, setViewState] = useState<"dashboard" | "study" | "editor">(
    "dashboard"
  );

  // Estados de pesquisa de decks/categorias
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Estados gerais dos decks
  const [decks, setDecks] = useState<Deck[]>(INITIAL_DECKS);

  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);

  const filteredDecks = decks.filter(
    (deck) =>
      deck.category
        .toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase()) ||
      deck.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  // Estado de notificação de um toast
  const [showToast, setShowToast] = useState(false);

  // FUNÇÕES DOS DECKS
  const handleSaveDeck = (savedDeck: Deck) => {
    // Checar se está atualizando ou criando um deck novo
    const exists = decks.find((d) => d.id === savedDeck.id);

    if (exists) {
      setDecks(decks.map((d) => (d.id === savedDeck.id ? savedDeck : d)));
    } else {
      setDecks([savedDeck, ...decks]);
    }

    setViewState("dashboard");
    setActiveDeck(null);

    // Toast de confirmação
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const startEditingDeck = (deck: Deck | null) => {
    setActiveDeck(deck);
    setViewState("editor");
  };

  const handleDeleteDeck = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este deck?")) {
      setDecks(decks.filter((d) => d.id !== id));
    }
  };

  const handleCreateDeck = () => {
    startEditingDeck(null);
  };

  // FUNÇÕES DAS CATEGGORIAS
  const handleDeleteCategory = (catName: string) => {
    if (
      window.confirm(
        `ATENÇÃO: Isso excluirá a categoria "${catName}" e TODOS os decks dentro dela. Continuar?`
      )
    ) {
      setDecks(decks.filter((d) => d.category !== catName));
    }
  };

  const handleUpdateCategory = (oldName: string, newName: string) => {
    if (newName.trim() && newName !== oldName) {
      setDecks(
        decks.map((d) =>
          d.category === oldName ? { ...d, category: newName } : d
        )
      );
    }
  };

  // TROCA DE VISUALIZAÇÃO
  if (viewState === "editor") {
    return (
      <DeckEditor
        deck={activeDeck}
        onSave={handleSaveDeck}
        onCancel={() => {
          setViewState("dashboard");
          setActiveDeck(null);
        }}
      />
    );
  }

  // FILTRO DE BUSCA

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden relative">
      <div className="block md:hidden">
        <OverviewHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="hidden md:block">
          <OverviewHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-dot-pattern">
          <div className="max-w-6xl mx-auto pb-20">
            {/* Decks  */}
            {(activeTab === "decks_view" || activeTab === "decks_locked") && (
              <DecksView
                decks={filteredDecks}
                isLocked={activeTab === "decks_locked"}
                onCreateDeck={handleCreateDeck}
                onEditDeck={startEditingDeck}
                onDeleteDeck={handleDeleteDeck}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            )}

            {/* Library  */}
            {activeTab === "library" && (
              <LibraryView decks={filteredDecks} onAddDeck={handleSaveDeck} />
            )}

            {/* Stats  */}
            {(activeTab === "stats_view" || activeTab === "stats_locked") && (
              <StatsView isLocked={activeTab === "stats_locked"} />
            )}
          </div>
        </div>

        {showToast && (
          <div className="fixed bottom-6 right-6 bg-zinc-900 border border-zinc-800 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
            <div className="w-6 h-6 rounded-full bg-green-900/30 flex items-center justify-center border border-green-500/20">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            </div>
            <div>
              <span className="font-semibold text-sm">Sucesso</span>
              <p className="text-xs text-zinc-400">Deck salvo com sucesso.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Overview;

// ----------------------------------------------------------------------
// SUB COMPONENTE: EDITOR DE DECKS (GERENCIAR DECKS E SUAS INFORMAÇÕES)
// ----------------------------------------------------------------------

interface DeckEditorProps {
  deck: Deck | null; /* Se for null é para entrar no modo de criação de deck */
  onSave: (deck: Deck) => void;
  onCancel: () => void;
}

export const DeckEditor = ({ deck, onSave, onCancel }: DeckEditorProps) => {
  const [title, setTitle] = useState(deck?.title || "");
  const [category, setCategory] = useState(deck?.category || "");
  const [cards, setCards] = useState<Card[]>(deck?.cards || []);

  // Controladores dos cards
  const handleAddCard = () => {
    const newCard: Card = {
      id: Date.now(),
      question: "",
      answer: "",
    };
    setCards([...cards, newCard]);
  };

  const handleUpdateCard = (
    id: number,
    field: "question" | "answer",
    value: string
  ) => {
    setCards(cards.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleDeleteCard = (id: number) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (!title.trim() || !category.trim()) {
      alert("Título e Categoria são obrigatórios");
      return;
    }

    const hasIncompleteCards = cards.some(
      (c) => !c.question.trim() || !c.answer.trim()
    );

    if (hasIncompleteCards) {
      alert("Todos os cards precisam ter Pergunta e Resposta preenchidas!");
      return;
    }

    const updatedDeck: Deck = {
      id: deck?.id || Date.now(),
      title,
      category,
      cards,
      lastStudied: deck?.lastStudied || "Nunca",
    };

    onSave(updatedDeck);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Button variant="ghost" size="md" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </div>

          <div className="block md:hidden">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </div>
          <div className="h-6 w-px bg-zinc-800"></div>
          <span className="font-bold text-white text-[.8rem] md:text-lg">
            {deck ? "Editar Deck" : "Novo Deck"}
          </span>
        </div>
        <div className="hidden md:block">
          <Button onClick={handleSave} size="md">
            <Save className="w-4 h-4 mr-2" /> Salvar Deck
          </Button>
        </div>

        <div className="block md:hidden">
          <Button onClick={handleSave} size="sm">
            <Save className="w-4 h-4 mr-2" /> Salvar Deck
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Título do Deck
            </label>
            <input
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: JavaScript Avançado"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Categoria
            </label>
            <input
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Programação"
            />
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent" /> Cards ({cards.length})
          </h3>
          <Button variant="secondary" onClick={handleAddCard}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar Card
          </Button>
        </div>

        <div className="space-y-4">
          {cards.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500">
              <p>Nenhum card adicionado ainda.</p>
              <Button
                variant="ghost"
                className="mt-2 text-accent"
                onClick={handleAddCard}
              >
                Adicionar o primeiro
              </Button>
            </div>
          )}

          {cards.map((card, index) => (
            <div
              key={card.id}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-4 items-start group hover:border-zinc-700 transition-colors"
            >
              <div className="pt-3 text-xs font-mono text-zinc-500 w-6">
                #{index + 1}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 mb-1 block uppercase">
                    Pergunta
                  </label>
                  <textarea
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:ring-1 focus:ring-accent outline-none resize-none min-h-20"
                    value={card.question}
                    onChange={(e) =>
                      handleUpdateCard(card.id, "question", e.target.value)
                    }
                    placeholder="Digite a pergunta..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 mb-1 block uppercase">
                    Resposta
                  </label>
                  <textarea
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-300 text-sm focus:ring-1 focus:ring-accent outline-none resize-none min-h-20"
                    value={card.answer}
                    onChange={(e) =>
                      handleUpdateCard(card.id, "answer", e.target.value)
                    }
                    placeholder="Digite a resposta..."
                  />
                </div>
              </div>

              <button
                onClick={() => handleDeleteCard(card.id)}
                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors mt-6"
                title="Remover Card"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            variant="secondary"
            onClick={handleAddCard}
            className="w-full md:w-auto border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" /> Adicionar Outro Card
          </Button>
        </div>
      </main>
    </div>
  );
};
