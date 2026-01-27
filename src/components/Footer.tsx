import { LampDesk, Instagram, Github, Linkedin } from "lucide-react";
import { Link } from "react-router";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 pt-20 pb-10 px-10 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-between gap-12 mb-16 lg:flex-row">
          <div className="lg:w-[20vw]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
                <LampDesk className="w-3 h-3 text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-white">Starky</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed lg:leading-[1.2vw] lg:text-[.9vw]">
              A plataforma intuitiva de repetição espaçada. Aprenda mais rápido,
              lembre por mais tempo e domine qualquer assunto com facilidade.
            </p>
          </div>

          <div className="flex items-start justify-between gap-15 lg:gap-30">
            <div>
              <h4 className="font-medium text-white mb-6">Aprender</h4>
              <ul className="space-y-2 text-sm text-zinc-500 lg:leading-[1.2vw] lg:text-[.9vw]">
                <li>
                  <Link to="/overview?tab=library" className="hover:text-accent transition-colors">
                    Explorar Decks
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-accent transition-colors"
                  >
                    Metodologia
                  </a>
                </li>
                <li>
                  <a
                    href="#app"
                    className="hover:text-accent transition-colors"
                  >
                    Baixar App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-6">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500 lg:leading-[1.2vw] lg:text-[.9vw]">
                <li>
                  <Link to="/privacy" className="hover:text-accent transition-colors">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-accent transition-colors">
                    Termos de Serviço
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm mb-4 md:mb-0">
            © 2026 Starky Inc. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/devf____/"
              target="_blank"
              className="text-zinc-500 hover:text-accent transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/felipesoarws/"
              target="_blank"
              className="text-zinc-500 hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/felipesoarws/"
              target="_blank"
              className="text-zinc-500 hover:text-accent transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
