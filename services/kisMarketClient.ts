export type MarketOverviewItem = {
  code: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
};

export type MarketOverviewResponse = {
  data: MarketOverviewItem[];
};

export async function fetchMarketOverview(): Promise<MarketOverviewItem[]> {
  const res = await fetch('/api/kis/market/overview');

  if (!res.ok) {
    throw new Error('Failed to fetch market overview');
  }

  const json: MarketOverviewResponse = await res.json();
  return json.data;
}
