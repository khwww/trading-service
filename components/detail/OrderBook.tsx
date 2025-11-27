'use client';

import { mockOrderBook } from '@/data/mockData';

type OrderBookProps = {
  stockCode: string;
};

export default function OrderBook({ stockCode }: OrderBookProps) {
  // TODO: stockCode로 실제 API 호출 예정
  console.log('OrderBook stockCode:', stockCode);
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
              <th className="text-left py-2 font-normal">체결가</th>
              <th className="text-right py-2 font-normal">등락률</th>
              <th className="text-right py-2 font-normal pr-2">거래대금</th>
            </tr>
          </thead>
          <tbody>
            {mockOrderBook.map((item, index) => {
              const isNegative = item.changeRate.startsWith('+');
              return (
                <tr key={index} className="border-b border-gray-900 hover:bg-gray-900">
                  <td className="py-2">{item.date}</td>
                  <td className={`text-right ${isNegative ? 'text-red-500' : 'text-blue-500'}`}>
                    {item.changeRate}
                  </td>
                  <td className="text-right text-gray-400 pr-2">
                    {item.volume.toLocaleString()}
                    <div className="text-xs text-gray-600">4407</div>
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
