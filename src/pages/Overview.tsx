import { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { useSearchParams } from "react-router";
import Sidebar from "../components/overview/Sidebar";
import OverviewHeader from "../components/overview/OverviewHeader";
import StatsView from "../components/overview/StatsView";
import DecksView from "../components/overview/DecksView";
import LibraryView from "../components/overview/LibraryView";
import StudySession from "../components/overview/StudySession";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogContext";

import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Layers,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { Button } from "../components/ui/Button";

import { API_URL } from "../config";
import HistoryView from "../components/overview/HistoryView";
import type { Card, Deck, TabType, HistoryEntry } from "../components/overview/types";

function Overview() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { showAlert, showConfirm } = useDialog();

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "library") return "library";
    return "decks_view";
  });

  const [viewState, setViewState] = useState<"dashboard" | "study" | "editor">(
    "dashboard"
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const loadDecks = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("starky_token");
          const res = await fetch(`${API_URL}/decks`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setDecks(data);
          }
        } catch (error) {
          console.error("Falha ao carregar decks", error);
        }
      } else {
        setDecks([]);
      }
    };
    loadDecks();
  }, [user]);

  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [showMasteredPopup, setShowMasteredPopup] = useState(false);
  const [studySessionCards, setStudySessionCards] = useState<Card[]>([]);

  const filteredDecks = decks.filter(
    (deck) =>
      deck.category
        .toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase()) ||
      deck.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  const [toastConfig, setToastConfig] = useState<{
    show: boolean;
    message: string;
    type: "success" | "info";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setToastConfig({ show: true, message, type });
    setTimeout(() => setToastConfig(prev => ({ ...prev, show: false })), 3000);
  };

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("starky_token");
          const res = await fetch(`${API_URL}/history`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setHistory(data.map((entry: any) => ({
              ...entry,
              timestamp: entry.reviewedAt
            })));
          }
        } catch (error) {
          console.error("Falha ao carregar histórico", error);
        }
      } else {
        setHistory([]);
      }
    };
    loadHistory();
  }, [user]);

  const addToHistory = async (deck: Deck, card: Card, difficulty: "easy" | "good" | "medium" | "hard") => {
    const entryData = {
      deckTitle: deck.title,
      cardQuestion: card.question,
      cardAnswer: card.answer,
      difficulty
    };

    if (user) {
      try {
        const token = localStorage.getItem("starky_token");
        const res = await fetch(`${API_URL}/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(entryData)
        });
        if (res.ok) {
          const newEntry = await res.json();
          setHistory(prev => [{ ...newEntry, timestamp: newEntry.reviewedAt }, ...prev]);
        }
      } catch (error) {
        console.error("Falha ao salvar no histórico", error);
      }
    } else {
      const tempEntry: HistoryEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...entryData
      };
      setHistory(prev => [tempEntry, ...prev]);
    }
  };

  const clearHistory = () => {
    showConfirm("Limpar Histórico", "Tem certeza? Isso apagará todo o registro de revisões permanentemente.", async () => {
      if (user) {
        try {
          const token = localStorage.getItem("starky_token");
          const res = await fetch(`${API_URL}/history`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            setHistory([]);
            showNotification("Histórico limpo com sucesso.");
          }
        } catch (error) {
          console.error("Falha ao limpar histórico", error);
        }
      } else {
        setHistory([]);
        showNotification("Histórico limpo.");
      }
    });
  };

  const handleSaveDeck = async (savedDeck: Deck) => {
    if (user) {
      try {
        const token = localStorage.getItem("starky_token");
        const isUpdate = !!savedDeck.id && decks.some(d => d.id === savedDeck.id);

        let url = `${API_URL}/decks`;
        let method = "POST";

        if (isUpdate) {
          url = `${API_URL}/decks/${savedDeck.id}`;
          method = "PUT";
        }

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(savedDeck)
        });

        if (res.ok) {
          const updatedDeck = await res.json();
          if (isUpdate) {
            setDecks(decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));
          } else {
            setDecks([updatedDeck, ...decks]);
          }
          showNotification("Deck salvo com sucesso.");
        } else {
          showAlert("Erro", "Erro ao salvar deck");
        }
      } catch (error) {
        console.error(error);
        showAlert("Erro", "Erro de conexão");
      }
    } else {
      const exists = decks.find((d) => d.id === savedDeck.id);
      if (exists) {
        setDecks(decks.map((d) => (d.id === savedDeck.id ? savedDeck : d)));
      } else {
        setDecks([savedDeck, ...decks]);
      }
      showNotification("Deck salvo (apenas localmente).");
    }

    setViewState("dashboard");
    setActiveDeck(null);
  };

  const startEditingDeck = (deck: Deck | null) => {
    if (!isAuthenticated) {
      showAlert("Acesso Restrito", "Você precisa estar logado para criar/editar decks personalizados.");
      return;
    }
    setActiveDeck(deck);
    setViewState("editor");
  };

  const handleDeleteDeck = async (id: number) => {
    showConfirm("Excluir Deck", "Tem certeza que deseja excluir este deck?", async () => {
      if (user) {
        try {
          const token = localStorage.getItem("starky_token");
          await fetch(`${API_URL}/decks/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          setDecks(decks.filter((d) => d.id !== id));
        } catch (err) {
          console.error(err);
          showAlert("Erro", "Erro ao excluir");
        }
      } else {
        setDecks(decks.filter((d) => d.id !== id));
      }
    });
  };

  const handleCreateDeck = () => {
    startEditingDeck(null);
  };

  const handleUpdateCardInDeck = async (deckId: number, card: Card) => {
    if (card.difficulty) {
      const deck = decks.find(d => d.id === deckId);
      if (deck) {
        addToHistory(deck, card, card.difficulty);
      }
    }

    setDecks((prevDecks) =>
      prevDecks.map((d) => {
        if (d.id === deckId) {
          return {
            ...d,
            cards: d.cards.map((c) => (c.id === card.id ? card : c)),
            lastStudied: new Date().toLocaleDateString(),
          };
        }
        return d;
      })
    );

    if (user) {
      try {
        const token = localStorage.getItem("starky_token");
        await fetch(`${API_URL}/cards/${card.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            difficulty: card.difficulty,
            nextReviewDate: card.nextReviewDate,
            interval: card.interval,
            lastReviewed: card.lastReviewed
          })
        });
      } catch (error) {
        console.error("Falha ao sincronizar progresso do card", error);
      }
    }

    if (activeDeck && activeDeck.id === deckId) {
      setActiveDeck((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          cards: prev.cards.map((c) => (c.id === card.id ? card : c)),
        };
      });
    }
  };

  const handleStudyDeck = (deck: Deck) => {
    const cardsToReview = deck.cards.filter((card) => {
      if (!card.nextReviewDate) return true;
      return new Date(card.nextReviewDate) <= new Date();
    });

    if (cardsToReview.length === 0) {
      showNotification("Tudo em dia! Nenhum card para revisar neste deck agora.", "info");
      return;
    }

    setStudySessionCards(cardsToReview);
    setActiveDeck(deck);
    setViewState("study");
  };

  const handleDeleteCategory = async (catName: string) => {
    showConfirm("Excluir Categoria", `ATENÇÃO: Isso excluirá a categoria "${catName}" e TODOS os decks dentro dela. Continuar?`, async () => {
      if (user) {
        try {
          const token = localStorage.getItem("starky_token");
          await fetch(`${API_URL}/categories/${encodeURIComponent(catName)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          setDecks(decks.filter((d) => d.category !== catName));
        } catch (err) {
          console.error("Erro ao excluir categoria", err);
          showAlert("Erro", "Erro ao excluir categoria");
        }
      } else {
        setDecks(decks.filter((d) => d.category !== catName));
      }
    });
  };

  const handleUpdateCategory = async (oldName: string, newName: string) => {
    if (newName.trim() && newName !== oldName) {
      if (user) {
        try {
          const token = localStorage.getItem("starky_token");
          await fetch(`${API_URL}/categories/${encodeURIComponent(oldName)}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ newName })
          });
          setDecks(
            decks.map((d) =>
              d.category === oldName ? { ...d, category: newName } : d
            )
          );
        } catch (err) {
          console.error("Erro ao renomear categoria", err);
          showAlert("Erro", "Erro ao atualizar categoria");
        }
      } else {
        setDecks(
          decks.map((d) =>
            d.category === oldName ? { ...d, category: newName } : d
          )
        );
      }
    }
  };

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedDeckIds, setSelectedDeckIds] = useState<number[]>([]);

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedDeckIds([]);
  };

  const handleToggleDeckSelection = (id: number) => {
    setSelectedDeckIds(prev =>
      prev.includes(id)
        ? prev.filter(d => d !== id)
        : [...prev, id]
    );
  };

  const handleExportConfirm = () => {
    const decksToExport = decks.filter(d => selectedDeckIds.includes(d.id));

    if (decksToExport.length === 0) return;

    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      decks: decksToExport.map(d => ({
        title: d.title,
        category: d.category,
        cards: d.cards.map(c => ({
          question: c.question,
          answer: c.answer
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `starky-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification(`${decksToExport.length} decks exportados com sucesso!`);
    setIsSelectionMode(false);
    setSelectedDeckIds([]);
  };

  const handleImportDecks = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) return;

        const data = JSON.parse(text);
        if (!data.decks || !Array.isArray(data.decks)) {
          showAlert("Arquivo inválido", "O arquivo JSON não segue o formato esperado (falta array 'decks').");
          return;
        }

        const decksToImport = data.decks;
        let successCount = 0;
        const token = localStorage.getItem("starky_token");

        if (!token) {
          showAlert("Erro", "Você precisa estar logado para importar.");
          return;
        }

        showNotification(`Importando ${decksToImport.length} decks...`, "info");

        for (const deck of decksToImport) {
          try {
            const payload = {
              title: deck.title,
              category: deck.category || "Importados",
              cards: deck.cards.map((c: any, idx: number) => ({
                id: Date.now() + idx,
                question: c.question,
                answer: c.answer,
                lastReviewed: null,
                nextReviewDate: null,
                interval: 0,
                difficulty: undefined
              }))
            };

            const res = await fetch(`${API_URL}/decks`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(payload)
            });

            if (res.ok) {
              successCount++;
            }
          } catch (err) {
            console.error("Failed to import deck", deck.title, err);
          }
        }

        if (successCount > 0) {
          const res = await fetch(`${API_URL}/decks`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const newData = await res.json();
            setDecks(newData);
          }
          showNotification(`${successCount} decks importados com sucesso!`);
        } else {
          showAlert("Erro na importação", "Não foi possível importar os decks.");
        }

      } catch (error) {
        console.error(error);
        showAlert("Erro", "Falha ao ler o arquivo.");
      }
    };
    reader.readAsText(file);
  };

  if (viewState === "editor") {
    return (
      <DeckEditor
        deck={activeDeck}
        onSave={handleSaveDeck}
        showAlert={showAlert}
        onCancel={() => {
          setViewState("dashboard");
          setActiveDeck(null);
        }}
      />
    );
  }

  if (viewState === "study" && activeDeck) {
    const studyDeck: Deck = {
      ...activeDeck,
      cards: studySessionCards
    };

    return (
      <StudySession
        deck={studyDeck}
        onUpdateCard={(card) => handleUpdateCardInDeck(activeDeck.id, card)}
        onFinish={() => {
          if (activeDeck) {
            const isMastered = activeDeck.cards.length > 0 && activeDeck.cards.every(c => c.difficulty === 'easy');
            if (isMastered) {
              setShowMasteredPopup(true);
            }
          }
          setViewState("dashboard");
          setActiveDeck(null);
        }}
        onCancel={() => {
          setViewState("dashboard");
          setActiveDeck(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden relative">
      <SEO
        title="Starky | Visão Geral"
        description="Gerencie seus decks, acompanhe estatísticas e estude com repetição espaçada no Starky."
        canonical="https://starky.app/overview"
      />

      {showMasteredPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full text-center relative animate-slide-up shadow-2xl shadow-emerald-900/20">
            <button
              onClick={() => setShowMasteredPopup(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <Trash2 className="w-5 h-5 opacity-0 cursor-default" />
            </button>
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-500/20">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Parabéns!</h2>
            <p className="text-zinc-400 mb-8 text-lg">
              Você dominou este deck! Todos os cards foram marcados como <strong className="text-emerald-400">Fácil</strong>.
            </p>
            <Button
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-900/50"
              onClick={() => setShowMasteredPopup(false)}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}
      <div className="block md:hidden">
        <OverviewHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          activeTab={activeTab}
        />
      </div>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onImport={handleImportDecks}
        onExportConfirm={handleExportConfirm}
        isSelectionMode={isSelectionMode}
        onToggleSelectionMode={handleToggleSelectionMode}
        selectedCount={selectedDeckIds.length}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="hidden md:block">
          <OverviewHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSelectionMode={isSelectionMode}
            onToggleSelectionMode={handleToggleSelectionMode}
            onExportConfirm={handleExportConfirm}
            selectedCount={selectedDeckIds.length}
            onImport={handleImportDecks}
            activeTab={activeTab}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-dot-pattern">
          <div className="max-w-6xl mx-auto pb-20">
            {(activeTab === "decks_view" || activeTab === "decks_locked") && (
              <DecksView
                decks={filteredDecks}
                isLocked={!isAuthenticated}
                onCreateDeck={handleCreateDeck}
                onEditDeck={startEditingDeck}
                onDeleteDeck={handleDeleteDeck}
                onStudyDeck={handleStudyDeck}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                isSelectionMode={isSelectionMode}
                selectedDeckIds={selectedDeckIds}
                onToggleDeckSelection={handleToggleDeckSelection}
              />
            )}

            {activeTab === "library" && (
              <LibraryView decks={filteredDecks} onAddDeck={handleSaveDeck} />
            )}

            {(activeTab === "stats_view" || activeTab === "stats_locked") && (
              <StatsView isLocked={!isAuthenticated} decks={decks} />
            )}

            {activeTab === "history" && (
              <HistoryView history={history} onClearHistory={clearHistory} />
            )}
          </div>
        </div>

        {toastConfig.show && (
          <div className="fixed bottom-6 right-6 bg-zinc-900 border border-zinc-800 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${toastConfig.type === 'success'
              ? 'bg-green-900/30 border-green-500/20 text-green-500'
              : 'bg-blue-900/30 border-blue-500/20 text-blue-500'
              }`}>
              {toastConfig.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            </div>
            <div>
              <span className="font-semibold text-sm">
                {toastConfig.type === 'success' ? 'Sucesso' : 'Aviso'}
              </span>
              <p className="text-xs text-zinc-400">{toastConfig.message}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Overview;

interface DeckEditorProps {
  deck: Deck | null;
  onSave: (deck: Deck) => void;
  onCancel: () => void;
  showAlert: (title: string, description?: string) => void;
}

export const DeckEditor = ({ deck, onSave, onCancel, showAlert }: DeckEditorProps) => {
  const [title, setTitle] = useState(deck?.title || "");
  const [category, setCategory] = useState(deck?.category || "");
  const [language, setLanguage] = useState(deck?.language || "pt-BR");
  const [cards, setCards] = useState<Card[]>(deck?.cards || []);

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
    setCards(cards.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          [field]: value,
          nextReviewDate: null,
          lastReviewed: null,
          interval: null,
          difficulty: undefined
        };
      }
      return c;
    }));
  };

  const handleDeleteCard = (id: number) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (!title.trim() || !category.trim()) {
      showAlert("Campos Obrigatórios", "Título e Categoria são obrigatórios");
      return;
    }

    const hasIncompleteCards = cards.some(
      (c) => !c.question.trim() || !c.answer.trim()
    );

    if (hasIncompleteCards) {
      showAlert("Cards Incompletos", "Todos os cards precisam ter Pergunta e Resposta preenchidas!");
      return;
    }

    const updatedDeck: Deck = {
      id: deck?.id || Date.now(),
      title,
      category,
      cards,
      language,
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Idioma do Áudio
            </label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all appearance-none cursor-pointer"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">Inglês (EUA)</option>
              <option value="en-GB">Inglês (UK)</option>
              <option value="es-ES">Espanhol (Espanha)</option>
              <option value="fr-FR">Francês</option>
              <option value="de-DE">Alemão</option>
              <option value="it-IT">Italiano</option>
              <option value="ja-JP">Japonês</option>
            </select>
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
                <div className="md:col-span-2">
                  {card.difficulty === 'easy' && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4 flex items-start gap-3 animate-fade-in">
                      <div className="text-yellow-500 mt-0.5">⚠️</div>
                      <div className="text-xs text-yellow-200">
                        <strong className="block text-yellow-500 mb-1">Atenção</strong>
                        Este card está marcado como <span className="text-emerald-400 font-bold">Dominado</span>.
                        Qualquer alteração reiniciará seu progresso de aprendizado.
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-zinc-500 block uppercase">
                      Pergunta
                    </label>
                    <span className={`text-[10px] font-mono ${card.question.length >= 500 ? 'text-red-500' : 'text-zinc-600'}`}>
                      {card.question.length}/500
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:ring-1 focus:ring-accent outline-none resize-none min-h-20"
                    value={card.question}
                    maxLength={500}
                    onChange={(e) =>
                      handleUpdateCard(card.id, "question", e.target.value)
                    }
                    placeholder="Digite a pergunta..."
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-zinc-500 block uppercase">
                      Resposta
                    </label>
                    <span className={`text-[10px] font-mono ${card.answer.length >= 500 ? 'text-red-500' : 'text-zinc-600'}`}>
                      {card.answer.length}/500
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-300 text-sm focus:ring-1 focus:ring-accent outline-none resize-none min-h-20"
                    value={card.answer}
                    maxLength={500}
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
