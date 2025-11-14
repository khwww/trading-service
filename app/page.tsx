import MarketOverview from '@/components/MarketOverview';
import StockRanking from '@/components/StockRanking';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="flex-1 mr-0 p-6 pr-24">
        <MarketOverview />
        <StockRanking />
      </main>
    </div>
  );
}
