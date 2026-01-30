import { useEffect, useState } from "react";
import SEO from "./components/SEO";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Integration from "./components/Integration";
import MobileApp from "./components/MobileApp";
import CTA from "./components/CTA";
import { Footer } from "./components/Footer";
import Showcase from "./components/Showcase";

function App() {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-(--accent-background) text-(--accent-primary-text) selection:bg-(--accent-color) selection:text-(--accent-primary-text)">
      <SEO 
        title="Starky | Domine qualquer assunto com Repetição Espaçada"
        description="O Starky ajuda você a memorizar conceitos a longo prazo. Crie flashcards, acompanhe seu progresso e deixe nosso algoritmo inteligente decidir quando revisar."
        canonical="https://starky.app.br/"
      />
      <Navbar scrolled={scrolled} />
      <main>
        <Hero />
        <Showcase />
        <Features />
        <Integration />
        <MobileApp />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
