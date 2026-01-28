import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Clock, CheckCircle, Volume2, Settings2 } from "lucide-react";
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

  const [seconds, setSeconds] = useState(0);
  const [qSpeakLang, setQSpeakLang] = useState(deck.language || "en-US");
  const [aSpeakLang, setASpeakLang] = useState("pt-BR");
  const [showLangSettings, setShowLangSettings] = useState(() => window.innerWidth >= 768);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowLangSettings(false);
      }
    };
    if (showLangSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLangSettings]);

  useEffect(() => {
    if (!completed) {
      const timer = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [completed]);




  const handleSpeak = useCallback((text: string, langOverride?: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = langOverride || "pt-BR";

    const speak = () => {
      const voices = window.speechSynthesis.getVoices();

      let voice = voices.find(v => v.lang.replace('_', '-') === targetLang);

      if (!voice) {
        const langPrefix = targetLang.split('-')[0];
        voice = voices.find(v => v.lang.startsWith(langPrefix));
      }

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = targetLang;
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
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (completed) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (!isFlipped) {
          setIsFlipped(true);
        }
      } else if (isFlipped) {
        switch (e.key) {
          case "1":
            handleDifficulty(1, "hard");
            break;
          case "2":
            handleDifficulty(10, "medium");
            break;
          case "3":
            handleDifficulty(2880, "good");
            break;
          case "4":
            handleDifficulty(5760, "easy");
            break;
        }
      }

      if (e.key === "s") {
        const text = isFlipped ? currentCard.answer : currentCard.question;
        const cleanText = text.replace(/^(Traduza:|Complete:)\s*/i, "").replace(/['"“”]/g, "");
        handleSpeak(cleanText, isFlipped ? aSpeakLang : qSpeakLang);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completed, isFlipped, currentIndex, currentCard, aSpeakLang, qSpeakLang, handleSpeak]);

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

          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowLangSettings(!showLangSettings)}
              className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              title="Configurações de Áudio"
            >
              <Settings2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {showLangSettings && (
              <div className="absolute top-12 right-0 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in lg:top-[5.5vw]">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Idioma do Áudio</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-zinc-400 mb-2 uppercase">Pergunta</p>
                    <div className="flex bg-zinc-950 p-1 rounded-lg">
                      <button
                        onClick={() => setQSpeakLang(deck.language || "en-US")}
                        className={`flex-1 text-[10px] py-1.5 rounded-md transition-all ${qSpeakLang !== 'pt-BR' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Nativo
                      </button>
                      <button
                        onClick={() => setQSpeakLang("pt-BR")}
                        className={`flex-1 text-[10px] py-1.5 rounded-md transition-all ${qSpeakLang === 'pt-BR' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Português
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-zinc-400 mb-2 uppercase">Resposta</p>
                    <div className="flex bg-zinc-950 p-1 rounded-lg">
                      <button
                        onClick={() => setASpeakLang(deck.language || "en-US")}
                        className={`flex-1 text-[10px] py-1.5 rounded-md transition-all ${aSpeakLang !== 'pt-BR' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Nativo
                      </button>
                      <button
                        onClick={() => setASpeakLang("pt-BR")}
                        className={`flex-1 text-[10px] py-1.5 rounded-md transition-all ${aSpeakLang === 'pt-BR' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        Português
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
          className="relative w-full max-w-4xl min-h-[50vh] md:min-h-0 md:aspect-video bg-[#121214] md:max-h-[65vh] border border-white/5 rounded-3xl flex flex-col items-center justify-center p-6 md:p-10 cursor-pointer hover:border-white/10 transition-colors shadow-2xl relative group mx-auto my-auto"
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

            <div className="absolute top-4 right-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const text = isFlipped ? currentCard.answer : currentCard.question;
                  const cleanText = text.replace(/^(Traduza:|Complete:)\s*/i, "").replace(/['"“”]/g, "");
                  handleSpeak(cleanText, isFlipped ? aSpeakLang : qSpeakLang);
                }}
                className="p-3 text-zinc-500 hover:text-blue-500 transition-colors bg-white/5 rounded-full z-200"
                title="Ouvir (s)"
              >
                <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div>
              <div className="max-h-[35vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pr-2 pt-2">
                {isFlipped ? (
                  <span key={`content-answer-${currentIndex}`} className="animate-slide-up text-lg md:text-2xl font-medium text-zinc-100 leading-relaxed block break-words">
                    {currentCard.answer}
                  </span>
                ) : (
                  <span key={`content-question-${currentIndex}`} className="animate-slide-up text-lg md:text-3xl  font-medium text-zinc-100 leading-relaxed block break-words">
                    {currentCard.question}
                  </span>
                )}
              </div>
            </div>

            {!isFlipped && (
              <div className="animate-pulse mt-6 text-xs translate-y-8 text-zinc-600 whitespace-nowrap lg:translate-y-12">
                Pressione <span className="font-bold border border-zinc-700 rounded px-1 min-w-[20px] inline-block text-center mr-1">Espaço</span> para ver a resposta
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
              shortcut="1"
            />
            <DifficultyButton
              label="Médio"
              time="10m"
              textColor="yellow"
              color="bg-zinc-900 border-zinc-800 hover:border-yellow-700 hover:bg-yellow-800/20"
              onClick={() => handleDifficulty(10, 'medium')}
              shortcut="2"
            />
            <DifficultyButton
              label="Bom"
              time="2d"
              textColor="blue"
              color="bg-zinc-900 border-zinc-800 hover:border-blue-700 hover:bg-blue-800/20"
              onClick={() => handleDifficulty(2880, 'good')}
              shortcut="3"
            />
            <DifficultyButton
              label="Fácil"
              time="4d"
              textColor="green"
              color="bg-zinc-900 border-zinc-800 hover:border-green-700 hover:bg-green-800/20"
              onClick={() => handleDifficulty(5760, 'easy')}
              shortcut="4"
            />
          </div>
        )}
      </footer>
    </div>
  );
}

function DifficultyButton({ label, time, textColor, color, onClick, shortcut }: { label: string, time: string, textColor: string, color: string, onClick: () => void, shortcut?: string }) {
  return (
    <button
      onClick={onClick}
      className={`h-15 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all relative ${color} group active:scale-95`}
    >
      {shortcut && (
        <span className="absolute top-1 right-2 text-[10px] font-mono text-zinc-600 border border-zinc-800 rounded px-1 min-w-[16px] text-center hidden md:block">
          {shortcut}
        </span>
      )}
      <span className="text-sm font-bold text-zinc-300 group-hover:text-white">{label}</span>
      <span className={`text-[10px] font-mono text-zinc-600 group-hover:text-${textColor}-500`}>{time}</span>
    </button>
  );
}
