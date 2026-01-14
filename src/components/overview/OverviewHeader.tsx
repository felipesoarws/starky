import { Download, Menu, Search, Upload, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useState, useRef, useEffect } from "react";

import { useAuth } from "../../context/AuthContext";

interface OverviewHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuClick?: () => void;
  isSelectionMode?: boolean;
  onToggleSelectionMode?: () => void;
  onExportConfirm?: () => void;
  selectedCount?: number;
  onImport?: (file: File) => void;
}

import { useDialog } from "../../context/DialogContext";
import { X } from "lucide-react";

const OverviewHeader = ({
  searchQuery,
  setSearchQuery,
  onMenuClick,
  isSelectionMode = false,
  onToggleSelectionMode,
  onExportConfirm,
  selectedCount = 0,
  onImport
}: OverviewHeaderProps) => {
  const { user, logout } = useAuth();
  const { showAlert } = useDialog();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      onImport(file);
    }
    // Reset input value so same file can be selected again
    if (event.target) {
      event.target.value = "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between px-6 md:px-8 shrink-0 relative z-20">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleFileChange}
      />
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
        <div className="flex items-center gap-3 relative" ref={profileRef}>

          {isSelectionMode ? (
            <div className="flex items-center gap-2 animate-fade-in mr-2">
              <span className="text-sm text-zinc-400 mr-2">{selectedCount} selecionados</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSelectionMode}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4 mr-1" /> Cancelar
              </Button>
              <Button
                size="sm"
                onClick={onExportConfirm}
                disabled={selectedCount === 0}
                className="bg-green-600 hover:bg-green-700 text-white border-green-500/20"
              >
                <Download className="w-4 h-4 mr-2" /> Baixar JSON
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImportClick}
              >
                <Upload className="w-4 h-4 mr-2" /> Importar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleSelectionMode ? onToggleSelectionMode : () => showAlert("Erro", "Função não disponível")}
              >
                <Download className="w-4 h-4 mr-2" /> Exportar
              </Button>
            </div>
          )}

          {/* Avatar Trigger */}
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="cursor-pointer select-none w-8 h-8 rounded-full bg-linear-to-l from-(--accent-color) to-blue-400 flex items-center justify-center text-xs font-bold text-white border border-white/10 hover:opacity-90 transition-opacity"
            title={user?.name}
          >
            {user ? getInitials(user.name) : "G"}
          </div>

          {/* Logout Dialog/Dropdown */}
          {isProfileOpen && (
            <div className="absolute top-10 right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-zinc-800">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>
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
      )}

    </header>
  );
};

export default OverviewHeader;
