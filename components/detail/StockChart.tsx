"use client";

import { useState, useSyncExternalStore } from "react";
import {
  AreaChart,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useStockDaily } from "@/hooks/useStockDaily";
import { useOverseasStockDaily } from "@/hooks/useOverseasStockDaily";
import { useStockPrice } from "@/hooks/useStockPrice";
import { Grid3X3, TrendingUp, BarChart3 } from "lucide-react";

// 오늘 날짜 문자열 (YYYYMMDD)
function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

type MarketType = 'DOMESTIC' | 'OVERSEAS';

// 커스텀 툴팁 컴포넌트
function CustomTooltip({
  active,
  payload,
  isDomestic
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { time: string; changeSign: string } }>;
  isDomestic?: boolean;
}) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const price = data.value;
  const changeSign = data.payload.changeSign;
  const isUp = changeSign === '1' || changeSign === '2';

  const formatPrice = (p: number) => {
    if (isDomestic) {
      return `${p.toLocaleString()}원`;
    }
    return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className={`${isUp ? 'bg-red-500' : 'bg-blue-500'} text-white px-3 py-1 rounded text-sm shadow-lg`}>
      <div className="font-semibold">{formatPrice(price)}</div>
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
  market: MarketType;
};

type ChartType = 'area' | 'line';

export default function StockChart({ stockCode, market }: StockChartProps) {
  const isDomestic = market === 'DOMESTIC';

  // 국내 주식 일별 데이터
  const domesticQuery = useStockDaily(isDomestic ? stockCode : '');
  // 해외 주식 일별 데이터
  const overseasQuery = useOverseasStockDaily(isDomestic ? '' : stockCode);
  // 국내 주식 현재가 (30초마다 갱신)
  const { data: currentPrice } = useStockPrice(isDomestic ? stockCode : '');

  const { data, isLoading, error } = isDomestic ? domesticQuery : overseasQuery;

  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const [showGrid, setShowGrid] = useState(true);
  const [chartType, setChartType] = useState<ChartType>('area');

  // 차트용 데이터 변환 (최근 30일, 날짜 오름차순 정렬)
  // 오늘 날짜인 경우 30초마다 갱신되는 currentPrice 사용
  const CHART_DAYS = 30;
  const todayStr = getTodayString();
  const chartData = data
    ? [...data]
        .slice(0, CHART_DAYS) // 최근 30일만 사용
        .reverse()
        .map((item) => {
          const isToday = item.date === todayStr;
          // 국내 주식이고 오늘 날짜이면 실시간 가격 사용
          const useRealtimePrice = isToday && isDomestic && currentPrice;
          return {
            time: formatDate(item.date),
            price: useRealtimePrice ? currentPrice.price : item.close,
            changeSign: useRealtimePrice ? currentPrice.changeSign : item.changeSign,
          };
        })
    : [];

  // 등락 여부 (차트 색상용) - 오늘 날짜면 실시간 데이터 사용
  const latestChangeSign = isDomestic && currentPrice
    ? currentPrice.changeSign
    : data?.[0]?.changeSign;
  const isUp = latestChangeSign === '1' || latestChangeSign === '2';

  if (isLoading) {
    return (
      <div className="text-white p-4 rounded-lg" style={{ background: 'var(--detail-section)' }}>
        <h2 className="text-lg font-semibold mb-4 leading-7">차트</h2>
        <div className="animate-pulse" style={{ height: "400px" }}>
          <div className="h-full bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-white p-4 rounded-lg" style={{ background: 'var(--detail-section)' }}>
        <h2 className="text-lg font-semibold mb-4 leading-7">차트</h2>
        <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className="text-white p-4 rounded-lg" style={{ background: 'var(--detail-section)' }}>
      <h2 className="text-lg font-semibold mb-4 leading-7">차트</h2>

      {/* 차트 컨트롤 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* 그리드 토글 */}
          <button
            className={`p-1.5 rounded cursor-pointer ${showGrid ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
            onClick={() => setShowGrid(!showGrid)}
            title="그리드 표시/숨김"
          >
            <Grid3X3 size={18} />
          </button>
          {/* 차트 타입 토글 */}
          <button
            className="p-1.5 rounded cursor-pointer hover:bg-gray-800"
            onClick={() => setChartType(chartType === 'area' ? 'line' : 'area')}
            title={chartType === 'area' ? '선 차트로 변경' : '면적 차트로 변경'}
          >
            {chartType === 'area' ? <TrendingUp size={18} /> : <BarChart3 size={18} />}
          </button>
        </div>
      </div>

      {/* 차트 */}
      <div className="relative" style={{ height: "400px" }}>
        {isMounted && (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
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
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
                <Tooltip content={<CustomTooltip isDomestic={isDomestic} />} />
                <XAxis
                  dataKey="time"
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                />
                <YAxis
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                  domain={isDomestic ? ["dataMin - 1000", "dataMax + 1000"] : ["auto", "auto"]}
                  tickFormatter={(value) =>
                    isDomestic
                      ? value.toLocaleString()
                      : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  }
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isUp ? "#dc2626" : "#2563eb"}
                  strokeWidth={2}
                  fill={isUp ? "url(#colorUp)" : "url(#colorDown)"}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
                <Tooltip content={<CustomTooltip isDomestic={isDomestic} />} />
                <XAxis
                  dataKey="time"
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                />
                <YAxis
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                  domain={isDomestic ? ["dataMin - 1000", "dataMax + 1000"] : ["auto", "auto"]}
                  tickFormatter={(value) =>
                    isDomestic
                      ? value.toLocaleString()
                      : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  }
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={isUp ? "#dc2626" : "#2563eb"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
