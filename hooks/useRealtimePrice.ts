'use client';

import { useEffect, useState } from 'react';
import {
  kisWebsocketClient,
  kisRealtimePriceManager,
} from '@/lib/kis/KISRealtimePriceSetup';
import type {
  MarketType,
  NormalizedTick,
} from '@/lib/kis/KISRealtimePriceManager';
import { isDomesticMarketOpen } from '@/lib/kis/isDomesticMarketOpen';

type SymbolInput = {
  symbol: string;
  market: MarketType;
};

type TicksByKey = Record<string, NormalizedTick>;

function makeKey(symbol: string, market: MarketType) {
  return `${market}:${symbol}`;
}

/**
 * 주어진 심볼 리스트에 대해
 * - KIS WebSocket 연결
 * - 종목별 subscribe / unsubscribe 관리
 * - DOMESTIC 종목을 포함하는 경우, KRX 정규장(09:00 ~ 15:30) 시간에만 실시간 구독을 활성화
 *   - 장이 닫힌 경우: WebSocket 연결을 종료하고, 외부에는 빈 ticksByKey를 노출
 *   - 장이 열린 경우: WebSocket connect 후 각 심볼에 대해 실시간 체결 틱을 수신
 */
export function useRealtimePrice(symbols: SymbolInput[]) {
  const [ticksByKey, setTicksByKey] = useState<TicksByKey>({});

  const hasDomestic = symbols.some(({ market }) => market === 'DOMESTIC');
  const shouldUseRealtime =
    symbols.length > 0 && (!hasDomestic || isDomesticMarketOpen());

  useEffect(() => {
    if (!shouldUseRealtime) return;

    const cleanups: (() => void)[] = [];
    let cancelled = false;

    (async () => {
      try {
        await kisWebsocketClient.connect();
        if (cancelled) return;

        symbols.forEach(({ symbol, market }) => {
          const listener = (tick: NormalizedTick) => {
            const key = makeKey(tick.symbol, tick.market);
            // console.log('[LISTENER]', key, tick);

            setTicksByKey((prev) => ({
              ...prev,
              [key]: tick,
            }));
          };

          kisRealtimePriceManager.subscribeSymbol(symbol, market, listener);

          cleanups.push(() => {
            kisRealtimePriceManager.unsubscribeSymbol(symbol, market, listener);
          });
        });
      } catch (error) {
        console.error('Failed to connect KIS WebSocket:', error);
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [symbols, shouldUseRealtime]);

  useEffect(() => {
    if (!hasDomestic) return;
    if (shouldUseRealtime) return;

    kisWebsocketClient.disconnect?.();
  }, [hasDomestic, shouldUseRealtime]);

  const exposedTicksByKey = shouldUseRealtime ? ticksByKey : {};

  return { ticksByKey: exposedTicksByKey };
}
