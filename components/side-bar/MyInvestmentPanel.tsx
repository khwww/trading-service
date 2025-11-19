'use client';

export default function MyInvestmentPanel() {
  return (
    <div className="h-full bg-zinc-900 text-white overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* 헤더 */}
      <div className="p-3 border-b border-gray-800">
        <h2 className="text-base font-bold">내 계좌</h2>
      </div>

      {/* 계좌 요약 */}
      <div className="p-3">
        <div className="mb-0.5">
          <span className="text-xs text-gray-400">원화</span>
        </div>
        <div className="text-xl font-bold mb-3">0원</div>
      </div>

      {/* 내 투자 섹션 */}
      <div className="border-t border-gray-800">
        <button className="w-full p-3 flex items-center justify-between hover:bg-zinc-800">
          <span className="text-xs">내 투자</span>
        </button>
      </div>

      {/* 보유 종목 없음 */}
      <div className="p-6 text-center">
        <div className="w-12 h-12 bg-zinc-800 rounded-lg mx-auto mb-3 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-600">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
        </div>
        <p className="text-xs text-gray-400">보유 종목이 없어요</p>
      </div>

      {/* 주문내역 섹션 */}
      <div className="border-t border-gray-800">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold">주문내역</h3>
          </div>

          <div className="flex gap-1.5 mb-3">
            <button className="px-2 py-0.5 text-xs bg-zinc-800 rounded">대기</button>
            <button className="px-2 py-0.5 text-xs text-gray-400">완료</button>
            <button className="px-2 py-0.5 text-xs text-gray-400">조건주문</button>
          </div>

          <div className="text-center py-6">
            <p className="text-xs text-gray-500">대기중인 주문이 없어요</p>
          </div>
        </div>
      </div>
    </div>
  );
}
