'use client';

import { useState } from 'react';
import { useRealtimeStockChart } from '@/hooks/useRealtimeStockChart';
import { useRealtimePrice } from '@/hooks/useRealtimePrice';
import type { MarketType } from '@/lib/kis/KISRealtimePriceManager';

type Tab = '전체' | '국내' | '해외';
type Metric = '거래대금' | '거래량' | '급상승' | '급하락';

const METRICS: Metric[] = ['거래대금', '거래량', '급상승', '급하락'];

export default function RealtimePanel() {
  const [selectedTab, setSelectedTab] = useState<Tab>('전체');
  const [metric, setMetric] = useState<Metric>('거래대금');
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);

  const region = selectedTab;

  const { items, isLoading, error, lastUpdated } = useRealtimeStockChart(
    region,
    metric
  );

  const isDomesticView = region === '국내' || region === '전체';

  const domesticSymbols = isDomesticView
    ? items
        .filter((item) => item.market === 'DOMESTIC')
        .map((item) => ({
          symbol: item.code,
          market: 'DOMESTIC' as MarketType,
        }))
    : [];

  const { ticksByKey } = useRealtimePrice(domesticSymbols);

  const mergedItems = items.map((item) => {
    if (item.market !== 'DOMESTIC') return item;

    const key = `DOMESTIC:${item.code}`;
    const tick = ticksByKey[key];

    if (!tick) return item;

    return {
      ...item,
      price: tick.price,
      changeRate: tick.changeRate,
    };
  });

  const visibleItems = mergedItems.filter((item) => {
    if (selectedTab === '전체') return true;
    if (selectedTab === '국내') return item.market === 'DOMESTIC';
    return item.market === 'OVERSEAS';
  });

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
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">실시간</h2>
          <span className="text-sm text-gray-400">
            {lastUpdated ? `오늘 ${lastUpdated} 기준` : '로딩중...'}
          </span>
        </div>
      </div>

      <div className="px-3 pt-3 border-b border-gray-800 relative">
        <div className="flex items-center justify-between">
          {/* 전체 / 국내 / 해외 탭 */}
          <div className="flex gap-3">
            {(['전체', '국내', '해외'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-2 px-1.5 text-sm cursor-pointer ${
                  selectedTab === tab
                    ? 'border-b-2 border-white font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* 정렬 기준 버튼 */}
          <button
            type="button"
            onClick={() => setIsMetricModalOpen((prev) => !prev)}
            className="flex items-center gap-1 pb-2  text-gray-300 rounded-full cursor-pointer"
          >
            <span className="text-sm text-gray-400">{metric}</span>
            <span className="text-xs">{isMetricModalOpen ? '▲' : '▼'}</span>
          </button>
        </div>
        {isMetricModalOpen && (
          <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-gray-700 bg-zinc-900 shadow-lg z-20">
            <div className="p-2 flex flex-col gap-1">
              {METRICS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMetric(m);
                    setIsMetricModalOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1 rounded text-sm cursor-pointer ${
                    metric === m
                      ? 'bg-white text-black'
                      : 'text-gray-200 hover:bg-zinc-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* 리스트 */}
      <div>
        {isLoading && (
          <div className="p-3 text-xs text-gray-400">불러오는 중...</div>
        )}
        {error && (
          <div className="p-3 text-xs text-red-500">
            실시간 데이터를 불러오지 못했습니다.
          </div>
        )}
        {!isLoading &&
          !error &&
          visibleItems.map((stock, index) => (
            <div
              key={stock.code ?? index}
              className="p-3 hover:bg-zinc-800 cursor-pointer flex items-center gap-3"
            >
              <div className="text-sm text-gray-400 w-5">{index + 1}</div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg">
                  {stock.market === 'DOMESTIC' ? '🇰🇷' : '🌎'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{stock.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">{stock.price?.toLocaleString()}원</div>
                <div
                  className={`text-sm ${
                    (stock.changeRate ?? 0) >= 0
                      ? 'text-red-500'
                      : 'text-blue-500'
                  }`}
                >
                  ({stock.changeRate}%)
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
