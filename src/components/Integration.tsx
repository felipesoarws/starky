import { BookOpen, Code2, Globe, Hash } from "lucide-react";

const subjects = [
  { name: "JavaScript ES6", icon: <Code2 className="w-4 h-4" /> },
  { name: "HTML5 Semântico", icon: <Code2 className="w-4 h-4" /> },
  { name: "CSS3 & Flexbox", icon: <Code2 className="w-4 h-4" /> },
  { name: "Inglês A1 - Básico", icon: <Globe className="w-4 h-4" /> },
  { name: "Inglês B2 - Intermediário", icon: <Globe className="w-4 h-4" /> },
  { name: "Inglês C1 - Avançado", icon: <Globe className="w-4 h-4" /> },
  { name: "React Hooks", icon: <Code2 className="w-4 h-4" /> },
  { name: "História do Brasil", icon: <BookOpen className="w-4 h-4" /> },
  { name: "Cálculo I", icon: <Hash className="w-4 h-4" /> },
  { name: "Francês para Viagem", icon: <Globe className="w-4 h-4" /> },
  { name: "Python para Data Science", icon: <Code2 className="w-4 h-4" /> },
];

const marqueeItems = [...subjects, ...subjects];

const Integration = () => {
  return (
    <section
      id="decks"
      className="py-24 border-y border-zinc-800 bg-zinc-950/50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 text-center mb-12">
        <h3 className="text-zinc-500 font-medium text-sm uppercase tracking-widest mb-2">
          Biblioteca em Crescimento
        </h3>
        <p className="text-2xl font-bold text-white">
          Comece a aprender imediatamente
        </p>
      </div>

      <div className="relative w-full overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-linear-to-r from-(--accent-background) to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-linear-to-l from-(--accent-background) to-transparent pointer-events-none"></div>
        <div className="flex w-max animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div
              key={index}
              className="mx-3 md:mx-4 inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-accent hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer group/card backdrop-blur-sm"
            >
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover/card:text-accent group-hover/card:bg-accent/10 transition-colors">
                {item.icon}
              </div>
              <span className="font-medium text-lg">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integration;
