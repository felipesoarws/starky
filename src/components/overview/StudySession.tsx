import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Clock, CheckCircle, Volume2 } from "lucide-react";
import { Button } from "../ui/Button";
import type { Deck, Card } from "./types";

interface StudySessionProps {
  deck: Deck;
  onUpdateCard: (card: Card) => void;
  onFinish: () => void;
  onCancel: () => void;
}

export default function StudySession({ deck, onUpdateCard, onFinish, onCancel }: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  // estado do timer
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!completed) {
      const timer = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [completed]);

  const handleSpeak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const speak = () => {
      if (deck.language) {
        const voices = window.speechSynthesis.getVoices();

        // 1. Procurar combinação exata (ex: en-US)
        let voice = voices.find(v => v.lang === deck.language);

        // 2. Procurar apenas o prefixo (ex: en)
        if (!voice) {
          const langPrefix = deck.language.split('-')[0];
          voice = voices.find(v => v.lang.startsWith(langPrefix));
        }

        // 3. Casos especiais para nomes de vozes (alguns navegadores usam sub-tags diferentes)
        if (!voice && deck.language.startsWith('en')) {
          voice = voices.find(v => v.name.toLowerCase().includes('english') || v.lang.includes('en'));
        }

        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang; // Importante: usar o lang da voz encontrada
        } else {
          utterance.lang = deck.language;
        }
      }
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      speak();
    }
  }, [deck.language]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const currentCard = deck.cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
    }
  };

  const handleDifficulty = (factor: number, difficulty: "easy" | "good" | "medium" | "hard") => {
    const now = new Date();
    const nextDate = new Date(now.getTime() + factor * 60000);

    const updatedCard: Card = {
      ...currentCard,
      lastReviewed: now,
      nextReviewDate: nextDate.toISOString(),
      interval: factor,
      difficulty
    }

    onUpdateCard(updatedCard);
    handleNext();
  };

  if (deck.cards.length === 0 || completed) {
    return (
      <div className="fixed inset-0 bg-background text-white flex flex-col items-center justify-center p-6  z-50">
        <div className="animate-slide-up flex flex-col items-center max-w-md text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 ring-1 ring-blue-500/30">
            <CheckCircle className="w-10 h-10 text-blue-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Sessão Concluída!</h2>
            <p className="text-zinc-400">
              Você completou o deck <strong className="text-zinc-200">{deck.title}</strong> em <br />
              <span className="text-white font-mono font-bold">{formatTime(seconds)}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full pt-4">

            <Button onClick={onFinish} size="md" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-none">
              Concluir
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background text-white flex flex-col z-50">
      <header className="h-16 flex items-center justify-between p-6 px-8 border-b border-white/5 bg-[#101013] relative">
        <div className="flex items-center gap-2 md:gap-4 z-10">
          <button
            onClick={onCancel}
            className="p-2 -ml-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-3 h-3 md:w-5 md:h-5" />
          </button>
          <span className="text-zinc-700">|</span>
          <h1 className="font-bold text-xs md:text-sm tracking-wide text-zinc-200">{deck.title}</h1>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono text-zinc-500 z-10">
          <div className="flex items-center gap-2 bg-zinc-900/50 px-2 py-1 rounded-full border border-white/5">
            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>{formatTime(seconds)}</span>
          </div>
          <div className="font-bold text-zinc-400">
            <span className="text-white">{currentIndex + 1}</span> / {deck.cards.length}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 bg-blue-500/20 w-full">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / deck.cards.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-6 relative w-full overflow-y-auto">

        <div
          onClick={() => !isFlipped && setIsFlipped(true)}
          className="w-full max-w-4xl min-h-[50vh] md:min-h-0 md:aspect-video bg-[#121214] md:max-h-[65vh] border border-white/5 rounded-3xl flex flex-col items-center justify-center p-6 md:p-10 cursor-pointer hover:border-white/10 transition-colors shadow-2xl relative group mx-auto my-auto"
        >
          <div className="text-center max-w-2xl w-full">

            {isFlipped ? (
              <span key={`label-answer-${currentIndex}`} className="animate-slide-up text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-4 md:mb-6 block">
                Resposta
              </span>
            ) : (
              <span key={`label-question-${currentIndex}`} className="animate-slide-up text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-4 md:mb-6 block">
                Pergunta
              </span>
            )}

            <div className="relative group/text">
              {isFlipped ? (
                <span key={`content-answer-${currentIndex}`} className="animate-slide-up text-lg md:text-2xl lg:text-3xl font-medium text-zinc-100 leading-relaxed block break-words pr-8">
                  {currentCard.answer}
                </span>
              ) : (
                <span key={`content-question-${currentIndex}`} className="animate-slide-up text-lg md:text-2xl lg:text-3xl font-medium text-zinc-100 leading-relaxed block break-words pr-8">
                  {currentCard.question}
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(isFlipped ? currentCard.answer : currentCard.question);
                }}
                className="absolute top-1/2 -right-2 -translate-y-1/2 p-3 text-zinc-600 hover:text-blue-500 transition-colors bg-white/5 rounded-full md:opacity-0 group-hover/text:opacity-100"
                title="Ouvir"
              >
                <Volume2 className="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </div>

            {!isFlipped && (
              <div className="animate-pulse mt-6 text-xs translate-y-8 text-zinc-600 whitespace-nowrap lg:translate-y-12">
                Toque para ver a resposta
              </div>
            )}

            {isFlipped && (
              <div className="animate-slide-up w-12 h-1 bg-blue-500 rounded-full mx-auto mt-4">
              </div>
            )}
          </div>
        </div>

      </main>

      <footer className="py-6 pb-10 md:py-4 md:pb-8 border-t border-white/5 bg-[#101013] flex items-center justify-center px-4 md:h-[7rem]">
        {!isFlipped ? (
          <Button
            size="lg"
            className="w-full max-w-2xl bg-accent text-white hover:bg-accent/70"
            onClick={() => setIsFlipped(true)}
          >
            Mostrar Resposta
          </Button>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-3xl">
            <DifficultyButton
              label="Difícil"
              time="1m"
              textColor="red"
              color="bg-zinc-900 border-zinc-800 hover:border-red-700 hover:bg-red-800/20"
              onClick={() => handleDifficulty(1, 'hard')}
            />
            <DifficultyButton
              label="Médio"
              time="10m"
              textColor="yellow"
              color="bg-zinc-900 border-zinc-800 hover:border-yellow-700 hover:bg-yellow-800/20"
              onClick={() => handleDifficulty(10, 'medium')}
            />
            <DifficultyButton
              label="Bom"
              time="2d"
              textColor="blue"
              color="bg-zinc-900 border-zinc-800 hover:border-blue-700 hover:bg-blue-800/20"
              onClick={() => handleDifficulty(2880, 'good')}
            />
            <DifficultyButton
              label="Fácil"
              time="4d"
              textColor="green"
              color="bg-zinc-900 border-zinc-800 hover:border-green-700 hover:bg-green-800/20"
              onClick={() => handleDifficulty(5760, 'easy')}
            />
          </div>
        )}
      </footer>
    </div>
  );
}

// subcomponente de botão de dificuldade
function DifficultyButton({ label, time, textColor, color, onClick }: { label: string, time: string, textColor: string, color: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`h-15 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${color} group active:scale-95`}
    >
      <span className="text-sm font-bold text-zinc-300 group-hover:text-white">{label}</span>
      <span className={`text-[10px] font-mono text-zinc-600 group-hover:text-${textColor}-500`}>{time}</span>
    </button>
  );
}
