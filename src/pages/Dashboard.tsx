import React, { useState, useEffect } from "react";
import BotsDashboard from "./BotsDashboard";
import BotSetup from "./BotSetup";
import { useSearchParams } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showBotSetup, setShowBotSetup] = useState(false);
  const [deployedBots, setDeployedBots] = useState<any[]>([]);

  const forceEmptyState = searchParams.get("new") === "true";
  const modifyMode = searchParams.get("modify") === "true";

  const bots =
    (deployedBots.length > 0 && !forceEmptyState) || modifyMode
      ? deployedBots
      : [];

  useEffect(() => {
    const loadBots = () => {
      const botsFromStorage = JSON.parse(localStorage.getItem("deployedBots") || "[]");

      const migratedBots = botsFromStorage.map((bot: any) => {
        if (!bot.createdAt) {
          const currentTime = new Date();
          return {
            ...bot,
            createdAt: currentTime.toISOString(),
            lastStatusChange: currentTime.toISOString(),
            totalPausedTime: 0,
            lastPausedAt: null,
          };
        }
        return bot;
      });

      if (migratedBots.some((bot: any) => !bot.createdAt)) {
        localStorage.setItem("deployedBots", JSON.stringify(migratedBots));
      }

      setDeployedBots(migratedBots);
      console.log("Dashboard: Loaded bots from localStorage:", migratedBots);
    };

    loadBots();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "deployedBots") {
        loadBots();
      }
    };

    const handleFocus = () => {
      loadBots();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    const interval = setInterval(() => {
      const currentBots = JSON.parse(localStorage.getItem("deployedBots") || "[]");
      if (currentBots.length !== deployedBots.length) {
        loadBots();
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [deployedBots.length]);

  const instruments = [
    {
      title: "Dollar Cost Average",
      description: "Description & some performance data",
      from: "#00b544",
      to: "#003315",
    },
    {
      title: "Trade or Invest",
      description: "Description & some performance data",
      from: "#1e2a78",
      to: "#101940",
    },
    {
      title: "Portfolio or Rebalancer",
      description: "Description & some performance data",
      from: "#a020f0",
      to: "#511080",
    },
    {
      title: "Proprietary",
      description: "Description & some performance data",
      from: "#d2691e",
      to: "#703500",
    },
    {
      title: "Investoaccumulator",
      description: "Description & some performance data",
      from: "#1e90ff",
      to: "#0b3e75",
    },
    {
      title: "Buy & Hold",
      description: "Description & some performance data",
      from: "#000000",
      to: "#333333",
    },
  ];

  return (
    <div>
      {showBotSetup || modifyMode ? (
        <BotSetup
          onBack={() => {
            setShowBotSetup(false);
            window.history.replaceState({}, "", "/dashboard");
          }}
        />
      ) : bots.length > 0 ? (
        <BotsDashboard bots={bots} />
      ) : (
        <div className="min-h-screen bg-gray-100 border-t border-gray-200 relative overflow-hidden pb-40">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10">
            <h2 className="text-green-600 text-3xl font-bold text-center mb-10">
              Select an instrument to get started
            </h2>
            <div className="max-w-4xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 items-stretch">
                {instruments.map((instrument, index) => (
                  <div
                    key={index}
                    style={{
                      background: `linear-gradient(135deg, ${instrument.from}, ${instrument.to})`,
                      fontFamily: "Montserrat, Arial, sans-serif",
                    }}
                    className="text-white h-32 rounded-md flex flex-col justify-center items-start px-6 text-left py-2 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() =>
                      instrument.title === "Dollar Cost Average" &&
                      setShowBotSetup(true)
                    }
                  >
                    <h3 className="text-lg font-semibold leading-tight mb-1">
                      {instrument.title}
                    </h3>
                    <p className="text-xs opacity-80">{instrument.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Robot + Caption */}
            <div className="flex flex-col items-center justify-center mt-6 relative z-30">
              <div className="relative">
                <img
                  src="/noun-robot-3206.svg"
                  alt="Robot"
                  className="w-52 h-auto opacity-50"
                />
                <p className="absolute left-1/2 transform -translate-x-1/2 top-[51%] text-gray-600 text-sm font-semibold whitespace-nowrap">
                  Nothing to robo here.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
