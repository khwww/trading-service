'use client';

import { useState, useEffect } from 'react';
import { useStockDaily } from '@/hooks/useStockDaily';
import { useOverseasStockDaily } from '@/hooks/useOverseasStockDaily';
import { useRealtimePrice } from '@/hooks/useRealtimePrice';

type MarketType = 'DOMESTIC' | 'OVERSEAS';

type OrderBookProps = {
  stockCode: string;
  market: MarketType;
};

type Trade = {
  id: number;
  price: number;
  volume: number;
  changeRate: number;
  time: string;
};

// 날짜 포맷 (YYYYMMDD -> MM.DD)
function formatDate(dateStr: string) {
  if (dateStr.length !== 8) return dateStr;
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${month}.${day}`;
}

// 오늘 날짜 문자열 (YYYYMMDD)
function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 거래량 포맷 (만 단위)
function formatVolume(volume: number) {
  if (volume >= 10000) {
    const man = Math.floor(volume / 10000);
    return `${man.toLocaleString()}만`;
  }
  return volume.toLocaleString();
}

// 현재 시간 포맷 (HH:MM:SS)
function formatTime(date: Date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function OrderBook({ stockCode, market }: OrderBookProps) {
  const isDomestic = market === 'DOMESTIC';
  const [activeTab, setActiveTab] = useState<'realtime' | 'daily'>('daily');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [tradeId, setTradeId] = useState(0);

  // 일별 시세 (일별 탭용)
  const domesticDaily = useStockDaily(isDomestic ? stockCode : '');
  const overseasDaily = useOverseasStockDaily(isDomestic ? '' : stockCode);
  const { data: dailyData, isLoading: dailyLoading, error: dailyError } = isDomestic
    ? domesticDaily
    : overseasDaily;

  // 실시간 체결가 (국내 주식, 실시간 탭용)
  const { ticksByKey } = useRealtimePrice(
    isDomestic ? [{ symbol: stockCode, market: 'DOMESTIC' }] : []
  );
  const realtimeTick = isDomestic ? ticksByKey[`DOMESTIC:${stockCode}`] : null;

  // 실시간 틱이 들어올 때마다 체결 내역에 추가
  useEffect(() => {
    if (!realtimeTick) return;

    const newTrade: Trade = {
      id: tradeId,
      price: realtimeTick.price,
      volume: realtimeTick.volume,
      changeRate: realtimeTick.changeRate,
      time: formatTime(new Date()),
    };

    setTrades((prev) => [newTrade, ...prev.slice(0, 49)]); // 최근 50개 유지
    setTradeId((prev) => prev + 1);
  }, [realtimeTick?.price, realtimeTick?.changeRate]);

  // 로딩/에러 상태 (일별 탭일 때만)
  if (activeTab === 'daily' && dailyLoading) {
    return (
      <div className="text-white p-4 rounded-lg" style={{ background: 'var(--detail-section)' }}>
        <h2 className="text-lg font-semibold mb-4 leading-7">시세</h2>
        <div className="animate-pulse space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'daily' && (dailyError || !dailyData)) {
    return (
      <div className="text-white p-4 rounded-lg" style={{ background: 'var(--detail-section)' }}>
        <h2 className="text-lg font-semibold mb-4 leading-7">시세</h2>
        <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className="text-white p-4 rounded-lg" style={{ background: 'var(--detail-section)' }}>
      <h2 className="text-lg font-semibold mb-4 leading-7">시세</h2>

      {/* 탭 UI */}
      <div className="flex mb-2 border-b border-gray-700">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'daily'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('daily')}
        >
          일별
        </button>
        {isDomestic && (
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'realtime'
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('realtime')}
          >
            실시간
          </button>
        )}
      </div>

      {activeTab === 'realtime' ? (
        /* 실시간 체결 내역 */
        <div className="text-sm">
          {/* 헤더 (스크롤 영역 밖) */}
          <div className="flex text-gray-400 border-b border-gray-800 py-2">
            <div className="flex-1 text-left">체결가</div>
            <div className="flex-1 text-right">체결량</div>
            <div className="flex-1 text-right">등락률</div>
            <div className="flex-1 text-right pr-2">시간</div>
          </div>
          {/* 바디 (스크롤 영역) */}
          <div
            className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600"
            style={{ height: '356px' }}
          >
            {trades.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                장 시간에 실시간 체결 내역이 표시됩니다.
              </div>
            ) : (
              trades.map((trade) => {
                const isUp = trade.changeRate > 0;
                const isDown = trade.changeRate < 0;

                return (
                  <div key={trade.id} className="flex border-b border-gray-900 hover:bg-gray-900 py-2">
                    <div className={`flex-1 ${isUp ? 'text-red-500' : isDown ? 'text-blue-500' : 'text-white'}`}>
                      {trade.price.toLocaleString()}원
                    </div>
                    <div className="flex-1 text-right text-gray-300">
                      {trade.volume.toLocaleString()}
                    </div>
                    <div className={`flex-1 text-right ${isUp ? 'text-red-500' : isDown ? 'text-blue-500' : 'text-gray-400'}`}>
                      {isUp ? '+' : ''}{trade.changeRate.toFixed(2)}%
                    </div>
                    <div className="flex-1 text-right text-gray-400 pr-2">
                      {trade.time}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* 일별 시세 */
        <div className="text-sm">
          {/* 헤더 (스크롤 영역 밖) */}
          <div className="flex text-gray-400 border-b border-gray-800 py-2">
            <div className="flex-1 text-left">날짜</div>
            <div className="flex-1 text-right">종가</div>
            <div className="flex-1 text-right">등락률</div>
            <div className="flex-1 text-right pr-2">거래량</div>
          </div>
          {/* 바디 (스크롤 영역) */}
          <div
            className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600"
            style={{ height: '356px' }}
          >
            {dailyData?.map((item, index) => {
              const todayStr = getTodayString();
              const isToday = item.date === todayStr;

              // 오늘 날짜이고 국내주식이면 실시간 데이터 사용
              const displayClose = isToday && isDomestic && realtimeTick
                ? realtimeTick.price
                : item.close;
              const displayChangeRate = isToday && isDomestic && realtimeTick
                ? realtimeTick.changeRate
                : item.changeRate;
              const displayVolume = isToday && isDomestic && realtimeTick
                ? realtimeTick.accumulatedVolume
                : item.volume;

              // 실시간 데이터가 있으면 실시간 기준으로 등락 판단
              const isUp = isToday && isDomestic && realtimeTick
                ? displayChangeRate > 0
                : item.changeSign === '1' || item.changeSign === '2';
              const isDown = isToday && isDomestic && realtimeTick
                ? displayChangeRate < 0
                : item.changeSign === '4' || item.changeSign === '5';

              const formatPrice = (price: number) => {
                if (isDomestic) {
                  return `${price.toLocaleString()}원`;
                }
                return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              };

              return (
                <div key={item.date} className="flex border-b border-gray-900 hover:bg-gray-900 py-2">
                  <div className="flex-1 text-gray-400">
                    {formatDate(item.date)}
                  </div>
                  <div className="flex-1 text-right">{formatPrice(displayClose)}</div>
                  <div className={`flex-1 text-right ${isUp ? 'text-red-500' : isDown ? 'text-blue-500' : 'text-gray-400'}`}>
                    {isUp ? '+' : ''}{displayChangeRate.toFixed(2)}%
                  </div>
                  <div className="flex-1 text-right text-gray-400 pr-2">
                    {formatVolume(displayVolume)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        /* 커스텀 스크롤바 스타일 */
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
}
