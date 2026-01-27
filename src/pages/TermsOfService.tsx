import { ArrowLeft, Instagram, Github, Linkedin } from "lucide-react";
import SEO from "../components/SEO";
import { Link } from "react-router";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-black text-zinc-300 p-8 font-sans">
            <SEO 
                title="Starky | Termos de Serviço"
                description="Leia nossos termos de serviço para entender as regras de uso do Starky."
                canonical="https://starky.app/terms"
            />
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <Link to="/">
                        <button className="px-4 text-sm py-2.5 gap-2 text-zinc-500 inline-flex items-center justify-center ring-transparent font-medium transition-all duration-200 focus:outline-none rounded-full hover:text-white mb-8 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Home
                        </button>
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-4">Termos de Serviço</h1>
                    <p className="text-zinc-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Sobre o Projeto</h2>
                        <p className="leading-relaxed text-zinc-400">
                            O Starky é um projeto independente desenvolvido e mantido por <strong className="text-zinc-200">Felipe Soares</strong>.
                            Ao acessar e usar o Starky, você aceita e concorda com estes termos. Este serviço é fornecido "como está" (as is) e "conforme disponível",
                            refletindo sua natureza de projeto pessoal e portfólio em produção.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Uso e Disponibilidade</h2>
                        <p className="leading-relaxed text-zinc-400">
                            Nosso objetivo é oferecer uma ferramenta de estudo útil e estável. No entanto, por ser gerido por uma única pessoa:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2 text-zinc-400">
                            <li>Não garantimos disponibilidade ininterrupta (100% uptime).</li>
                            <li>Pequenas interrupções para manutenção ou atualizações podem ocorrer.</li>
                            <li>O desenvolvimento é contínuo e funcionalidades podem ser aprimoradas ou alteradas com base no feedback da comunidade.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Responsabilidade e Dados</h2>
                        <p className="leading-relaxed text-zinc-400">
                            Você é responsável pela segurança da sua conta. Embora utilizemos boas práticas de segurança e persistência de dados:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2 text-zinc-400">
                            <li>O serviço não deve ser utilizado como único repositório para dados críticos sem backup pessoal.</li>
                            <li>O desenvolvedor não se responsabiliza por eventuais perdas de dados decorrentes de falhas técnicas imprevistas.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Propriedade Intelectual e Código</h2>
                        <p className="leading-relaxed text-zinc-400">
                            O Starky adota uma filosofia transparente. Partes do código podem ser disponibilizadas como Open Source (Licença MIT).
                            No entanto, a identidade visual, a marca "Starky" e a operação desta instância do serviço pertencem a Felipe Soares.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Contato e Transparência</h2>
                        <p className="leading-relaxed text-zinc-400">
                            Valorizamos a comunicação direta. Dúvidas, sugestões de melhoria ou reportes de problemas podem ser enviados diretamente para o desenvolvedor
                            através das redes sociais linkadas abaixo.
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-8 border-t border-zinc-800 flex flex-col items-center gap-6">
                    <p className="text-zinc-600 text-sm">Entre em contato comigo se tiver alguma dúvida sobre estes termos.</p>
                    <div className="flex gap-6">
                        <a
                            href="https://www.instagram.com/devf____/"
                            target="_blank"
                            className="text-zinc-500 hover:text-accent transition-colors"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="https://github.com/felipesoarws/"
                            target="_blank"
                            className="text-zinc-500 hover:text-accent transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/felipesoarws/"
                            target="_blank"
                            className="text-zinc-500 hover:text-accent transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
