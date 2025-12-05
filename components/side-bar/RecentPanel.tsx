'use client';

import { useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentStocks, subscribeRecentStocks, removeRecentStock, type RecentStock } from '@/lib/recentStocks';
import { X } from 'lucide-react';

const emptyArray: RecentStock[] = [];

export default function RecentPanel() {
  const router = useRouter();
  const recentStocks = useSyncExternalStore(
    subscribeRecentStocks,
    getRecentStocks,
    () => emptyArray
  );

  const handleRemove = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentStock(code);
  };

  const handleClick = (stock: RecentStock) => {
    router.push(
      `/stocks/${stock.code}?name=${encodeURIComponent(stock.name)}&market=${stock.market}`
    );
  };

  return (
    <div
      className="h-full bg-zinc-900 text-white overflow-y-auto"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* 헤더 */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">최근 본</h2>
          <span className="text-sm text-gray-400">
            최대 20개
          </span>
        </div>
      </div>

      {/* 리스트 */}
      <div>
        {recentStocks.length === 0 ? (
          <div className="p-3 text-sm text-gray-400">
            최근 본 종목이 없습니다.
          </div>
        ) : (
          recentStocks.map((stock, index) => (
            <div
              key={stock.code}
              className="p-3 hover:bg-zinc-800 cursor-pointer flex items-center gap-3"
              onClick={() => handleClick(stock)}
            >
              <div className="text-sm text-gray-400 w-5">{index + 1}</div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg">
                  {stock.market === 'DOMESTIC' ? '🇰🇷' : '🌎'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{stock.name}</div>
                  <div className="text-xs text-gray-500">{stock.code}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => handleRemove(stock.code, e)}
                className="text-gray-500 hover:text-gray-300 p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
