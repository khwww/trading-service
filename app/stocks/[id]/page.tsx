'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import StockHeader from '@/components/detail/StockHeader';
import StockChart from '@/components/detail/StockChart';
import OrderBook from '@/components/detail/OrderBook';

export type MarketType = 'DOMESTIC' | 'OVERSEAS';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function StockDetailPage({ params }: PageProps) {
  const { id: stockCode } = use(params);
  const searchParams = useSearchParams();
  const stockName = searchParams.get('name') || '';
  const market = (searchParams.get('market') || 'DOMESTIC') as MarketType;

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* 전체 컨텐츠 영역 */}
      <div className="px-6 detail-content-padding">
        {/* 헤더 */}
        <StockHeader stockCode={stockCode} stockName={stockName} market={market} />

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 차트 영역 */}
          <div className="lg:col-span-8 rounded-lg overflow-hidden">
            <StockChart stockCode={stockCode} market={market} />
          </div>

          {/* 호가창 영역 */}
          <div className="lg:col-span-4 rounded-lg overflow-hidden">
            <OrderBook stockCode={stockCode} market={market} />
          </div>
        </div>
      </div>
    </div>
  );
}
