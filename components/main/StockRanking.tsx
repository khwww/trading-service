'use client';

import { useState } from 'react';
import StockFilter from '@/components/common/StockFilter';
import StockTable from '@/components/common/StockTable';

const STOCK_DATA = [
  {
    id: 1,
    name: '아이바이오',
    icon: '🔵',
    price: '2,588원',
    change: '+30.21%',
    volume: '21억원',
    isPositive: true,
    buyRatio: 40,
    sellRatio: 60,
  },
  {
    id: 2,
    name: 'RGTZ',
    icon: '🔷',
    price: '20,736원',
    change: '-22.41%',
    volume: '19억원',
    isPositive: false,
    buyRatio: 43,
    sellRatio: 57,
  },
  {
    id: 3,
    name: '사이언지 홀딩스',
    icon: '🟦',
    price: '1,241원',
    change: '+51.84%',
    volume: '16억원',
    isPositive: true,
    buyRatio: 56,
    sellRatio: 44,
  },
  {
    id: 4,
    name: '벨릭스 바이오사이...',
    icon: '⚪',
    price: '11,083원',
    change: '+100.77%',
    volume: '13억원',
    isPositive: true,
    buyRatio: 42,
    sellRatio: 58,
  },
  {
    id: 5,
    name: '커넥스 스포츠 테크...',
    icon: '🟡',
    price: '143원',
    change: '-47.06%',
    volume: '12억원',
    isPositive: false,
    buyRatio: 22,
    sellRatio: 78,
  },
  {
    id: 6,
    name: '위메디 디지털',
    icon: '🔴',
    price: '106원',
    change: '+9.55%',
    volume: '11억원',
    isPositive: true,
    buyRatio: 40,
    sellRatio: 60,
  },
  {
    id: 7,
    name: '비온드 미트',
    icon: '🟢',
    price: '3,947원',
    change: '-22.90%',
    volume: '10억원',
    isPositive: false,
    buyRatio: 51,
    sellRatio: 49,
  },
  {
    id: 8,
    name: 'RGTX',
    icon: '🔵',
    price: '312,476원',
    change: '+21.82%',
    volume: '7.2억원',
    isPositive: true,
    buyRatio: 31,
    sellRatio: 69,
  },
  {
    id: 9,
    name: '더 웨이브 컬렉',
    icon: '⚪',
    price: '46,392원',
    change: '+18.87%',
    volume: '6.8억원',
    isPositive: true,
    buyRatio: 10,
    sellRatio: 90,
  },
];

export default function StockRanking() {
  const [region, setRegion] = useState<string>('전체');
  const [metric, setMetric] = useState<string>('스탁두두거래대금');
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const filteredStocks = STOCK_DATA;

  return (
    <div>
      <StockFilter
        region={region}
        metric={metric}
        onRegionChange={setRegion}
        onMetricChange={setMetric}
      />
      <StockTable
        stocks={filteredStocks}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          보유 종목이 없어요
        </button>
      </div>
    </div>
  );
}
