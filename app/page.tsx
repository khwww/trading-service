import Header from '@/components/Header';
import MarketOverview from '@/components/MarketOverview';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex-1 mr-0 p-6 pr-24">
        <MarketOverview />
      </main>
    </div>
  );
}
