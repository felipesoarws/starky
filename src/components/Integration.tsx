import { Code, Stethoscope, BookOpen, Scale, Binary, Music, Atom, Languages } from "lucide-react";
import { motion } from "framer-motion";

const subjects = [
  { name: "Programação", icon: <Code className="w-4 h-4 text-blue-400" /> },
  { name: "Medicina", icon: <Stethoscope className="w-4 h-4 text-red-400" /> },
  { name: "Idiomas", icon: <Languages className="w-4 h-4 text-emerald-400" /> },
  { name: "História", icon: <BookOpen className="w-4 h-4 text-yellow-400" /> },
  { name: "Direito", icon: <Scale className="w-4 h-4 text-indigo-400" /> },
  { name: "Matemática", icon: <Binary className="w-4 h-4 text-purple-400" /> },
  { name: "Música", icon: <Music className="w-4 h-4 text-pink-400" /> },
  { name: "Ciência", icon: <Atom className="w-4 h-4 text-cyan-400" /> },
];

const marqueeItems = [...subjects, ...subjects];

const Integration = () => {
  return (
    <section
      id="decks"
      className="py-24 border-y border-zinc-800 bg-zinc-950/50 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 text-center mb-12"
      >
        <h3 className="text-zinc-500 font-medium text-sm uppercase tracking-widest mb-2">
          Biblioteca em Crescimento
        </h3>
        <p className="text-2xl font-bold text-white">
          Comece a aprender imediatamente
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative w-full overflow-hidden group"
      >
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
      </motion.div>
    </section>
  );
};

export default Integration;
