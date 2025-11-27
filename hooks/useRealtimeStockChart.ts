'use client';

import { useQuery } from '@tanstack/react-query';
import {
  DomesticRankingItem,
  DomesticRankingMetric,
  fetchDomesticRanking,
} from '@/services/kisRankingClient';

type RankingMetric = 'amount' | 'volume' | 'rising' | 'falling';

type RegionFilter = '전체' | '국내' | '해외';

type ResolvedRankingQuery = {
  queryKey: (string | RegionFilter | RankingMetric)[];
  enabled: boolean;
  queryFn: () => Promise<DomesticRankingItem[]>;
  notImplementedMessage?: string;
};

function resolveRankingQuery(
  region: string,
  metric: string
): ResolvedRankingQuery {
  const regionFilter: RegionFilter =
    region === '국내' || region === '해외' ? (region as RegionFilter) : '전체';

  let rankingMetric: RankingMetric | null = null;
  if (metric.includes('거래대금')) rankingMetric = 'amount';
  else if (metric.includes('거래량')) rankingMetric = 'volume';
  else if (metric.includes('급상승')) rankingMetric = 'rising';
  else if (metric.includes('급하락')) rankingMetric = 'falling';

  if (!rankingMetric) {
    return {
      queryKey: ['ranking', regionFilter, 'unknown'],
      enabled: false,
      queryFn: async () => [],
      notImplementedMessage: '선택한 지표는 아직 준비 중입니다.',
    };
  }

  if (rankingMetric === 'amount' || rankingMetric === 'volume') {
    const apiMetric: DomesticRankingMetric = rankingMetric;
    return {
      queryKey: ['ranking', 'domestic', apiMetric],
      enabled: true,
      queryFn: () => fetchDomesticRanking(apiMetric),
    };
  }

  // 국내 급상승 / 급하락
  if (rankingMetric === 'rising' || rankingMetric === 'falling') {
    return {
      queryKey: ['ranking', 'domestic', rankingMetric],
      enabled: false,
      queryFn: async () => [],
      notImplementedMessage: '국내 급등/급락 순위는 아직 준비 중입니다.',
    };
  }

  // 해외 미구현
  if (regionFilter === '해외') {
    return {
      queryKey: ['ranking', 'overseas', rankingMetric],
      enabled: false,
      queryFn: async () => [],
      notImplementedMessage: '해외 실시간 순위는 아직 준비 중입니다.',
    };
  }

  return {
    queryKey: ['ranking', regionFilter, 'unknown'],
    enabled: false,
    queryFn: async () => [],
    notImplementedMessage: '선택한 조합은 아직 준비 중입니다.',
  };
}

type UseRealtimeStockChartResult = {
  items: DomesticRankingItem[];
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

export function useRealtimeStockChart(
  region: string,
  metric: string
): UseRealtimeStockChartResult {
  const resolved = resolveRankingQuery(region, metric);

  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
    dataUpdatedAt,
    refetch,
  } = useQuery<DomesticRankingItem[], Error>({
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
