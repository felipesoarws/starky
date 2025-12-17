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
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introdução</h2>
                        <p className="leading-relaxed">
                            Bem-vindo ao Starky. Nós respeitamos sua privacidade e estamos comprometidos em proteger seus dados pessoais.
                            Esta política de privacidade irá informá-lo sobre como cuidamos de seus dados pessoais quando você visita nosso site
                            e lhe falar sobre seus direitos de privacidade e como a lei o protege.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Dados que Coletamos</h2>
                        <p className="leading-relaxed mb-4">
                            Podemos coletar, usar, armazenar e transferir diferentes tipos de dados pessoais sobre você, que agrupamos da seguinte forma:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong className="text-white">Dados de Identidade:</strong> inclui nome, sobrenome, nome de usuário ou identificador similar.</li>
                            <li><strong className="text-white">Dados de Contato:</strong> inclui endereço de email.</li>
                            <li><strong className="text-white">Dados Técnicos:</strong> inclui endereço de protocolo de internet (IP), seus dados de login, tipo e versão do navegador, configuração de fuso horário e localização.</li>
                            <li><strong className="text-white">Dados de Uso:</strong> inclui informações sobre como você usa nosso site, produtos e serviços (ex: decks criados, tempo de estudo).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Como Usamos Seus Dados</h2>
                        <p className="leading-relaxed mb-4">
                            Só usaremos seus dados pessoais quando a lei nos permitir. Mais comumente, usaremos seus dados pessoais nas seguintes circunstâncias:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Para registrar você como novo cliente.</li>
                            <li>Para fornecer e manter nosso Serviço, incluindo monitorar o uso do nosso Serviço.</li>
                            <li>Para gerenciar sua conta: para gerenciar seu registro como usuário do Serviço.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Segurança dos Dados</h2>
                        <p className="leading-relaxed">
                            Implementamos medidas de segurança apropriadas para impedir que seus dados pessoais sejam acidentalmente perdidos, usados ou acessados de forma não autorizada,
                            alterados ou divulgados. Além disso, limitamos o acesso aos seus dados pessoais aos funcionários, agentes, contratados e outros terceiros que tenham uma necessidade comercial de saber.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Seus Direitos Legais</h2>
                        <p className="leading-relaxed">
                            Sob certas circunstâncias, você tem direitos sob as leis de proteção de dados em relação aos seus dados pessoais, incluindo o direito de solicitar acesso,
                            correção, apagamento, restrição, transferência, ou de retirar o consentimento.
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
