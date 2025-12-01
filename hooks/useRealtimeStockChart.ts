'use client';

import { useQuery } from '@tanstack/react-query';
import {
  DomesticRankingItem,
  DomesticRankingMetric,
  OverseasRankingMetric,
  fetchDomesticRanking,
  fetchOverseasRanking,
} from '@/services/kisRankingClient';

type RegionFilter = '전체' | '국내' | '해외';
type RankingMetric = 'amount' | 'volume' | 'rise' | 'fall';

type StockRankingItem = DomesticRankingItem;

type ResolvedRankingQuery = {
  queryKey: (string | RegionFilter | RankingMetric)[];
  enabled: boolean;
  queryFn: () => Promise<StockRankingItem[]>;
  notImplementedMessage?: string;
};

type UseRealtimeStockChartResult = {
  items: StockRankingItem[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  lastUpdated: string;
  refetch: () => void;
};

function formatTime(timestamp: number | null | undefined) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function resolveRankingMetric(metricLabel: string): RankingMetric | null {
  if (metricLabel.includes('거래대금')) return 'amount';
  if (metricLabel.includes('거래량')) return 'volume';
  if (metricLabel.includes('급상승')) return 'rise';
  if (metricLabel.includes('급하락')) return 'fall';
  return null;
}

function resolveRankingQuery(
  region: string,
  metricLabel: string
): ResolvedRankingQuery {
  const regionFilter: RegionFilter =
    region === '국내' || region === '해외' ? (region as RegionFilter) : '전체';

  const rankingMetric = resolveRankingMetric(metricLabel);

  if (!rankingMetric) {
    return {
      queryKey: ['ranking', regionFilter, 'unknown'],
      enabled: false,
      queryFn: async () => [],
      notImplementedMessage: '선택한 지표는 아직 준비 중입니다.',
    };
  }

  // 국내
  if (regionFilter === '국내') {
    const apiMetric: DomesticRankingMetric = rankingMetric;

    return {
      queryKey: ['ranking', 'domestic', apiMetric],
      enabled: true,
      queryFn: () => fetchDomesticRanking(apiMetric),
    };
  }

  // 해외
  if (regionFilter === '해외') {
    const apiMetric: OverseasRankingMetric = rankingMetric;

    return {
      queryKey: ['ranking', 'overseas', apiMetric],
      enabled: true,
      queryFn: () => fetchOverseasRanking(apiMetric),
    };
  }

  // 전체
  if (regionFilter === '전체') {
    const domesticMetric: DomesticRankingMetric = rankingMetric;
    const overseasMetric: OverseasRankingMetric = rankingMetric;

    return {
      queryKey: ['ranking', 'all', rankingMetric],
      enabled: true,
      queryFn: async () => {
        const [domestic, overseas] = await Promise.all([
          fetchDomesticRanking(domesticMetric),
          fetchOverseasRanking(overseasMetric),
        ]);

        const combined: StockRankingItem[] = [...domestic, ...overseas];

        switch (rankingMetric) {
          case 'volume':
            combined.sort((a, b) => b.volume - a.volume);
            break;
          case 'amount':
            combined.sort((a, b) => b.amount - a.amount);
            break;
          case 'rise':
            combined.sort((a, b) => b.changeRate - a.changeRate);
            break;
          case 'fall':
            combined.sort((a, b) => a.changeRate - b.changeRate);
            break;
        }
        return combined;
      },
    };
  }
  return {
    queryKey: ['ranking', regionFilter, 'unknown'],
    enabled: false,
    queryFn: async () => [],
    notImplementedMessage: '선택한 조합은 아직 준비 중입니다.',
  };
}

export function useRealtimeStockChart(
  region: string,
  metricLabel: string
): UseRealtimeStockChartResult {
  const resolved = resolveRankingQuery(region, metricLabel);

  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
    dataUpdatedAt,
    refetch,
  } = useQuery<StockRankingItem[], Error>({
    queryKey: resolved.queryKey,
    queryFn: resolved.queryFn,
    enabled: resolved.enabled,
    refetchInterval: resolved.enabled ? 30_000 : false,
    staleTime: 15_000,
  });

  const items = data ?? [];

  const error =
    resolved.notImplementedMessage ?? (queryError ? queryError.message : null);

  return {
    items,
    isLoading: resolved.enabled && !error && isLoading,
    isFetching: resolved.enabled && isFetching,
    error,
    lastUpdated: resolved.enabled && !error ? formatTime(dataUpdatedAt) : '',
    refetch,
  };
}
