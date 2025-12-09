import { BarChart3 } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router";

interface StatsViewProps {
  isLocked: boolean;
}

const StatsView = ({ isLocked }: StatsViewProps) => {
  const navigate = useNavigate();
  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
          <BarChart3 className="w-8 h-8 text-zinc-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Acompanhe seu progresso
        </h2>
        <p className="text-zinc-400 max-w-md mb-8">
          Faça login para ver estatísticas detalhadas sobre seu desempenho e
          retenção de memória.
        </p>
        <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/login")}>
          Fazer Login
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center h-[50vh] text-center">
      <BarChart3 className="w-16 h-16 text-zinc-700 mb-6" />
      <h3 className="text-xl font-bold text-white mb-2">
        Estatísticas em Breve
      </h3>
      <p className="text-zinc-500 max-w-md">
        O acompanhamento detalhado do seu progresso de repetição espaçada estará
        disponível na próxima atualização.
      </p>
    </div>
  );
};

export default StatsView;
