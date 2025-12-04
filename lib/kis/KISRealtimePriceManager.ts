'use client';

import { KISWebsocketClient } from './KISWebsocketClient';

export type MarketType = 'DOMESTIC' | 'OVERSEAS';

export type NormalizedTick = {
  symbol: string;
  market: MarketType;
  price: number;
  change: number;
  changeRate: number;
  volume: number;       // 체결량
  timestamp: string;
};

export type TickParser = (raw: string) => NormalizedTick | null;

// KIS 프로토콜에 맞는 subscribe / unsubscribe 메시지 만들어주는 빌더
export type SubscribeMessageBuilder = (
  symbol: string,
  market: MarketType
) => string;
export type UnsubscribeMessageBuilder = (
  symbol: string,
  market: MarketType
) => string;

// 컴포넌트/훅에서 등록하게 되는 콜백 -> 이 종목의 tick이 들어오면 함수 불러줘하는 구독자
export type TickListener = (tick: NormalizedTick) => void;

type SubscriptionEntry = {
  refCount: number;
  listeners: Set<TickListener>;
};

function makeKey(symbol: string, market: MarketType) {
  return `${market}:${symbol}`;
}

export class KISRealtimePriceManager {
  private subscriptions = new Map<string, SubscriptionEntry>();

  constructor(
    private readonly client: KISWebsocketClient,
    private readonly parseTick: TickParser,
    private readonly buildSubscribeMessage: SubscribeMessageBuilder,
    private readonly buildUnsubscribeMessage: UnsubscribeMessageBuilder
  ) {
    // 웹소켓에서 raw 메시지가 올 때마다 이 핸들러가 호출됨
    this.client.addMessageListener(this.handleMessage);
  }

  /** 웹소켓 해제 시 리스너 정리 */
  dispose() {
    this.client.removeMessageListener(this.handleMessage);
    this.subscriptions.clear();
  }

  /** 특정 종목 실시간 구독 시작 */
  subscribeSymbol(symbol: string, market: MarketType, listener: TickListener) {
    const key = makeKey(symbol, market);
    let entry = this.subscriptions.get(key);

    if (!entry) {
      // 처음 구독되는 종목이면 엔트리 생성 + 서버에 subscribe 메시지 전송
      entry = {
        refCount: 0,
        listeners: new Set<TickListener>(),
      };
      this.subscriptions.set(key, entry);

      const msg = this.buildSubscribeMessage(symbol, market);
      this.client.send(msg);
    }

    entry.refCount += 1;
    entry.listeners.add(listener);
  }

  /** 특정 종목 실시간 구독 해제 */
  unsubscribeSymbol(
    symbol: string,
    market: MarketType,
    listener: TickListener
  ) {
    const key = makeKey(symbol, market);
    const entry = this.subscriptions.get(key);

    if (!entry) return;

    // 리스너 제거
    entry.listeners.delete(listener);
    entry.refCount -= 1;

    if (entry.refCount <= 0) {
      // 더 이상 아무도 이 종목을 구독하지 않으면 서버에 unsubscribe 전송
      const msg = this.buildUnsubscribeMessage(symbol, market);
      this.client.send(msg);
      this.subscriptions.delete(key);
    }
  }

  /** 웹소켓에서 들어온 raw 메시지를 처리해서 각 종목 리스너에게 전달 */
  private handleMessage = (raw: string) => {
    const tick = this.parseTick(raw);
    if (!tick) return;

    const key = makeKey(tick.symbol, tick.market);
    console.log('[MANAGER] tick', tick);
    const entry = this.subscriptions.get(key);

    if (!entry) return;

    entry.listeners.forEach((listener) => {
      listener(tick);
    });
  };
}
