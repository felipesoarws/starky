import { useEffect, useState } from "react";
import Sidebar from "../components/overview/Sidebar";
import OverviewHeader from "../components/overview/OverviewHeader";

import type { TabType } from "../components/overview/types";

interface OverviewProps {
  onExit: () => void;
  isLoggedIn?: boolean;
  onLogin?: () => void;
}

function Overview({ onExit, isLoggedIn = false, onLogin }: OverviewProps) {
  // view dividida de logada / não logada para ver o layout, dps tem que tirar
  const [activeTab, setActiveTab] = useState<TabType>("decks_view");

  return (
    <div className="min-h-screen bg-(--accent-background) flex flex-col md:flex-row overflow-hidden relative">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExit={onExit}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <OverviewHeader />
      </main>
    </div>
  );
}

export default Overview;
