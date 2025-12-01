import { KISFetchClient } from '@/app/api/_kis/KISFetchClient';
import { NextRequest, NextResponse } from 'next/server';

type Metric = 'amount' | 'volume' | 'rise' | 'fall';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const metric = (searchParams.get('metric') ?? 'amount') as Metric;

    const baseQuery: Record<string, string> = {
      KEYB: '', // NEXT KEY BUFF
      AUTH: '', // 사용자권한정보
      EXCD: 'NAS', // 거래소코드 (예: NAS: 나스닥)
      NDAY: '0', // N일자값 - 0: 당일
      VOL_RANG: '0', // 거래량조건 - 0: 전체
    };

    let path = '';
    let trId = '';
    let query: Record<string, string> = { ...baseQuery };

    switch (metric) {
      case 'volume': {
        path = '/uapi/overseas-stock/v1/ranking/trade-vol';
        trId = 'HHDFS76310010';
        query = {
          ...baseQuery,
          PRC1: '',
          PRC2: '',
        };
        break;
      }
      case 'amount': {
        path = '/uapi/overseas-stock/v1/ranking/trade-pbmn';
        trId = 'HHDFS76320010';
        query = {
          ...baseQuery,
          PRC1: '',
          PRC2: '',
        };
        break;
      }
      case 'rise': {
        path = '/uapi/overseas-stock/v1/ranking/trade-growth';
        trId = 'HHDFS76330000';
        query = { ...baseQuery };
        break;
      }
      case 'fall': {
        path = '/uapi/overseas-stock/v1/ranking/trade-turnover';
        trId = 'HHDFS76340000';
        query = { ...baseQuery };
        break;
      }
      default: {
        return NextResponse.json(
          { message: `Unsupported metric: ${metric}` },
          { status: 400 }
        );
      }
    }

    const data = await KISFetchClient({
      path,
      trId,
      method: 'GET',
      query,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('KIS overseas ranking route error:', error);
    return NextResponse.json(
      {
        message: 'KIS overseas ranking route error',
        detail: String(error),
      },
      { status: 500 }
    );
  }
}
