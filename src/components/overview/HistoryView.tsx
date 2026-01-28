import { useState } from "react";
import type { HistoryEntry } from "./types";
import { Eye, EyeOff, Search } from "lucide-react";

interface HistoryViewProps {
    history: HistoryEntry[];
    onClearHistory: () => void;
}

const HistoryView = ({ history, onClearHistory }: HistoryViewProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredHistory = history.filter(entry =>
        entry.deckTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.cardQuestion.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
    });

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Histórico de Estudos
                    </h1>
                    <p className="text-zinc-400">Veja o registro de todas as suas revisões.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-accent outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={onClearHistory}
                            className="text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-900/10 transition-colors"
                        >
                            Limpar
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
                        <p className="text-zinc-500">Nenhum registro encontrado.</p>
                    </div>
                ) : (
                    filteredHistory.map(entry => (
                        <HistoryCard key={entry.id} entry={entry} />
                    ))
                )}
            </div>
        </div>
    );
};

const HistoryCard = ({ entry }: { entry: HistoryEntry }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    const isEasy = entry.difficulty === 'easy';
    const shouldBlur = !isEasy && !isRevealed;

    const difficultyColors = {
        'easy': 'text-green-500 bg-green-500/10 border-green-500/20',
        'good': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        'medium': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        'hard': 'text-red-500 bg-red-500/10 border-red-500/20'
    };

    const difficultyLabels = {
        'easy': 'Fácil',
        'good': 'Bom',
        'medium': 'Médio',
        'hard': 'Difícil'
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyColors[entry.difficulty]}`}>
                        {difficultyLabels[entry.difficulty]}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                        {new Date(entry.timestamp).toLocaleString('pt-BR')}
                    </span>
                </div>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-950 px-2 py-1 rounded">
                    {entry.deckTitle}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">Pergunta</p>
                    <p className="text-zinc-200 text-sm">{entry.cardQuestion}</p>
                </div>
                <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase">Resposta</p>
                        {!isEasy && (
                            <button
                                onClick={() => setIsRevealed(!isRevealed)}
                                className="text-xs flex items-center gap-1 text-zinc-500 hover:text-accent transition-colors"
                            >
                                {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                {isRevealed ? "Esconder" : "Visualizar"}
                            </button>
                        )}
                    </div>

                    <div className={`text-sm text-zinc-200 transition-all duration-300 ${shouldBlur ? 'blur-sm select-none opacity-50' : ''}`}>
                        {entry.cardAnswer}
                    </div>

                    {shouldBlur && (
                        <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={() => setIsRevealed(true)}
                        >
                            <div className="bg-zinc-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-2 shadow-lg">
                                <Eye className="w-3 h-3" /> Ver Resposta
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryView;
