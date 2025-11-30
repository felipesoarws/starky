import { Download, Search, Upload } from "lucide-react";
import { Button } from "../ui/Button";

const OverviewHeader = () => {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between px-6 md:px-8 shrink-0">
      <div className="flex items-center gap-4 text-sm text-zinc-400">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-1.5 focus:outline-none focus:border-zinc-700 w-64 text-white placeholder-zinc-600"
          />
        </div>
      </div>
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
        <div className="cursor-pointer select-none w-8 h-8 rounded-full bg-linear-to-l from-(--accent-color) to-blue-400 flex items-center justify-center text-xs font-bold text-white border border-white/10">
          FS
        </div>
      </div>
    </header>
  );
};

export default OverviewHeader;
