'use client';

import { useStockPrice } from '@/hooks/useStockPrice';

type StockHeaderProps = {
  stockCode: string;
  stockName: string;
};

export default function StockHeader({ stockCode, stockName }: StockHeaderProps) {
  const { data, isLoading, error } = useStockPrice(stockCode);

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

  // changeSign: 1(상한), 2(상승), 3(보합), 4(하한), 5(하락)
  const isUp = data.changeSign === '1' || data.changeSign === '2';
  const isDown = data.changeSign === '4' || data.changeSign === '5';

  return (
    <div className="bg-black text-white py-4">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-lg font-semibold">{stockName || data.name}</h1>
        <span className="text-sm text-gray-400">{data.code}</span>
      </div>

      <div className="flex items-end gap-4">
        <div className="text-4xl font-bold">
          {data.price.toLocaleString()}원
        </div>
        <div className={`flex items-center gap-2 pb-1 ${isUp ? 'text-red-500' : isDown ? 'text-blue-500' : 'text-gray-400'}`}>
          <span className="text-sm">지난 장 대비</span>
          <span className="text-lg font-semibold">
            {isUp ? '+' : ''}{data.change.toLocaleString()}원
          </span>
          <span className="text-lg font-semibold">
            ({isUp ? '+' : ''}{data.changeRate}%)
          </span>
        </div>
      </div>
    </div>
  );
}
