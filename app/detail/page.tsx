'use client';

import StockHeader from '../components/StockHeader';
import StockChart from '../components/StockChart';
import OrderBook from '../components/OrderBook';
import TradingPanel from '../components/TradingPanel';

export default function StockDetailPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* 헤더 */}
      <StockHeader />

      {/* 탭 메뉴 */}
      <div className="bg-black border-b border-gray-800">
        <div className="flex items-center gap-6 px-4">
          <button className="py-3 border-b-2 border-white text-white font-medium">
            차트 · 호가
          </button>
          <button className="py-3 text-gray-400 hover:text-white">
            종목정보
          </button>
          <button className="py-3 text-gray-400 hover:text-white">
            뉴스 · 공시
          </button>
          <button className="py-3 text-gray-400 hover:text-white">
            거래현황
          </button>
          <button className="py-3 text-gray-400 hover:text-white">
            커뮤니티
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* 차트 영역 */}
        <div className="lg:col-span-6 border-r border-gray-800">
          <StockChart />
        </div>

        {/* 호가창 영역 */}
        <div className="lg:col-span-3 border-r border-gray-800">
          <OrderBook />
        </div>

        {/* 주문하기 패널 */}
        <div className="lg:col-span-3">
          <TradingPanel />
        </div>
      </div>
    </div>
  );
}
