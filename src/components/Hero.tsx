import { useState } from "react";
import {
  Play,
  ArrowLeft,
  Clock,
  Volume2
} from "lucide-react";
import { useEffect, useCallback } from "react";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const HERO_CARDS = [
  {
    category: "Inglês",
    question: "Como se diz 'Olá' em inglês?",
    answer: "Hello",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    language: "en-US"
  },
  {
    category: "Espanhol",
    question: "Como se diz 'Obrigado' em espanhol?",
    answer: "Gracias",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    language: "es-ES"
  },
  {
    category: "Francês",
    question: "Como se diz 'Adeus' em francês?",
    answer: "Au revoir",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    language: "fr-FR"
  },
  {
    category: "Italiano",
    question: "Como se diz 'Por favor' em italiano?",
    answer: "Per favore",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    language: "it-IT"
  }
];

const Hero = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const currentCard = HERO_CARDS[currentCardIndex];

  const handleNextCard = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % HERO_CARDS.length);
    }, 200);
  }, []);

  const handleSpeak = useCallback((text: string, lang: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang.replace('_', '-') === lang);
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    }
    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prioritize study shortcuts if user is interacting with the hero card
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        handleNextCard();
      } else if (e.key.toLowerCase() === "s") {
        const text = isFlipped ? currentCard.answer : currentCard.question;
        const lang = isFlipped ? currentCard.language : "pt-BR";
        handleSpeak(text, lang);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, currentCard, handleNextCard, handleSpeak]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-10 overflow-hidden bg-(--accent-background)">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" as const }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-accent/[0.15] blur-[120px] rounded-full pointer-events-none -z-10"
      />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto text-center"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 shadow-sm mb-8">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          <span className="text-xs font-medium text-zinc-400 ">
            A evolução do aprendizado chegou
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[.8] text-white"
          style={{ userSelect: "none" }}
        >
          Domine qualquer assunto <br className="hidden md:block" />
          <span className="text-accent ">com Repetição Espaçada.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-md md:text-xl lg:text-md text-zinc-400 max-w-2xl mx-auto mb-10 leading-[1.3]"
        >
          O Starky ajuda você a memorizar conceitos a longo prazo. Crie
          flashcards, acompanhe seu progresso e deixe nosso algoritmo
          inteligente decidir quando revisar.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            withArrow
            className="w-full sm:w-auto"
            onClick={() => navigate("/login")}
          >
            Comece Grátis
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto group"
            onClick={() => navigate("/overview?tab=library")}
          >
            <Play className="w-4 h-4 fill-current mr-2 group-hover:scale-110 transition-transform" />
            Explorar Decks
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" as const }}
          className="mt-20 relative mx-auto max-w-4xl text-left"
        >
          <div className="absolute -inset-4 bg-accent/10 blur-3xl rounded-4xl"></div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-2 shadow-2xl ring-1 ring-black/5">
            <div className="rounded-xl bg-zinc-950 overflow-hidden relative border border-zinc-800 flex flex-col group hover:border-zinc-700 lg:aspect-16/10  transition-colors">

              <div className="h-14 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer" onClick={() => setIsFlipped(false)}>
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <div className="h-6 w-px bg-zinc-800 hidden sm:block"></div>
                  <span className={`text-sm font-bold ${currentCard.color}`}>
                    {currentCard.category}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400 font-mono">
                    <Clock className="w-3 h-3" />
                    07:09
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-white font-medium">{currentCardIndex + 1}</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-500">{HERO_CARDS.length}</span>
                  </div>
                </div>
              </div>

              <div className="h-0.5 bg-zinc-900 w-full">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${((currentCardIndex + 1) / HERO_CARDS.length) * 100}%` }}
                ></div>
              </div>

              <div
                className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-background cursor-pointer perspective-1000"
                onClick={() => !isFlipped && setIsFlipped(true)}
              >
                <div
                  className={`w-full h-full max-h-[400px] bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative transition-all duration-500 ${isFlipped ? "bg-zinc-800/30" : ""}`}
                >
                  <span
                    className={`text-xs font-bold tracking-[0.2em] uppercase mb-6 transition-colors ${isFlipped ? "text-accent" : "text-zinc-500"}`}
                  >
                    {isFlipped ? "Resposta" : "Pergunta"}
                  </span>

                  <div className="absolute top-4 right-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const text = isFlipped ? currentCard.answer : currentCard.question;
                        const lang = isFlipped ? currentCard.language : "pt-BR";
                        handleSpeak(text, lang);
                      }}
                      className="p-3 text-zinc-500 hover:text-accent transition-colors bg-white/5 rounded-full z-20"
                      aria-label="Ouvir áudio"
                    >
                      <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isFlipped ? (
                      <motion.div
                        key="question"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-2xl md:text-4xl font-medium text-white leading-tight">
                          {currentCard.question}
                        </h3>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="answer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 max-w-2xl"
                      >
                        <p className="text-xl md:text-4xl text-zinc-100 leading-relaxed font-bold">
                          {currentCard.answer}
                        </p>

                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: 64 }}
                          className="h-1 bg-accent/50 rounded-full mx-auto mt-8"
                        ></motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isFlipped && (
                    <div className="mt-12 h-6 flex flex-col items-center justify-center gap-2">
                      <span className="text-xs md:text-sm text-zinc-500 animate-pulse">
                        Toque ou pressione <span className="font-bold border border-zinc-700 rounded px-1 min-w-[20px] inline-block text-center mr-1">Espaço</span> para ver a resposta
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-24 border-t border-zinc-800 bg-zinc-950 flex items-center justify-center px-6 gap-4 z-10">
                {!isFlipped ? (
                  <Button
                    size="md"
                    className="w-full max-w-sm text-lg py-4 shadow-xl shadow-accent/20"
                    onClick={() => setIsFlipped(true)}
                  >
                    Mostrar Resposta
                  </Button>
                ) : (
                  <div className="grid grid-cols-4 gap-3 w-full max-w-2xl animate-fade-in">
                    <button
                      onClick={handleNextCard}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-red-900/10 hover:border-red-900/50 transition-colors group/btn"
                    >
                      <span className="text-xs font-bold text-zinc-400 group-hover/btn:text-red-400 ">
                        Difícil
                      </span>
                      <span className="text-[10px] text-zinc-600 group-hover/btn:text-red-400/70 font-mono">
                        1m
                      </span>
                    </button>
                    <button
                      onClick={handleNextCard}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-yellow-900/10 hover:border-yellow-900/50 transition-colors group/btn"
                    >
                      <span className="text-xs font-bold text-zinc-400 group-hover/btn:text-yellow-400 ">
                        Médio
                      </span>
                      <span className="text-[10px] text-zinc-600 group-hover/btn:text-yellow-400/70 font-mono">
                        10min
                      </span>
                    </button>
                    <button
                      onClick={handleNextCard}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-blue-900/10 hover:border-blue-900/50 transition-colors group/btn"
                    >
                      <span className="text-xs font-bold text-zinc-400 group-hover/btn:text-blue-400 ">
                        Bom
                      </span>
                      <span className="text-[10px] text-zinc-600 group-hover/btn:text-blue-400/70 font-mono">
                        2d
                      </span>
                    </button>
                    <button
                      onClick={handleNextCard}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-green-900/10 hover:border-green-900/50 transition-colors group/btn"
                    >
                      <span className="text-xs font-bold text-zinc-400 group-hover/btn:text-green-400 ">
                        Fácil
                      </span>
                      <span className="text-[10px] text-zinc-600 group-hover/btn:text-green-400/70 font-mono">
                        4d
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
