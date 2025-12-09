import { Download, Menu, Search, Upload } from "lucide-react";
import { Button } from "../ui/Button";

import { useAuth } from "../../context/AuthContext";

interface OverviewHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuClick?: () => void;
}

const OverviewHeader = ({
  searchQuery,
  setSearchQuery,
  onMenuClick,
}: OverviewHeaderProps) => {
  const { user } = useAuth();


  console.log(user);
  
  const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
  }

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between px-6 md:px-8 shrink-0">
      <div className="flex items-center gap-3 text-sm text-zinc-400 w-full md:w-auto">
        <button 
            className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white"
            onClick={onMenuClick}
        >
            <Menu className="w-5 h-5" />
        </button>  
        
        <div className="relative flex-1 md:flex-none">
          <Search className="w-4 h-4 absolute left-3 top-1/4  text-zinc-500" />
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            type="text"
            placeholder="Buscar..."
            className="text-[.8rem] bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-1.5 focus:outline-none focus:border-zinc-700 w-[90%] md:w-64 text-white placeholder-zinc-600"
          />
        </div>
      </div>


      {user && (
         <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex"
          onClick={() => alert("Feature: Importar Decks")}
        >
          <Upload className="w-4 h-4 mr-2" /> Importar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex"
          onClick={() => alert("Feature: Exportar Decks")}
        >
          <Download className="w-4 h-4 mr-2" /> Exportar
        </Button>
        <div className="cursor-pointer select-none w-8 h-8 rounded-full bg-linear-to-l from-(--accent-color) to-blue-400 flex items-center justify-center text-xs font-bold text-white border border-white/10" title={user?.name}>
          {user ? getInitials(user.name) : "G"}
        </div>
      </div>
      )}
     
    </header>
  );
};

export default OverviewHeader;
