'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchOverseasStockDaily,
  OverseasDailyPrice,
} from '@/services/kisStockClient';

export function useOverseasStockDaily(stockCode: string, excd: string = 'NAS') {
  return useQuery<OverseasDailyPrice[], Error>({
    queryKey: ['overseas-stock', stockCode, excd, 'daily'],
    queryFn: () => fetchOverseasStockDaily(stockCode, excd),
    enabled: !!stockCode,
    staleTime: 60_000, // 60초 동안 fresh (일별 데이터는 자주 안 바뀜)
  });
}
