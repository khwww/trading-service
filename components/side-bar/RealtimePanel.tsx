"use client";

import { useState } from "react";

const REALTIME_STOCKS = [
  {
    rank: 1,
    name: "인스파이어 베터리나 파트너스",
    price: "186원",
    change: "-207원",
    changeRate: "(52.67%)",
    isPositive: false,
    icon: "🔵",
  },
  {
    rank: 2,
    name: "커버 뱅크프",
    price: "2,139원",
    change: "-2,271원",
    changeRate: "(51.49%)",
    isPositive: false,
    icon: "🔵",
  },
  {
    rank: 3,
    name: "에지오스 파마슈티컬스",
    price: "33,963원",
    change: "-32,688원",
    changeRate: "(49.04%)",
    isPositive: false,
    icon: "🔵",
  },
  {
    rank: 4,
    name: "텔레스트 테라퓨틱스",
    price: "7,355원",
    change: "-6,183원",
    changeRate: "(45.67%)",
    isPositive: false,
    icon: "🔵",
  },
  {
    rank: 5,
    name: "엔터로 테라퓨틱스",
    price: "4,263원",
    change: "-1,362원",
    changeRate: "(24.21%)",
    isPositive: false,
    icon: "🔵",
  },
  {
    rank: 6,
    name: "SMX(시큐리티 매터스)",
    price: "5,743원",
    change: "-1,992원",
    changeRate: "(25.75%)",
    isPositive: false,
    icon: "⚪",
  },
  {
    rank: 7,
    name: "MV 오일 트러스트",
    price: "1,802원",
    change: "-542원",
    changeRate: "(23.12%)",
    isPositive: false,
    icon: "⚪",
  },
  {
    rank: 8,
    name: "알파리틱 홀딩스",
    price: "2,271원",
    change: "-630원",
    changeRate: "(21.71%)",
    isPositive: false,
    icon: "🔴",
  },
  {
    rank: 9,
    name: "산젠",
    price: "4,307원",
    change: "-996원",
    changeRate: "(18.78%)",
    isPositive: false,
    icon: "🔵",
  },
];

export default function RealtimePanel() {
  const [selectedTab, setSelectedTab] = useState<"전체" | "국내" | "해외">(
    "전체"
  );

  return (
    <div
      className="h-full bg-zinc-900 text-white overflow-y-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* 헤더 */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">실시간</h2>
          <span className="text-[10px] text-gray-400">오늘 01:01 기준</span>
        </div>
      </div>

      {/* 탭 */}
      <div className="px-3 pt-3 flex gap-3 border-b border-gray-800">
        {(["전체", "국내", "해외"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`pb-2 px-1.5 text-xs ${
              selectedTab === tab
                ? "border-b-2 border-white font-semibold"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 실시간 종목 리스트 */}
      <div className="divide-y divide-gray-800">
        {REALTIME_STOCKS.map((stock) => (
          <div
            key={stock.rank}
            className="p-3 hover:bg-zinc-800 cursor-pointer flex items-center gap-3"
          >
            <div className="text-xs text-gray-400 w-5">{stock.rank}</div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-lg">{stock.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{stock.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold">{stock.price}</div>
              <div
                className={`text-[10px] ${
                  stock.isPositive ? "text-red-500" : "text-blue-500"
                }`}
              >
                {stock.change} {stock.changeRate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
