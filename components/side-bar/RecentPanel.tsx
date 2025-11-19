'use client';

const RECENT_STOCKS = [
  { name: '아이랜', code: 'AIRN', price: '71,853원', change: '+278원', changeRate: '(0.38%)', isPositive: true, icon: '🟢' },
  { name: 'NAVER', code: 'NAVER', price: '256,500원', change: '+7,500원', changeRate: '(3.01%)', isPositive: true, icon: '🟢' },
  { name: '삼성전자', code: '005930', price: '97,700원', change: '-100원', changeRate: '(0.10%)', isPositive: false, icon: '🔵' },
  { name: 'UPSX', code: '2x', price: '11,208원', change: '-336원', changeRate: '(2.91%)', isPositive: false, icon: '🔵' },
];

export default function RecentPanel() {
  return (
    <div className="h-full bg-zinc-900 text-white overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* 헤더 */}
      <div className="p-3 border-b border-gray-800">
        <h2 className="text-base font-bold">최근 본</h2>
      </div>

      {/* 최근 본 종목 리스트 */}
      <div className="p-3">
        <div className="space-y-1.5">
          {RECENT_STOCKS.map((stock, index) => (
            <div key={index} className="flex items-center gap-2 py-2 border-b border-gray-800 last:border-0 hover:bg-zinc-800 cursor-pointer rounded px-2">
              <span className="text-xl">{stock.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{stock.name}</div>
                <div className="text-[10px] text-gray-400">{stock.code}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold">{stock.price}</div>
                <div className={`text-[10px] ${stock.isPositive ? 'text-red-500' : 'text-blue-500'}`}>
                  {stock.change} {stock.changeRate}
                </div>
              </div>
              <button className="text-gray-400 hover:text-red-500 text-xs shrink-0 ml-2">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
