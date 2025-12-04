import { NextRequest, NextResponse } from 'next/server';
import { KISFetchClient } from '@/app/api/_kis/KISFetchClient';

// 해외주식 기간별 시세 (일별) 조회
// KIS API: /uapi/overseas-price/v1/quotations/dailyprice
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code'); // 종목코드 (예: AAPL, TSLA)
    const excd = searchParams.get('excd') ?? 'NAS'; // 거래소코드

    if (!code) {
      return NextResponse.json(
        { message: 'code parameter is required' },
        { status: 400 }
      );
    }

    const query = {
      AUTH: '',
      EXCD: excd,
      SYMB: code,
      GUBN: '0', // 0: 일, 1: 주, 2: 월
      BYMD: '', // 조회 기준 일자 (빈값: 최근)
      MODP: '1', // 수정주가 반영 (0: 미반영, 1: 반영)
      KEYB: '',
    };

    const data = await KISFetchClient({
      path: '/uapi/overseas-price/v1/quotations/dailyprice',
      trId: 'HHDFS76240000',
      method: 'GET',
      query,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('KIS overseas stock daily route error:', error);
    return NextResponse.json(
      { message: 'KIS overseas stock daily route error', detail: String(error) },
      { status: 500 }
    );
  }
}
