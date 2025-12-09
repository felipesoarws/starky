import { Button } from "./ui/Button";
import { useNavigate } from "react-router";

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-6 bg-(--accent-background)">
      <div className="max-w-5xl mx-auto rounded-[3rem] bg-(--accent-color) p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-(--accent-color)/20">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
            Pronto para turbinar sua memória?
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Junte-se a milhares de estudantes e profissionais dominando novas
            habilidades com o Starky. Comece de graça hoje.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" withArrow onClick={() => navigate("/login")}>
              Comece Grátis
            </Button>
            <Button size="lg" variant="tertiary" onClick={() => navigate("/overview")}>
              Explorar Decks
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
