'use client';

const FAVORITE_STOCKS = [
  { name: '엔비디아', code: 'NVIDIA', price: '272,776원', change: '+7,047원', changeRate: '(2.65%)', isPositive: true, icon: '🟢' },
  { name: '알파벳 A', code: 'GOOGL', price: '437,552원', change: '+21,025원', changeRate: '(5.04%)', isPositive: true, icon: '🔵' },
  { name: 'CRCD', code: 'CRCD', price: '82,402원', change: '+12,615원', changeRate: '(18.07%)', isPositive: true, icon: '⚪' },
  { name: '지넥스', code: 'GENX', price: '893원', change: '+278원', changeRate: '(45.23%)', isPositive: true, icon: '🔵' },
];

export default function FavoritesPanel() {
  return (
    <div className="h-full bg-zinc-900 text-white overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* 헤더 */}
      <div className="p-3 border-b border-gray-800">
        <h2 className="text-base font-bold">관심</h2>
      </div>

      {/* 관심 종목 리스트 */}
      <div className="p-3">
        <div className="space-y-1.5">
          {FAVORITE_STOCKS.map((stock, index) => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
