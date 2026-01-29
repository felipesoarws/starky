import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Menu, X, LampDesk, LogOut, GithubIcon, Settings } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  scrolled: boolean;
}

const Navbar = ({ scrolled }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

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
          <a
            href="https://docs.starky.app.br"
            target="_blank"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Docs
          </a>
          <div className='bg-zinc-800 rounded-full p-2 cursor-pointer hover:bg-zinc-700 transition-colors'>
            <a
              href="https://github.com/felipesoarws/starky"
              target="_blank"
              className="text-sm font-medium text-white"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>

        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative flex items-center justify-between gap-4" ref={profileRef}>

              <div
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="cursor-pointer select-none w-10 h-10 rounded-full bg-linear-to-l from-(--accent-color) to-blue-400 flex items-center justify-center text-sm font-bold text-white border border-white/10 hover:opacity-90 transition-opacity"
                title={user.name}
              >
                {getInitials(user.name)}
              </div>

              <Button size="sm" className="bg-accent">
                <Link to={"/overview"}>Começar Agora</Link>
              </Button>

              {isProfileOpen && (
                <div className="absolute top-12 right-0 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-zinc-500 truncate">@{user.username}</p>
                  </div>

                  <Link
                    to="/account"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors flex items-center gap-2 border-b border-zinc-800"
                  >
                    <Settings className="w-4 h-4" />
                    Minha Conta
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair da conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to={"/login"}
                className="text-sm font-medium text-zinc-400 hover:text-white"
              >
                Entrar
              </Link>
              <Button size="sm" className="bg-accent">
                <Link to={"/overview"}>Começar Agora</Link>
              </Button>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-6 flex flex-col gap-4 animate-fade-in shadow-xl">
          <div className='bg-zinc-800 rounded-full p-2 cursor-pointer hover:bg-zinc-700 transition-colors w-fit'>
            <a
              href="https://github.com/felipesoarws/starky"
              target="_blank"
              className="text-sm font-medium text-white"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
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
          <a
            href="https://docs.starky.app.br"
            target="_blank"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Docs
          </a>

          <hr className="border-zinc-800" />
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="secondary" className="w-full">
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)}>Minha Conta</Link>
                </Button>
                <Button
                  variant="logout"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" className="w-full">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Link to={"/overview"}>Começar Agora</Link>
                </Button>
              </>
            )}

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
