'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchStockDaily, DailyPrice } from '@/services/kisStockClient';

export function useStockDaily(stockCode: string) {
  return useQuery<DailyPrice[], Error>({
    queryKey: ['stock', stockCode, 'daily'],
    queryFn: () => fetchStockDaily(stockCode),
    enabled: !!stockCode,
    staleTime: 60_000,  // 1분 동안 fresh (일별 데이터는 자주 안 바뀜)
  });
}
