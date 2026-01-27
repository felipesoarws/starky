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


import type { Card, Deck, TabType } from "../components/overview/types";
import { Button } from "../components/ui/Button";

import { API_URL } from "../config";

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

  // estados gerais de visualização
  const [viewState, setViewState] = useState<"dashboard" | "study" | "editor">(
    "dashboard"
  );

  // estados de pesquisa de decks/categorias
  const [searchQuery, setSearchQuery] = useState<string>("");

  // estados gerais dos decks
  const [decks, setDecks] = useState<Deck[]>([]);

  // carregar decks quando o usuário mudar
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
        // modo visitante (dados efêmeros)
        setDecks([]);
      }
    };
    loadDecks();
  }, [user]);



  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);

  // snapshot dos cards pra sessão de estudo (evita que cards sumam ao atualizar data)
  const [studySessionCards, setStudySessionCards] = useState<Card[]>([]);

  const filteredDecks = decks.filter(
    (deck) =>
      deck.category
        .toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase()) ||
      deck.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  // estado de notificação (toast)
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

  // funções dos decks
  const handleSaveDeck = async (savedDeck: Deck) => {
    if (user) {
      try {
        const token = localStorage.getItem("starky_token");
        // só trata como atualização se o id for verdadeiro (não 0) e existir na lista atual
        const isUpdate = !!savedDeck.id && decks.some(d => d.id === savedDeck.id);

        let url = `${API_URL}/decks`;
        let method = "POST";

        // nota: a lógica permite criar novo deck mesmo se id estiver presente (se veio do fluxo de criação local com date.now())
        // mas se corresponder a um id real do db (do estado decks), é uma atualização
        // precisamos ter cuidado com colisão de id entre date.now() e id serial do db
        // ids do db geralmente são inteiros pequenos. date.now() é enorme
        // vamos supor que se existir no estado 'decks' atual, é uma atualização

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
      // lógica de visitante
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
      // bloqueio extra caso ui falhe, mas a ui já deve bloquear
      // avisa o usuário
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
    // atualização otimista
    setDecks((prevDecks) =>
      prevDecks.map((d) => {
        if (d.id === deckId) {
          return {
            ...d,
            cards: d.cards.map((c) => (c.id === card.id ? card : c)),
            lastStudied: new Date().toLocaleDateString(), // UI format
          };
        }
        return d;
      })
    );

    if (user) {
      try {
        const token = localStorage.getItem("starky_token");
        // chamada api (disparar e esquecer ou tratar erro)
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

    // atualiza também o deck ativo síncronamente pra ui refletir
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
    // verificar se há cards pra revisar agora
    const cardsToReview = deck.cards.filter((card) => {
      if (!card.nextReviewDate) return true; // nunca estudado
      return new Date(card.nextReviewDate) <= new Date(); // vencido
    });

    if (cardsToReview.length === 0) {
      showNotification("Tudo em dia! Nenhum card para revisar neste deck agora.", "info");
      return;
    }

    setStudySessionCards(cardsToReview); // congela a lista pra sessão
    setActiveDeck(deck);
    setViewState("study");
  };

  // funções das categorias
  const handleDeleteCategory = async (catName: string) => {
    showConfirm("Excluir Categoria", `ATENÇÃO: Isso excluirá a categoria "${catName}" e TODOS os decks dentro dela. Continuar?`, async () => {
      if (user) {
        try {
          const token = localStorage.getItem("starky_token");
          await fetch(`${API_URL}/categories/${encodeURIComponent(catName)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          // atualização otimista
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
          // atualização otimista
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

  // troca de visualização

  // --- modo exportação ---
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedDeckIds, setSelectedDeckIds] = useState<number[]>([]);

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedDeckIds([]); // reset
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

  // --- modo importação ---
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

        // processa em série pra verificar resultados
        for (const deck of decksToImport) {
          try {
            // garante payload válido pra criação
            const payload = {
              title: deck.title,
              category: deck.category || "Importados",
              cards: deck.cards // backend espera checar estrutura do card
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

        // atualiza lista
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
    const studyDeck = {
      ...activeDeck,
      cards: studySessionCards
    };

    return (
      <StudySession
        deck={studyDeck}
        onUpdateCard={(card) => handleUpdateCardInDeck(activeDeck.id, card)}
        onFinish={() => {
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

  // filtro de busca

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden relative">
      <SEO 
        title="Starky | Visão Geral"
        description="Gerencie seus decks, acompanhe estatísticas e estude com repetição espaçada no Starky."
        canonical="https://starky.app/overview"
      />
      <div className="block md:hidden">
        <OverviewHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
      </div>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false); // fecha na seleção
        }}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}

        // Import/Export Props
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
          />
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-dot-pattern">
          <div className="max-w-6xl mx-auto pb-20">
            {/* decks */}
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

            {/* library */}
            {activeTab === "library" && (
              <LibraryView decks={filteredDecks} onAddDeck={handleSaveDeck} />
            )}

            {/* stats */}
            {(activeTab === "stats_view" || activeTab === "stats_locked") && (
              <StatsView isLocked={!isAuthenticated} />
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

// ----------------------------------------------------------------------
// sub componente: editor de decks (gerenciar decks e suas informações)
// ----------------------------------------------------------------------

interface DeckEditorProps {
  deck: Deck | null; /* se for null é pra entrar no modo de criação de deck */
  onSave: (deck: Deck) => void;
  onCancel: () => void;
  showAlert: (title: string, description?: string) => void;
}

export const DeckEditor = ({ deck, onSave, onCancel, showAlert }: DeckEditorProps) => {
  const [title, setTitle] = useState(deck?.title || "");
  const [category, setCategory] = useState(deck?.category || "");
  const [cards, setCards] = useState<Card[]>(deck?.cards || []);

  // controladores dos cards
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
          // resetar status de revisão pro card aparecer novamente
          // use null pra garantir que o json envie o valor e o backend limpe o campo
          nextReviewDate: null,
          lastReviewed: null,
          interval: null
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
