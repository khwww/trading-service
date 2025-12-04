'use client';

import { cn } from '@/lib/utils';
import {
  DomesticRankingItem,
  OverseasRankingItem,
} from '@/services/kisRankingClient';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

import ChangeRateCell from './ChangeRateCell';

type StockRankingItem = DomesticRankingItem | OverseasRankingItem;

type StockTableProps = {
  stocks: StockRankingItem[];
  favorites: number[];
  lastUpdated?: string;
  metricType: string;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
};

export default function StockTable({
  stocks,
  favorites,
  lastUpdated,
  metricType,
  onToggleFavorite,
}: StockTableProps) {
  const router = useRouter();
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card text-card-foreground shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-sm text-muted-foreground">
              <th className="p-3 font-medium">
                순위·오늘 {lastUpdated ?? '--:--'} 기준
              </th>
              <th className="p-3 font-medium">현재가</th>
              <th className="p-3 font-medium">등락률</th>
              <th className="p-3 font-medium">
                {metricType === '거래대금' ? '거래대금 순' : '거래량 순'}
              </th>
              <th className="p-3 font-medium text-right">최근 2일 거래 비율</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => {
              const todayVol = stock.volume;
              const prevVol = stock.prevVolume;
              const totalVol = todayVol + prevVol;

              let todayRatio = 0;
              let prevRatio = 0;

              if (totalVol > 0) {
                todayRatio = (todayVol / totalVol) * 100;
                prevRatio = 100 - todayRatio;
              }
              return (
                <tr
                  key={stock.code}
                  className="group border-b border-border/50 transition-all duration-200 hover:bg-muted cursor-pointer"
                  onClick={() => router.push('/stocks/005930')}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition-all"
                        onClick={(e) => onToggleFavorite(Number(stock.code), e)}
                      >
                        <Heart
                          className={cn(
                            'h-4 w-4 transition-all',
                            favorites.includes(Number(stock.code))
                              ? 'scale-110 fill-red-500 text-red-500'
                              : 'text-slate-500 group-hover:text-slate-300'
                          )}
                        />
                      </button>
                      <span className="w-4 text-sm font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                      {/* <span className="text-sm">{stock.icon}</span> */}
                      <span className="text-sm">{stock.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm tabular-nums">
                      {stock.price.toLocaleString()}원
                    </span>
                  </td>
                  <td className="p-3">
                    <ChangeRateCell value={stock.changeRate} />
                  </td>
                  <td className="p-3">
                    <span className="text-sm tabular-nums">
                      {metricType === '거래대금'
                        ? `${stock.amount.toLocaleString()}원`
                        : `${stock.volume.toLocaleString()}주`}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex h-2 w-24 overflow-hidden rounded-full bg-secondary/60">
                        <div
                          className="bg-blue-500/80 transition-all duration-300"
                          style={{ width: `${prevRatio}%` }}
                        />
                        <div
                          className="bg-red-500/80 transition-all duration-300"
                          style={{ width: `${todayRatio}%` }}
                        />
                      </div>
                      {totalVol > 0 ? (
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground tabular-nums">
                          <span className="text-blue-500">
                            어제 {prevRatio.toFixed(0)}%
                          </span>
                          <span className="text-red-500">
                            오늘 {todayRatio.toFixed(0)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          -
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
