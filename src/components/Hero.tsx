import { useState } from "react";
import {
  Play,
  ArrowLeft,
  Clock,
  Instagram,
  Github,
  Linkedin,
} from "lucide-react";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router";



const Hero = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-10 overflow-hidden bg-(--accent-background)">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-accent/[0.15] blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 shadow-sm mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          <span className="text-xs font-medium text-zinc-400 ">
            A evolução do aprendizado chegou
          </span>
        </div>

        <h1
          className="text-5xl md:text-7xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[.8] animate-slide-up text-white"
          style={{ userSelect: "none" }}
        >
          Domine qualquer assunto <br className="hidden md:block" />
          <span className="text-accent ">com Repetição Espaçada.</span>
        </h1>

        <p
          className="text-md md:text-xl lg:text-md text-zinc-400 max-w-2xl mx-auto mb-10 leading-[1.3] animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          O Starky ajuda você a memorizar conceitos a longo prazo. Crie
          flashcards, acompanhe seu progresso e deixe nosso algoritmo
          inteligente decidir quando revisar.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
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
        </div>

        <div
          className="mt-20 relative mx-auto max-w-4xl animate-slide-up text-left"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="absolute -inset-4 bg-accent/10 blur-3xl rounded-4xl"></div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-2 shadow-2xl ring-1 ring-black/5">
            <div className="rounded-xl bg-zinc-950 overflow-hidden relative border border-zinc-800 flex flex-col group hover:border-zinc-700 lg:aspect-16/10  transition-colors">
              {/* App - Header */}
              <div className="h-14 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400">
                    <ArrowLeft
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => setIsFlipped(false)}
                    />
                  </div>
                  <div className="h-6 w-px bg-zinc-800 hidden sm:block"></div>
                  <span className="text-sm font-bold text-white">
                    Conhecimentos gerais
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400 font-mono">
                    <Clock className="w-3 h-3" />
                    07:09
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-white font-medium">12</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-500">20</span>
                  </div>
                </div>
              </div>

              {/* App - Linha de progressão */}
              <div className="h-0.5 bg-zinc-900 w-full">
                <div className="h-full w-[60%] bg-accent"></div>
              </div>

              {/* App - Principal area */}
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

                  {!isFlipped ? (
                    <div className="animate-fade-in">
                      <h3 className="text-2xl md:text-4xl font-medium text-white leading-0.5">
                        Qual o nome do
                        <span className="text-accent"> criador</span> do
                        <span className="text-accent"> Starky</span>?
                      </h3>
                    </div>
                  ) : (
                    <div className="space-y-6 max-w-2xl animate-slide-up">
                      <p className="text-xl md:text-3xl text-zinc-100 leading-relaxed font-light">
                        <span className="font-mono bg-zinc-800 px-1 rounded text-accent">
                          Felipe Soares
                        </span>{" "}
                      </p>
                      <div className="flex items-center justify-center gap-6">
                        <a
                          href="https://www.instagram.com/devf____/"
                          target="_blank"
                          className="text-accent/60 hover:text-accent transition-colors"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                        <a
                          href="https://github.com/felipesoarws/"
                          target="_blank"
                          className="text-accent/60 hover:text-accent transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                        <a
                          href="https://www.linkedin.com/in/felipesoarws/"
                          target="_blank"
                          className="text-accent/60 hover:text-accent transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </div>
                      <div className="w-16 h-1 bg-accent/50 rounded-full mx-auto mt-8"></div>
                    </div>
                  )}

                  {!isFlipped && (
                    <div className="mt-12 h-6">
                      <span className="text-xs md:text-sm text-zinc-500 animate-pulse">
                        Toque para ver a resposta
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* App - Controles */}
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
                      onClick={() => setIsFlipped(false)}
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
                      onClick={() => setIsFlipped(false)}
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
                      onClick={() => setIsFlipped(false)}
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
                      onClick={() => setIsFlipped(false)}
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
