import React from "react";
import { Button } from "./ui/Button";

const CTA: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto rounded-[3rem] bg-(--accent-color) border border-(--accent-color) p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-(--accent-color)/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-white/10 radial-gradient" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
            Pronto para turbinar sua memória?
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Junte-se a milhares de estudantes e profissionais dominando novas
            habilidades com o Starky. Comece de graça hoje.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              withArrow
              className="cursor-pointer bg-(--accent-color) text-(--accent-color) hover:bg-blue-100 hover:text-(--accent-surface)"
            >
              Comece Grátis
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer border-white/30 text-white hover:bg-white/10 hover:border-white hover:text-white"
            >
              Explorar Decks
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
