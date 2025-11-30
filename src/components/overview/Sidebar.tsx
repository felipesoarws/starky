import { BarChart3, Eye, LampDesk, Library, Lock, LogOut } from "lucide-react";
import type { TabType } from "./types";
import { Link } from "react-router";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onExit: () => void;
}

const Sidebar = ({ activeTab, setActiveTab, onExit }: SidebarProps) => {
  const getButtonClass = (tab: TabType) =>
    `cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
      activeTab === tab
        ? "bg-zinc-900 text-white"
        : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
    }`;

  return (
    <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col">
      <Link to={"/"}>
        <div className="p-6 border-b border-zinc-800 flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-(--accent-color) rounded-lg flex items-center justify-center shadow-lg shadow-(--accent-color)/20">
            <LampDesk className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Starky
          </span>
        </div>
      </Link>
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-xs font-bold text-zinc-600 uppercase px-4 py-2 mt-2">
          Decks (Dev Mode)
        </div>
        <button
          onClick={() => setActiveTab("decks_view")}
          className={getButtonClass("decks_view")}
        >
          <Eye className="w-4 h-4" /> Decks (View)
        </button>
        <button
          onClick={() => setActiveTab("decks_locked")}
          className={getButtonClass("decks_locked")}
        >
          <Lock className="w-4 h-4" /> Decks (Locked)
        </button>
        <div className="my-2 border-t border-zinc-800"></div>

        <button
          onClick={() => setActiveTab("library")}
          className={getButtonClass("library")}
        >
          <Library className="w-4 h-4" /> Explorar
        </button>

        <div className="my-2 border-t border-zinc-800"></div>

        <div className="text-xs font-bold text-zinc-600 uppercase px-4 py-2">
          Stats (Dev Mode)
        </div>

        <button
          onClick={() => setActiveTab("stats_view")}
          className={getButtonClass("stats_view")}
        >
          <BarChart3 className="w-4 h-4" /> Stats (View)
        </button>
        <button
          onClick={() => setActiveTab("stats_locked")}
          className={getButtonClass("stats_locked")}
        >
          <Lock className="w-4 h-4" /> Stats (Locked)
        </button>
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={onExit}
          className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
