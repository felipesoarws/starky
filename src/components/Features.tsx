import {
  BrainCircuit,
  Library,
  RefreshCw,
  PenTool,
  Layout,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const Features = () => {
  return (
    <section id="features" className="py-24 px-10 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 md:text-center max-w-5xl mx-auto"
        >
          <h2
            className="text-3xl md:text-6xl font-bold mb-6 tracking-tight text-white leading-[.8]"
            style={{ userSelect: "none" }}
          >
            Cientificamente comprovado para <br />
            <span className="text-(--accent-color)">
              ajudar você a lembrar.
            </span>
          </h2>
          <p className="text-lg text-zinc-400 lg:mx-[15vw] lg:leading-[1.2vw] lg:text-[1.1vw]">
            O Starky combina o poder da recordação ativa com agendamento
            inteligente para garantir que você nunca esqueça o que aprendeu.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="md:col-span-2 p-8 md:p-12 rounded-3xl border border-zinc-800 bg-zinc-900 relative overflow-hidden group shadow-sm"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <BrainCircuit className="w-64 h-64 text-(--accent-color)" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-(--accent-color) text-white flex items-center justify-center mb-8 shadow-lg shadow-(--accent-color)/30">
                <RefreshCw className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white ">
                Algoritmo de Revisão Adaptativo
              </h3>
              <p className="text-zinc-400 text-lg max-w-md lg:leading-[1.2vw]">
                Avalie a dificuldade de um card e o Starky agendará
                automaticamente o momento perfeito para sua próxima revisão. Não
                perca tempo revisando o que você já sabe.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4 max-w-md lg:grid-cols-4">
                {[
                  { label: "Fácil", bg: "bg-emerald-900/10", border: "border-emerald-900/50", text: "text-emerald-400", time: "em 4d" },
                  { label: "Bom", bg: "bg-blue-900/10", border: "border-blue-900/50", text: "text-blue-400", time: "em 2d" },
                  { label: "Médio", bg: "bg-yellow-900/10", border: "border-yellow-900/50", text: "text-yellow-400", time: "em 10m" },
                  { label: "Difícil", bg: "bg-red-900/10", border: "border-red-900/50", text: "text-red-400", time: "em 1m" }
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className={`${item.bg} p-4 rounded-lg border ${item.border} text-center`}
                  >
                    <div className={`text-xl font-bold ${item.text} mb-1`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${item.text}`}>Mostrar {item.time}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="md:col-span-1 p-8 rounded-3xl border border-zinc-800 bg-zinc-900 flex flex-col justify-between group overflow-hidden shadow-sm"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-6 text-(--accent-color)">
                <Library className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Decks Prontos
              </h3>
              <p className="text-zinc-400 lg:leading-[1vw]">
                Comece a aprender com decks da comunidade de alta qualidade.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { lang: "EN", bg: "bg-blue-900/30", text: "text-blue-500", label: "Inglês A1 - C1" },
                { lang: "ES", bg: "bg-yellow-900/30", text: "text-yellow-500", label: "Espanhol A1 - C1" },
                { lang: "FR", bg: "bg-red-900/30", text: "text-red-500", label: "Francês A1 - C1" }
              ].map((deck) => (
                <div key={deck.lang} className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center gap-3">
                  <div className={`w-8 h-8 rounded ${deck.bg} flex items-center justify-center ${deck.text} font-bold text-xs`}>
                    {deck.lang}
                  </div>
                  <div className="text-sm font-medium text-zinc-300">{deck.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <FeatureCard
            title="Personalização Rica"
            description="Crie cards personalizados com texto, blocos de código, imagens e categorias."
            icon={<PenTool className="w-6 h-6" />}
          />
          <FeatureCard
            title="Importação / Exportação"
            description="Mova seus decks entre dispositivos ou compartilhe com amigos facilmente."
            icon={<Download className="w-6 h-6" />}
          />
          <FeatureCard
            title="Design Intuitivo"
            description="Uma interface moderna e limpa que torna o estudo fácil e prático."
            icon={<Layout className="w-6 h-6" />}
          />
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  title,
  description,
  icon,
  className = "",
}: FeatureCardProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    className={`p-8 rounded-3xl border border-zinc-800 bg-zinc-900 hover:border-(--accent-color)/30 hover:shadow-lg hover:shadow-(--accent-color)/5 transition-all group ${className}`}
  >
    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-(--accent-color)">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-white ">{title}</h3>
    <p className="text-zinc-400 leading-relaxed lg:leading-[1.1vw]">{description}</p>
  </motion.div>
);

export default Features;
