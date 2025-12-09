import { useEffect, useState } from "react";
import { ArrowLeft, LampDesk, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";

function Login() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Starky | " + (isLogin ? "Login" : "Registro");
  }, [isLogin]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/overview");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !name)) {
      setError("Preencha todos os campos.");
      return;
    }

    let success = false;
    if (isLogin) {
      success = await login(email, password);
      if (!success) setError("Email ou senha inválidos.");
    } else {
      success = await register(name, email, password);
      if (!success) setError("Erro ao registrar. Email pode já estar em uso.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex">
      <div className="hidden lg:flex lg:w-[40vw] bg-zinc-900 border-r border-zinc-800 relative overflow-hidden items-center justify-center p-12 select-none pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern opacity-50" />
        <div className="animate-pulse-slow relative z-20 flex flex-col items-center">
          <div className="w-30 h-30 bg-gradient-to-bl from-accent from- via-blue-500 via- to-accent to-100%  rounded-3xl flex items-center justify-center shadow-2xl shadow-black/20 mb-6 transform rotate-3">
            <LampDesk className="w-18 h-18 text-white fill-white" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight drop-shadow-md  bg-gradient-to-bl from-blue-700 from- via-blue-500 via- to-blue-700 to-100% text-transparent bg-clip-text">
            Starky
          </h1>
        </div>
      </div>
      <div className="p-8 flex flex-col gap-4 lg:w-[60vw] w-full justify-center lg:justify-start">
        <div className="w-full max-w-md mx-auto">
            <Link to="/">
            <button className="px-4 text-sm py-2.5 gap-2 text-zinc-500 inline-flex items-center justify-center ring-transparent font-medium transition-all duration-200 focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:text-white mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Home
            </button>
            </Link>
            
            <div className="animate-slide-up w-full flex flex-col">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold">
                {isLogin ? "Bem-vindo de volta!" : "Crie sua jornada"}
                </h1>
                <p className="text-zinc-400">
                {isLogin
                    ? "Entre para continuar seus estudos."
                    : "Comece sua jornada de aprendizado hoje."}
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-300">Nome</label>
                        <input 
                            type="text" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent outline-none"
                            placeholder="Seu nome"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                )}
                
                <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Email</label>
                    <input 
                        type="email" 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent outline-none"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-300">Senha</label>
                    <input 
                        type="password" 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent outline-none"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="text-red-400 text-sm bg-red-900/10 p-3 rounded-lg border border-red-900/20">
                        {error}
                    </div>
                )}

                <Button className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isLogin ? "Entrar" : "Criar Conta"}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-500">
                {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                <button 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError("");
                    }} 
                    className="text-accent hover:underline font-medium"
                >
                    {isLogin ? "Registre-se" : "Faça login"}
                </button>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
