"use client";

import { useMarketOverview } from "@/hooks/useMarketOverview";

function isExchangeRate(code: string) {
  return code.startsWith("FX@");
}

// 값 포맷팅
function formatValue(value: number, code: string) {
  if (isExchangeRate(code)) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// 변동값 포맷팅
function formatChange(change: number, code: string) {
  const sign = change >= 0 ? "+" : "";
  if (isExchangeRate(code)) {
    return `${sign}${change.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${sign}${change.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function MarketOverview() {
  const { data, isLoading, error } = useMarketOverview();

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="flex gap-3 pb-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-[180px] rounded-lg border border-border/50 bg-card p-3 shadow-sm animate-pulse"
            >
              <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-700 rounded w-28 mb-1"></div>
              <div className="h-4 bg-gray-700 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="mb-4">
        <div className="text-sm text-muted-foreground">
          시장 데이터를 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex gap-3 pb-1.5">
        {data.map((market) => (
          <div
            key={market.code}
            className="min-w-[180px] cursor-pointer rounded-lg border border-border/50 bg-card p-3 text-card-foreground shadow-sm hover:bg-muted"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1 text-sm text-muted-foreground">
                  {market.name}
                </div>
                <div className="mb-0.5 text-xl font-semibold tabular-nums">
                  {formatValue(market.value, market.code)}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    market.isPositive ? "text-red-500" : "text-blue-500"
                  }`}
                >
                  <span>{formatChange(market.change, market.code)}</span>
                  <span>
                    ({market.changePercent >= 0 ? "+" : ""}
                    {market.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
