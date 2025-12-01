import { useState } from "react";
import { Link } from "react-router";
import { Menu, X, LampDesk } from "lucide-react";
import { Button } from "./ui/Button";

interface NavbarProps {
  scrolled: boolean;
}

const Navbar = ({ scrolled }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? "bg-black/50 backdrop-blur-md border-zinc-800 py-3 pb-4 shadow-sm" : "bg-transparent border-transparent py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo(0, 0)}
        >
          <div className="w-8 h-8 bg-(--accent-color) rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-(--accent-color)/30">
            <LampDesk className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-light text-white">
            Starky
          </span>
        </div>

        {/* Desktop Header */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Recursos
          </a>
          <a
            href="#decks"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Decks
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="#"
            className="text-sm font-medium text-zinc-400 hover:text-white"
          >
            Entrar
          </a>

          <Button size="sm" className="bg-(--accent-color)">
            <Link to={"/overview"}>Começar Agora</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Header */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-6 flex flex-col gap-4 animate-fade-in shadow-xl">
          <a
            href="#features"
            className="text-base font-medium text-zinc-400 hover:text-accent"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Recursos
          </a>
          <a
            href="#decks"
            className="text-base font-medium text-zinc-400 hover:text-accent"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Decks
          </a>
          <hr className="border-zinc-800" />
          <div className="flex flex-col gap-3">
            <Button variant="secondary" className="w-full">
              Entrar
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              <Link to={"/overview"}>Começar Agora</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
