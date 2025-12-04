'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchOverseasStockPrice,
  OverseasStockPrice,
} from '@/services/kisStockClient';

export function useOverseasStockPrice(stockCode: string, excd: string = 'NAS') {
  return useQuery<OverseasStockPrice, Error>({
    queryKey: ['overseas-stock', stockCode, excd, 'price'],
    queryFn: () => fetchOverseasStockPrice(stockCode, excd),
    enabled: !!stockCode,
    refetchInterval: 30_000, // 30초마다 갱신
    staleTime: 15_000, // 15초 동안 fresh
  });
}
