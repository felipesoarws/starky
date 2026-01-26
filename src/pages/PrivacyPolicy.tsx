import { ArrowLeft, Instagram, Github, Linkedin } from "lucide-react";
import { Link } from "react-router";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-black text-zinc-300 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <Link to="/">
                        <button className="px-4 text-sm py-2.5 gap-2 text-zinc-500 inline-flex items-center justify-center ring-transparent font-medium transition-all duration-200 focus:outline-none rounded-full hover:text-white mb-8 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Home
                        </button>
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-4">Política de Privacidade</h1>
                    <p className="text-zinc-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Visão Geral</h2>
                        <p className="leading-relaxed text-zinc-400">
                            Olá! Esta política de privacidade explica como seus dados são tratados no Starky.
                            Como um projeto desenvolvido por uma única pessoa (<strong className="text-zinc-200">Felipe Soares</strong>), prezo pela simplicidade e transparência.
                            Não há grandes corporações ou venda de dados aqui. O foco é fornecer uma ferramenta de estudo eficiente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Dados Coletados e Finalidade</h2>
                        <p className="leading-relaxed mb-4 text-zinc-400">
                            Coletamos apenas o necessário para o funcionamento do serviço:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                            <li><strong className="text-zinc-200">Email:</strong> Usado exclusivamente para criar sua conta, permitir login e vincular seus dados. Isso possibilita a sincronização do seu progresso entre diferentes dispositivos.</li>
                            <li><strong className="text-zinc-200">Dados de Estudo:</strong> Decks, flashcards e estatísticas de revisão (fácil/médio/difícil). Estes dados são armazenados em nuvem para que você não perca seu progresso ao trocar de computador ou celular.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Armazenamento e Segurança</h2>
                        <p className="leading-relaxed text-zinc-400">
                            Seus dados são armazenados em serviços de banco de dados seguros. Embora eu adote as melhores práticas de desenvolvimento para proteger suas informações,
                            lembre-se que nenhum serviço na internet é 100% invulnerável. Recomendo não utilizar senhas repetidas de outros serviços importantes (caso venha a ser implementado login com senha) e manter backups pessoais de conteúdos críticos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Compartilhamento de Dados</h2>
                        <p className="leading-relaxed text-zinc-400">
                            <strong className="text-zinc-200">Seus dados não são vendidos.</strong> Não compartilhamos suas informações pessoais com terceiros para fins de marketing.
                            O compartilhamento ocorre apenas com os provedores de infraestrutura técnica (como hospedagem e banco de dados) estritamente para manter o site no ar.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies</h2>
                        <p className="leading-relaxed text-zinc-400">
                            Utilizamos cookies locais principalmente para manter sua sessão ativa ("lembrar de mim"), para que você não precise fazer login toda vez que abrir o site.
                            Não utilizamos cookies invasivos de rastreamento publicitário.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Seus Direitos</h2>
                        <p className="leading-relaxed text-zinc-400">
                            Você tem total controle sobre seus dados. Se desejar excluir sua conta e todos os dados associados a ela (decks e histórico), basta entrar em contato comigo diretamente.
                            A exclusão será realizada manualmente e todos os seus registros serão removidos permanentemente do banco de dados.
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-8 border-t border-zinc-800 flex flex-col items-center gap-6">
                    <p className="text-zinc-600 text-sm">Entre em contato comigo se tiver alguma dúvida sobre esta política.</p>
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

export default PrivacyPolicy;
