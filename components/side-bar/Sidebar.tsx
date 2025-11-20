"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  Heart,
  Clock,
  Flame,
} from "lucide-react";
import FavoritesPanel from "./FavoritesPanel";
import RecentPanel from "./RecentPanel";
import RealtimePanel from "./RealtimePanel";

type PanelType = "favorites" | "recent" | "realtime" | null;

interface SidebarProps {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
}

export default function Sidebar({ activePanel, setActivePanel }: SidebarProps) {
  const menuItems = [
    { icon: Heart, label: "관심", type: "favorites" as PanelType },
    { icon: Clock, label: "최근 본", type: "recent" as PanelType },
    { icon: Flame, label: "실시간", type: "realtime" as PanelType },
  ];

  const handleMenuClick = (type: PanelType) => {
    setActivePanel(activePanel === type ? null : type);
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "favorites":
        return <FavoritesPanel />;
      case "recent":
        return <RecentPanel />;
      case "realtime":
        return <RealtimePanel />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* 확장 패널 */}
      <div
        className={`fixed right-16 top-0 h-screen bg-zinc-900 border-l border-gray-800 z-50 transition-all duration-300 ${
          activePanel ? "w-96" : "w-0"
        } overflow-y-auto overflow-x-hidden`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {renderPanel()}
      </div>

      {/* 사이드바 */}
      <aside className="fixed right-0 top-0 h-screen bg-zinc-900 border-l border-gray-800 z-60 w-16">
        {/* 접기/펼치기 버튼 */}
        <button
          onClick={() => setActivePanel(activePanel ? null : "favorites")}
          className="w-full py-4 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          {activePanel ? (
            <ChevronsRight size={20} />
          ) : (
            <ChevronsLeft size={20} />
          )}
        </button>

        {/* 메뉴 아이템 */}
        <nav className="flex flex-col">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item.type)}
              className={`flex flex-col items-center gap-1 py-4 transition-colors ${
                activePanel === item.type
                  ? "text-white bg-gray-800"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs text-center">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
