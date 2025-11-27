'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchStockPrice, StockPrice } from '@/services/kisStockClient';

export function useStockPrice(stockCode: string) {
  return useQuery<StockPrice, Error>({
    queryKey: ['stock', stockCode, 'price'],
    queryFn: () => fetchStockPrice(stockCode),
    enabled: !!stockCode,
    refetchInterval: 30_000,  // 30초마다 갱신
    staleTime: 15_000,        // 15초 동안 fresh
  });
}
