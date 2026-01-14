import { BookOpen, Clapperboard, Globe, Microscope } from "lucide-react";

const subjects = [
  { name: "Geografia Geral", icon: <Globe className="w-4 h-4 text-blue-400" /> },
  { name: "Ciência e Natureza", icon: <Microscope className="w-4 h-4 text-green-400" /> },
  { name: "História Mundial", icon: <BookOpen className="w-4 h-4 text-red-400" /> },
  { name: "Cinema e Cultura Pop", icon: <Clapperboard className="w-4 h-4 text-purple-400" /> },
  // repetindo os temas do hero pra consistência, mais alguns extras
  { name: "Inglês A1", icon: <Globe className="w-4 h-4 text-indigo-400" /> },
  { name: "Astronomia", icon: <Microscope className="w-4 h-4 text-yellow-400" /> },
  { name: "Literatura", icon: <BookOpen className="w-4 h-4 text-orange-400" /> },
  { name: "Tecnologia", icon: <Microscope className="w-4 h-4 text-cyan-400" /> },
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
