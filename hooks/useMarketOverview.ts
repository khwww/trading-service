import { useQuery } from '@tanstack/react-query';
import { fetchMarketOverview, type MarketOverviewItem } from '@/services/kisMarketClient';

export function useMarketOverview() {
  return useQuery<MarketOverviewItem[], Error>({
    queryKey: ['marketOverview'],
    queryFn: fetchMarketOverview,
    staleTime: 1000 * 60, // 1분
    refetchInterval: 1000 * 60, // 1분마다 리페치
  });
}
