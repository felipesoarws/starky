import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Integration from "./components/Integration";
import MobileApp from "./components/MobileApp";
import CTA from "./components/CTA";
import { Footer } from "./components/Footer";

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
      <Navbar scrolled={scrolled} />
      <main>
        <Hero />
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
