import { useEffect, useState } from "react";
import { ArrowLeft, LampDesk } from "lucide-react";
import { Link } from "react-router";

function Login() {
  const [isLogin] = useState<boolean>(true);

  useEffect(() => {
    document.title = "Starky | Login";
  }, []);

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="p-8 flex flex-col gap-4 lg:w-[60vw]">
        <Link to="/">
          <button className="px-4 text-sm py-2.5 gap-2 text-zinc-500 inline-flex items-center justify-center ring-transparent font-medium transition-all duration-200 focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Home
          </button>
        </Link>
        <div className="mt-10">
          <div className="animate-slide-up w-full flex flex-col items-center justify-between">
            <div className="mx-15 text-center space-y-1">
              <h1 className="text-4xl font-bold">
                {isLogin ? "Bem-vindo de volta!" : "Crie sua jornada"}
              </h1>
              <p className="text-md text-zinc-400">
                {isLogin
                  ? "Entre para continuar seus estudos."
                  : "Comece sua jornada de aprendizado hoje."}
              </p>
            </div>
            <div>
              <form action="" onSubmit={(e) => handleUserLogin(e)}></form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
