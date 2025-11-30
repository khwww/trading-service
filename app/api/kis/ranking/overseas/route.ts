import { NextRequest, NextResponse } from 'next/server';
import { getServerAccessToken } from '@/services/kisServerAuth';

const BASE_URL = 'https://openapi.koreainvestment.com:9443';

type Metric = 'amount' | 'volume' | 'rise' | 'fall';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const metric = (searchParams.get('metric') ?? 'amount') as Metric;

    const appKey = process.env.KIS_APP_KEY;
    const appSecret = process.env.KIS_APP_SECRET;
    const accessToken = await getServerAccessToken();

    if (!appKey || !appSecret) {
      return NextResponse.json(
        { message: 'KIS env not configured' },
        { status: 500 }
      );
    }

    let path = '';
    let trId = '';

    const params = new URLSearchParams({
      KEYB: '', // NEXT KEY BUFF
      AUTH: '', // 사용자권한정보
      EXCD: 'NAS', // 거래소코드 (예: NAS: 나스닥)
      NDAY: '0', // N일자값 - 0: 당일
      VOL_RANG: '0', // 거래량조건 - 0: 전체
    });

    switch (metric) {
      case 'volume': {
        path = '/uapi/overseas-stock/v1/ranking/trade-vol';
        trId = 'HHDFS76310010';
        params.set('PRC1', '');
        params.set('PRC2', '');
        break;
      }
      case 'amount': {
        path = '/uapi/overseas-stock/v1/ranking/trade-pbmn';
        trId = 'HHDFS76320010';
        params.set('PRC1', '');
        params.set('PRC2', '');
        break;
      }
      case 'rise': {
        path = '/uapi/overseas-stock/v1/ranking/trade-growth';
        trId = 'HHDFS76330000';
        break;
      }
      case 'fall': {
        path = '/uapi/overseas-stock/v1/ranking/trade-turnover';
        trId = 'HHDFS76340000';
        break;
      }

      default:
        return NextResponse.json(
          { message: `Unsupported metric: ${metric}` },
          { status: 400 }
        );
    }

    const url = `${BASE_URL}${path}?${params.toString()}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: `Bearer ${accessToken}`,
        appkey: appKey,
        appsecret: appSecret,
        tr_id: trId,
        custtype: 'P',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(
        'KIS overseas RAW error:',
        res.status,
        res.statusText,
        text
      );
      return NextResponse.json(
        {
          message: 'KIS overseas ranking request failed',
          kisStatus: res.status,
          kisStatusText: res.statusText,
          kisBody: text,
        },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('KIS overseas ranking route error:', error);
    return NextResponse.json(
      { message: 'Unexpected error', detail: String(error) },
      { status: 500 }
    );
  }
}
