import { stockInfo } from '../data/mockData';

export default function StockHeader() {
  const { name, code, currentPrice, change, changeRate, changeType, previousClose, marketCap } = stockInfo;

  return (
    <div className="bg-black text-white p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">S</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{name}</h1>
            <span className="text-sm text-gray-400">{code}</span>
            <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">
              {marketCap}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-4">
        <div className="text-4xl font-bold">
          {currentPrice.toLocaleString()}원
        </div>
        <div className={`flex items-center gap-2 pb-1 ${changeType === 'up' ? 'text-red-500' : 'text-blue-500'}`}>
          <span className="text-sm">지난 장 대비</span>
          <span className="text-lg font-semibold">
            {changeType === 'up' ? '+' : '-'}{change.toLocaleString()}원
          </span>
          <span className="text-lg font-semibold">
            ({changeType === 'up' ? '+' : '-'}{changeRate}%)
          </span>
        </div>
      </div>
    </div>
  );
}
