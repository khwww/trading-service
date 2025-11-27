import { NextRequest, NextResponse } from 'next/server';
import { getServerAccessToken } from '@/services/kisServerAuth';

const BASE_URL = 'https://openapi.koreainvestment.com:9443';

// 국내 [거대래금],[거래량]
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const metric = searchParams.get('metric') ?? 'amount'; //  amount: 거래대금, volume: 거래량
    const blng = metric === 'amount' ? '3' : '0'; // 거래량(0), 거래금액(3)

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
      FID_COND_MRKT_DIV_CODE: 'J',
      FID_COND_SCR_DIV_CODE: '20171',
      FID_INPUT_ISCD: '0000',
      FID_DIV_CLS_CODE: '1', // 분류 구분 코드 - 전체(0), 보통(1), 우선(2)
      FID_BLNG_CLS_CODE: blng, // 소속 구분 코드 - 평균거래량(0), 거래금액순(3)
      FID_TRGT_CLS_CODE: '111111111',
      FID_TRGT_EXLS_CLS_CODE: '1111110001', // 투자위험/관리종목/정리매매/불성실공시/우선주/거래정지/ETF/ETN/신용주문불가/SPAC
      FID_INPUT_PRICE_1: '',
      FID_INPUT_PRICE_2: '',
      FID_VOL_CNT: '',
      FID_INPUT_DATE_1: '',
    });

    const url = `${BASE_URL}/uapi/domestic-stock/v1/quotations/volume-rank?${params.toString()}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: `Bearer ${accessToken}`,
        appkey: appKey,
        appsecret: appSecret,
        tr_id: 'FHPST01710000',
        custtype: 'P',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('KIS domestic volume-rank error:', text);
      return NextResponse.json(
        { message: 'KIS domestic volume-rank request failed', detail: text },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('KIS domestic ranking route error:', error);
    return NextResponse.json(
      { message: 'Unexpected error', detail: String(error) },
      { status: 500 }
    );
  }
}
