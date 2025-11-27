'use client';

import { use } from 'react';
import StockHeader from '@/components/detail/StockHeader';
import StockChart from '@/components/detail/StockChart';
import OrderBook from '@/components/detail/OrderBook';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function StockDetailPage({ params }: PageProps) {
  const { id: stockCode } = use(params);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* 전체 컨텐츠 영역 */}
      <div className="px-6 detail-content-padding">
        {/* 헤더 */}
        <StockHeader stockCode={stockCode} />

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 차트 영역 */}
          <div className="lg:col-span-8 rounded-lg overflow-hidden">
            <StockChart stockCode={stockCode} />
          </div>

          {/* 호가창 영역 */}
          <div className="lg:col-span-4 rounded-lg overflow-hidden">
            <OrderBook stockCode={stockCode} />
          </div>
        </div>
      </div>
    </div>
  );
}
