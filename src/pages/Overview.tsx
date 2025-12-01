import { useState } from "react";
import Sidebar from "../components/overview/Sidebar";
import OverviewHeader from "../components/overview/OverviewHeader";

import type { TabType } from "../components/overview/types";
import DecksView from "../components/overview/DecksView";
import LibraryView from "../components/overview/LibraryView";
import StatsView from "../components/overview/StatsView";

/* interface OverviewProps {
  isLoggedIn?: boolean;
}
 */
function Overview() {
  // view dividida de logada / não logada para ver o layout, dps tem que tirar
  const [activeTab, setActiveTab] = useState<TabType>("decks_view");

  return (
    <div className="min-h-screen bg-(--accent-background) flex flex-col md:flex-row overflow-hidden relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <OverviewHeader />

        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-dot-pattern">
          <div className="max-w-6xl mx-auto pb-20">
            {/* Decks view */}
            {(activeTab === "decks_view" || activeTab === "decks_locked") && (
              <DecksView />
            )}

            {/* Library view */}
            {activeTab === "library" && <LibraryView />}

            {/* Stats view */}
            {(activeTab === "stats_view" || activeTab === "stats_locked") && (
              <StatsView isLocked={activeTab === "stats_locked"} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Overview;
