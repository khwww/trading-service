'use client';

import { useStockPrice } from '@/hooks/useStockPrice';
import { useRealtimePrice } from '@/hooks/useRealtimePrice';

type StockHeaderProps = {
  stockCode: string;
  stockName: string;
};

export default function StockHeader({ stockCode, stockName }: StockHeaderProps) {
  const { data, isLoading, error } = useStockPrice(stockCode);

  // WebSocket 실시간 가격 (장 시간에만 활성화)
  const { ticksByKey } = useRealtimePrice([
    { symbol: stockCode, market: 'DOMESTIC' },
  ]);
  const realtimeTick = ticksByKey[`DOMESTIC:${stockCode}`];

  // 실시간 틱이 있으면 사용, 없으면 REST 데이터 사용
  const displayPrice = realtimeTick?.price ?? data?.price ?? 0;
  const displayChange = realtimeTick?.change ?? data?.change ?? 0;
  const displayChangeRate = realtimeTick?.changeRate ?? data?.changeRate ?? 0;

  if (isLoading) {
    return (
      <div className="bg-black text-white py-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
          <div className="h-10 bg-gray-700 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-black text-white py-4">
        <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  // 실시간 데이터 기준으로 등락 판단 (색상용)
  const isUp = displayChange > 0;
  const isDown = displayChange < 0;

  return (
    <div className="bg-black text-white py-4">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-lg font-semibold">{stockName || data.name}</h1>
        <span className="text-sm text-gray-400">{data.code}</span>
      </div>

      <div className="flex items-end gap-4">
        <div className="text-4xl font-bold">
          {displayPrice.toLocaleString()}원
        </div>
        <div className={`flex items-center gap-2 pb-1 ${isUp ? 'text-red-500' : isDown ? 'text-blue-500' : 'text-gray-400'}`}>
          <span className="text-sm">지난 장 대비</span>
          <span className="text-lg font-semibold">
            {displayChange > 0 ? '+' : ''}{displayChange.toLocaleString()}원
          </span>
          <span className="text-lg font-semibold">
            ({displayChangeRate > 0 ? '+' : ''}{displayChangeRate.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
