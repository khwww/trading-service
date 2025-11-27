"use client";

import { useSyncExternalStore } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useStockDaily } from "@/hooks/useStockDaily";
import { TrendingUp, TrendingDown, Maximize2, Share2 } from "lucide-react";

// 커스텀 툴팁 컴포넌트
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { time: string; changeSign: string } }> }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const price = data.value;
  const changeSign = data.payload.changeSign;
  const isUp = changeSign === '1' || changeSign === '2';

  return (
    <div className={`${isUp ? 'bg-red-500' : 'bg-blue-500'} text-white px-3 py-1 rounded text-sm shadow-lg`}>
      <div className="font-semibold">{price.toLocaleString()}원</div>
      <div className="text-xs opacity-80">{data.payload.time}</div>
    </div>
  );
}

function subscribe() {
  return () => {};
}

// 날짜 포맷 (YYYYMMDD -> MM.DD)
function formatDate(dateStr: string) {
  if (dateStr.length !== 8) return dateStr;
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${month}.${day}`;
}

type StockChartProps = {
  stockCode: string;
};

export default function StockChart({ stockCode }: StockChartProps) {
  const { data, isLoading, error } = useStockDaily(stockCode);
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  // 차트용 데이터 변환 (날짜 오름차순 정렬)
  const chartData = data
    ? [...data]
        .reverse()
        .map((item) => ({
          time: formatDate(item.date),
          price: item.close,
          changeSign: item.changeSign,
        }))
    : [];

  // 등락 여부 (차트 색상용)
  const isUp = data?.[0]?.changeSign === '1' || data?.[0]?.changeSign === '2';

  if (isLoading) {
    return (
      <div className="text-white p-4" style={{ background: 'var(--detail-section)' }}>
        <h2 className="text-lg font-semibold mb-4 leading-7">차트</h2>
        <div className="animate-pulse" style={{ height: "400px" }}>
          <div className="h-full bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-white p-4" style={{ background: 'var(--detail-section)' }}>
        <h2 className="text-lg font-semibold mb-4 leading-7">차트</h2>
        <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className="text-white p-4" style={{ background: 'var(--detail-section)' }}>
      <h2 className="text-lg font-semibold mb-4 leading-7">차트</h2>

      {/* 차트 컨트롤 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <TrendingUp size={18} />
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <TrendingDown size={18} />
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M3 3h18v18H3z" />
            </svg>
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <Maximize2 size={18} />
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* 차트 */}
      <div className="relative" style={{ height: "400px" }}>
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <Tooltip content={<CustomTooltip />} />
              <XAxis
                dataKey="time"
                stroke="#666"
                tick={{ fill: "#999", fontSize: 12 }}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: "#999", fontSize: 12 }}
                domain={["dataMin - 1000", "dataMax + 1000"]}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isUp ? "#dc2626" : "#2563eb"}
                strokeWidth={2}
                fill={isUp ? "url(#colorUp)" : "url(#colorDown)"}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
