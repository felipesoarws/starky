import { useEffect, useState } from "react";

import Sidebar from "../components/overview/Sidebar";
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
    </div>
  );
}

export default Overview;
