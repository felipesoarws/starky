import { BarChart3, Eye, LampDesk, Library, LogOut, X, Download, Upload, History } from "lucide-react";
import React, { useRef } from "react";
import type { TabType } from "./types";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";

import { useDialog } from "../../context/DialogContext";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen?: boolean;
  onClose?: () => void;

  // props de importar/exportar
  onImport?: (file: File) => void;
  onExportStart?: () => void;
  onExportConfirm?: () => void;
  isSelectionMode?: boolean;
  onToggleSelectionMode?: () => void;
  selectedCount?: number;
}

const Sidebar = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  onImport,
  onExportConfirm,
  isSelectionMode,
  onToggleSelectionMode,
  selectedCount = 0
}: SidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showConfirm } = useDialog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onLogout = () => {
    showConfirm("Sair", "Você deseja deslogar e voltar para a página inicial?", () => {
      logout();
      navigate("/");
    });
  };

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
    if (event.target) {
      event.target.value = "";
    }
    // fecha a sidebar depois da ação se quiser, ou mantém aberta
    if (onClose) onClose();
  };

  const getButtonClass = (tab: TabType) =>
    `cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${activeTab === tab
      ? "bg-zinc-900 text-white"
      : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
    }`;

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleFileChange}
      />

      {/* overlay do mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* conteúdo da sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:flex
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>

        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <Link to={"/"} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-(--accent-color) rounded-lg flex items-center justify-center shadow-lg shadow-(--accent-color)/20">
              <LampDesk className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Starky
            </span>
          </Link>
          <button className="md:hidden text-zinc-500 hover:text-white" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-zinc-600 uppercase px-4 py-2 mt-2">
            Decks
          </div>
          <button
            onClick={() => setActiveTab("decks_view")}
            className={getButtonClass("decks_view")}
          >
            <Eye className="w-4 h-4" /> Decks
          </button>


          <button
            onClick={() => setActiveTab("library")}
            className={getButtonClass("library")}
          >
            <Library className="w-4 h-4" /> Explorar
          </button>


          <div className="text-xs font-bold text-zinc-600 uppercase px-4 py-2">
            Stats
          </div>

          <button
            onClick={() => setActiveTab("stats_view")}
            className={getButtonClass("stats_view")}
          >
            <BarChart3 className="w-4 h-4" /> Estatísticas
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={getButtonClass("history")}
          >
            <History className="w-4 h-4" /> Histórico
          </button>

          {/* só no mobile: utils de importar/exportar */}
          <div className="md:hidden mt-6 pt-6 border-t border-zinc-900">
            <div className="text-xs font-bold text-zinc-600 uppercase px-4 py-2">
              Gerenciar
            </div>

            {isSelectionMode ? (
              <>
                <div className="px-4 py-2 text-xs text-zinc-400">
                  {selectedCount} selecionados
                </div>
                <button
                  onClick={() => {
                    if (onExportConfirm) {
                      onExportConfirm();
                      if (onClose) onClose();
                    }
                  }}
                  disabled={selectedCount === 0}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl text-green-500 hover:bg-zinc-900 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <Download className="w-4 h-4" /> Baixar JSON
                </button>
                <button
                  onClick={() => {
                    if (onToggleSelectionMode) onToggleSelectionMode();
                  }}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-sm font-medium"
                >
                  <X className="w-4 h-4" /> Cancelar Seleção
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleImportClick}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" /> Importar
                </button>
                <button
                  onClick={() => {
                    if (onToggleSelectionMode) {
                      onToggleSelectionMode();
                      if (onClose) onClose();
                    }
                  }}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" /> Exportar
                </button>
              </>
            )}
          </div>

        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={() => onLogout()}
            className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
