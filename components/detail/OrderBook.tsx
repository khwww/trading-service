'use client';

import { useStockDaily } from '@/hooks/useStockDaily';

type OrderBookProps = {
  stockCode: string;
};

// 날짜 포맷 (YYYYMMDD -> MM.DD)
function formatDate(dateStr: string) {
  if (dateStr.length !== 8) return dateStr;
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${month}.${day}`;
}

// 거래량 포맷 (만 단위)
function formatVolume(volume: number) {
  if (volume >= 10000) {
    const man = Math.floor(volume / 10000);
    return `${man.toLocaleString()}만`;
  }
  return volume.toLocaleString();
}

export default function OrderBook({ stockCode }: OrderBookProps) {
  const { data, isLoading, error } = useStockDaily(stockCode);

  if (isLoading) {
    return (
      <div className="text-white p-4" style={{ background: 'var(--detail-section)' }}>
        <h2 className="text-lg font-semibold mb-4 leading-7">시세</h2>
        <div className="animate-pulse space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-white p-4" style={{ background: 'var(--detail-section)' }}>
        <h2 className="text-lg font-semibold mb-4 leading-7">시세</h2>
        <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className="text-white p-4" style={{ background: 'var(--detail-section)' }}>
      <h2 className="text-lg font-semibold mb-4 leading-7">시세</h2>

      <div
        className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 pr-2"
        style={{ height: '438px' }}
      >
        <table className="w-full text-sm">
          <thead className="sticky top-0 border-b border-gray-800" style={{ background: 'var(--detail-section)' }}>
            <tr className="text-gray-400">
              <th className="text-left py-2 font-normal">날짜</th>
              <th className="text-right py-2 font-normal">종가</th>
              <th className="text-right py-2 font-normal">등락률</th>
              <th className="text-right py-2 font-normal pr-2">거래량</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              // changeSign: 1(상한), 2(상승), 3(보합), 4(하한), 5(하락)
              const isUp = item.changeSign === '1' || item.changeSign === '2';
              const isDown = item.changeSign === '4' || item.changeSign === '5';

              return (
                <tr key={item.date} className="border-b border-gray-900 hover:bg-gray-900">
                  <td className="py-2 text-gray-400">{formatDate(item.date)}</td>
                  <td className="text-right">{item.close.toLocaleString()}원</td>
                  <td className={`text-right ${isUp ? 'text-red-500' : isDown ? 'text-blue-500' : 'text-gray-400'}`}>
                    {isUp ? '+' : ''}{item.changeRate}%
                  </td>
                  <td className="text-right text-gray-400 pr-2">
                    {formatVolume(item.volume)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        /* 커스텀 스크롤바 스타일 */
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
}
