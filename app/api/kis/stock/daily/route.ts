import { NextRequest, NextResponse } from 'next/server';
import { getServerAccessToken } from '@/services/kisServerAuth';

const BASE_URL = 'https://openapi.koreainvestment.com:9443';

// 주식현재가 일자별 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { message: 'code parameter is required' },
        { status: 400 }
      );
    }

    const appKey = process.env.KIS_APP_KEY;
    const appSecret = process.env.KIS_APP_SECRET;
    const accessToken = await getServerAccessToken();

    if (!appKey || !appSecret) {
      return NextResponse.json(
        { message: 'KIS env not configured' },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      FID_COND_MRKT_DIV_CODE: 'J',      // 주식
      FID_INPUT_ISCD: code,              // 종목코드
      FID_PERIOD_DIV_CODE: 'D',          // 일봉
      FID_ORG_ADJ_PRC: '0',              // 수정주가 여부 (0: 수정주가)
    });

    const url = `${BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-daily-price?${params.toString()}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: `Bearer ${accessToken}`,
        appkey: appKey,
        appsecret: appSecret,
        tr_id: 'FHKST01010400',  // 주식현재가 일자별
        custtype: 'P',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('KIS stock daily error:', text);
      return NextResponse.json(
        { message: 'KIS stock daily request failed', detail: text },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('KIS stock daily route error:', error);
    return NextResponse.json(
      { message: 'Unexpected error', detail: String(error) },
      { status: 500 }
    );
  }
}
