'use client';

import { useState } from 'react';
import StockFilter from '@/components/main/StockFilter';
import StockTable from '@/components/main/StockTable';
import { useRealtimeStockChart } from '@/hooks/useRealtimeStockChart';
import type { MarketType } from '@/lib/kis/KISRealtimePriceManager';
import { useRealtimePrice } from '@/hooks/useRealtimePrice';

export default function StockRanking() {
  const [region, setRegion] = useState<string>('전체');
  const [metric, setMetric] = useState<string>('거래대금');
  const [favorites, setFavorites] = useState<number[]>([]);

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

  if (isLoading) {
    return <div className="mt-6">데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return (
      <div className="mt-6 text-red-500 text-sm">
        데이터를 불러오는데 실패했습니다.
        <br />
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mt-6 text-sm text-gray-500">
        표시할 순위 데이터가 없습니다.
      </div>
    );
  }

  const mergedItems = items.map((item) => {
    const key = `DOMESTIC:${item.code}`;
    const tick = ticksByKey[key];

    if (!tick) return item;

    const merged = {
      ...item,
      price: tick.price,
      changeRate: tick.changeRate,
    };
    console.log('[MERGED]', key, { base: item, tick, merged });
    return merged;
  });

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <StockFilter
        region={region}
        metric={metric}
        onRegionChange={setRegion}
        onMetricChange={setMetric}
      />
      <StockTable
        stocks={mergedItems}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        lastUpdated={lastUpdated}
        metricType={metric}
      />
    </div>
  );
}
