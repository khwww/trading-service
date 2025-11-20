'use client';

import StockHeader from '@/components/detail/StockHeader';
import StockChart from '@/components/detail/StockChart';
import OrderBook from '@/components/detail/OrderBook';

export default function StockDetailPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* 전체 컨텐츠 영역 */}
      <div className="pl-6 detail-content-padding">
        {/* 헤더 */}
        <StockHeader />

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* 차트 영역 */}
          <div className="lg:col-span-8 border-r border-gray-800">
            <div className="bg-black text-white p-4">
              <h2 className="text-lg font-semibold">차트</h2>
              <StockChart />
            </div>
          </div>

          {/* 호가창 영역 */}
          <div className="lg:col-span-4">
            <OrderBook />
          </div>
        </div>
      </div>
    </div>
  );
}
