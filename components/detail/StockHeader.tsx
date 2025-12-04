'use client';

import { useStockPrice } from '@/hooks/useStockPrice';
import { useOverseasStockPrice } from '@/hooks/useOverseasStockPrice';
import { useRealtimePrice } from '@/hooks/useRealtimePrice';

type MarketType = 'DOMESTIC' | 'OVERSEAS';

type StockHeaderProps = {
  stockCode: string;
  stockName: string;
  market: MarketType;
};

export default function StockHeader({ stockCode, stockName, market }: StockHeaderProps) {
  const isDomestic = market === 'DOMESTIC';

  // 국내 주식 데이터
  const domesticQuery = useStockPrice(isDomestic ? stockCode : '');
  // 해외 주식 데이터
  const overseasQuery = useOverseasStockPrice(isDomestic ? '' : stockCode);

  const { data, isLoading, error } = isDomestic ? domesticQuery : overseasQuery;

  // WebSocket 실시간 가격 (국내 주식, 장 시간에만 활성화)
  const { ticksByKey } = useRealtimePrice(
    isDomestic ? [{ symbol: stockCode, market: 'DOMESTIC' }] : []
  );
  const realtimeTick = isDomestic ? ticksByKey[`DOMESTIC:${stockCode}`] : null;

  // 실시간 틱이 있으면 사용, 없으면 REST 데이터 사용
  const displayPrice = realtimeTick?.price ?? data?.price ?? 0;
  const displayChange = realtimeTick?.change ?? data?.change ?? 0;
  const displayChangeRate = realtimeTick?.changeRate ?? data?.changeRate ?? 0;

  // 통화 단위
  const currency = isDomestic ? '원' : '$';

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

  // 해외 주식은 소수점 2자리까지 표시
  const formatPrice = (price: number) => {
    if (isDomestic) {
      return price.toLocaleString();
    }
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatChange = (change: number) => {
    if (isDomestic) {
      return change.toLocaleString();
    }
    return change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-black text-white py-4">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-lg font-semibold">{stockName || data.name || stockCode}</h1>
        <span className="text-sm text-gray-400">{data.code}</span>
        {!isDomestic && (
          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">해외</span>
        )}
      </div>

      <div className="flex items-end gap-4">
        <div className="text-4xl font-bold">
          {isDomestic ? '' : '$'}{formatPrice(displayPrice)}{isDomestic ? '원' : ''}
        </div>
        <div className={`flex items-center gap-2 pb-1 ${isUp ? 'text-red-500' : isDown ? 'text-blue-500' : 'text-gray-400'}`}>
          <span className="text-sm">지난 장 대비</span>
          <span className="text-lg font-semibold">
            {displayChange > 0 ? '+' : ''}{isDomestic ? '' : '$'}{formatChange(displayChange)}{isDomestic ? '원' : ''}
          </span>
          <span className="text-lg font-semibold">
            ({displayChangeRate > 0 ? '+' : ''}{displayChangeRate.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
