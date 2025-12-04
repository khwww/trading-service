'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import StockFilter from '@/components/main/StockFilter';
import StockTable from '@/components/main/StockTable';
import { useRealtimeStockChart } from '@/hooks/useRealtimeStockChart';
import type { MarketType } from '@/lib/kis/KISRealtimePriceManager';
import { useRealtimePrice } from '@/hooks/useRealtimePrice';
import { useFavoriteStock } from '@/hooks/useFavoriteStock';
import { fetchAuthUser, type AuthUser } from '@/services/fetchAuthUser';
import type {
  DomesticRankingItem,
  OverseasRankingItem,
} from '@/services/kisRankingClient';

type StockRankingItem = DomesticRankingItem | OverseasRankingItem;

export default function StockRanking() {
  const [region, setRegion] = useState<string>('전체');
  const [metric, setMetric] = useState<string>('거래대금');
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    let canceled = false;

    async function initAuth() {
      try {
        const cached = localStorage.getItem('stockdodo:user');
        if (cached && !canceled) {
          setUser(JSON.parse(cached));
        }
      } catch (e) {
        console.error('failed to parse cached user', e);
      }

      const me = await fetchAuthUser();
      if (!canceled) {
        setUser(me);
      }
    }

    initAuth();
    return () => {
      canceled = true;
    };
  }, []);

  const userKey = user?.id ?? null;
  const { isFavorite, toggleFavorite } = useFavoriteStock(userKey);

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

  const mergedItems: StockRankingItem[] = items.map((item) => {
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

  const handleToggleFavorite = (
    stock: StockRankingItem,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userKey) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    toggleFavorite({
      code: stock.code,
      name: stock.name,
      market: stock.market,
      price: typeof stock.price === 'number' ? stock.price : undefined,
      changeRate:
        typeof stock.changeRate === 'number' ? stock.changeRate : undefined,
    });
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
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        lastUpdated={lastUpdated}
        metricType={metric}
      />
    </div>
  );
}
