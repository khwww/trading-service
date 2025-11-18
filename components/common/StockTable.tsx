'use client';

import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Stock = {
  id: number;
  name: string;
  icon: string;
  price: string;
  change: string;
  volume: string;
  isPositive: boolean;
  buyRatio: number;
  sellRatio: number;
};

type StockTableProps = {
  stocks: Stock[];
  favorites: number[];
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
};

export default function StockTable({
  stocks,
  favorites,
  onToggleFavorite,
}: StockTableProps) {
  const router = useRouter();
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card text-card-foreground shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">순위·오늘 22:06 기준</th>
              <th className="p-3 font-medium">현재가</th>
              <th className="p-3 font-medium">등락률</th>
              <th className="p-3 font-medium">거래대금 순</th>
              <th className="p-3 font-medium text-right">토스증권 거래 비율</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr
                key={stock.id}
                className="group border-b border-border/50 transition-all duration-200 hover:bg-muted cursor-pointer"
                onClick={() => router.push('/stocks/005930')}
              >
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition-all"
                      onClick={(e) => onToggleFavorite(stock.id, e)}
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4 transition-all',
                          favorites.includes(stock.id)
                            ? 'scale-110 fill-red-500 text-red-500'
                            : 'text-slate-500 group-hover:text-slate-300'
                        )}
                      />
                    </button>
                    <span className="w-4 font-mono text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="text-xs">{stock.icon}</span>
                    <span className="text-xs">{stock.name}</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="font-mono text-xs tabular-nums">
                    {stock.price}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium tabular-nums',
                      stock.isPositive
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
                    )}
                  >
                    {stock.change}
                  </span>
                </td>
                <td className="p-3">
                  <span className="text-xs text-muted-foreground">
                    {stock.volume}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-1 text-xs tabular-nums">
                      <span className="text-blue-500">{stock.buyRatio}</span>
                      <span className="text-red-500">{stock.sellRatio}</span>
                    </div>
                    <div className="flex h-2 w-24 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="bg-blue-500 transition-all duration-500"
                        style={{ width: `${stock.buyRatio}%` }}
                      />
                      <div
                        className="bg-red-500 transition-all duration-500"
                        style={{ width: `${stock.sellRatio}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
