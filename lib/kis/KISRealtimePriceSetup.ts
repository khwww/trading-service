'use client';

import { KISWebsocketClient } from './KISWebsocketClient';
import {
  KISRealtimePriceManager,
  MarketType,
  NormalizedTick,
} from './KISRealtimePriceManager';

const KIS_REALTIME_WS_URL = process.env.NEXT_PUBLIC_KIS_WS_URL ?? '';

export const kisWebsocketClient = new KISWebsocketClient(KIS_REALTIME_WS_URL);

// raw 문자열 → NormalizedTick 으로 파싱 (국내 실시간 체결가 통합)
function toNumberOrZero(v: string | number | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === 'number') return Number.isNaN(v) ? 0 : v;
  const n = Number(String(v).trim());
  return Number.isNaN(n) ? 0 : n;
}

export function parseTick(raw: string): NormalizedTick | null {
  const text = raw.trim();
  const pipeMatch = text.match(/^([01])\|(H0STCNT0)\|(\d{3})\|(.*)$/);
  if (pipeMatch) {
    const [, encryptFlag, trId, countStr, dataPart] = pipeMatch;

    if (encryptFlag === '1') {
      console.warn('[KIS] 암호화된 틱은 아직 파싱 미지원:', text);
      return null;
    }

    const count = Number(countStr);
    if (!Number.isFinite(count) || count <= 0) return null;

    const fields = dataPart.split('^');
    // console.log('[FIELDS]', fields);

    const blockLen = Math.floor(fields.length / count);
    if (!blockLen || blockLen < 6) {
      console.warn('[KIS] 예상치 못한 필드 길이', {
        count,
        len: fields.length,
      });
      return null;
    }

    const ticks: NormalizedTick[] = [];

    for (let idx = 0; idx < count; idx++) {
      const offset = idx * blockLen;

      const symbol = fields[offset + 0]; // 단축코드
      const timeStr = fields[offset + 1]; // 체결시간
      const priceStr = fields[offset + 2]; // 현재가
      // const signStr  = fields[offset + 3]; // 부호
      const diffStr = fields[offset + 4]; // 전일 대비 (원)
      const rateStr = fields[offset + 5]; // 전일 대비율 (%)
      const volumeStr = fields[offset + 12]; // 체결량

      if (!symbol) continue;

      const tick: NormalizedTick = {
        symbol,
        market: 'DOMESTIC',
        price: toNumberOrZero(priceStr),
        change: toNumberOrZero(diffStr),
        changeRate: toNumberOrZero(rateStr),
        volume: toNumberOrZero(volumeStr),
        timestamp: timeStr,
      };
      console.log('[PARSED TICK]', tick);
      ticks.push(tick);
    }

    if (!ticks.length) return null;

    const latest = ticks[ticks.length - 1];
    //console.log('[PARSED TICK]', latest);
    return latest;
  }

  // JSON 컨트롤 메시지 처리
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }

  if (typeof parsed !== 'object' || parsed === null) return null;

  const obj = parsed as {
    header?: { tr_id?: string; tr_key?: string };
    body?: { msg1?: string };
  };

  if (
    obj.header?.tr_id === 'PINGPONG' ||
    obj.body?.msg1 === 'SUBSCRIBE SUCCESS' ||
    obj.body?.msg1 === 'UNSUBSCRIBE SUCCESS'
  ) {
    return null;
  }

  console.log('[WS UNKNOWN JSON]', parsed);
  return null;
}

// subscribe / unsubscribe 메시지 빌더 (KIS 프로토콜 맞춰서 나중에 구현)
function buildSubscribeMessage(symbol: string, market: MarketType): string {
  if (market !== 'DOMESTIC') {
    console.warn('[KIS] 해외 실시간 구독은 아직 미구현', symbol, market);
    return '';
  }

  const approvalKey = kisWebsocketClient.getApprovalKey();
  if (!approvalKey) {
    console.warn('[KIS] approval_key 없음. 구독 건너뜀:', symbol);
    return '';
  }

  // H0STCNT0 = 국내주식 실시간 체결가 TR
  const message = {
    header: {
      approval_key: approvalKey,
      custtype: 'P',
      tr_type: '1',
      'content-type': 'utf-8',
    },
    body: {
      input: {
        tr_id: 'H0STCNT0',
        tr_key: symbol,
      },
    },
  } as const;

  return JSON.stringify(message);
}

function buildUnsubscribeMessage(symbol: string, market: MarketType): string {
  if (market !== 'DOMESTIC') {
    console.warn('[KIS] 해외 실시간 해제는 아직 미구현', symbol, market);
    return '';
  }

  const approvalKey = kisWebsocketClient.getApprovalKey();
  if (!approvalKey) {
    console.warn('[KIS] approval_key 없음. 구독해제 건너뜀:', symbol);
    return '';
  }

  const message = {
    header: {
      approval_key: approvalKey,
      custtype: 'P',
      tr_type: '2', // 2: 해제
      'content-type': 'utf-8',
    },
    body: {
      input: {
        tr_id: 'H0STCNT0',
        tr_key: symbol,
      },
    },
  } as const;

  return JSON.stringify(message);
}

export const kisRealtimePriceManager = new KISRealtimePriceManager(
  kisWebsocketClient,
  parseTick,
  buildSubscribeMessage,
  buildUnsubscribeMessage
);
