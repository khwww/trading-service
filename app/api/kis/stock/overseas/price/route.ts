import { NextRequest, NextResponse } from 'next/server';
import { KISFetchClient } from '@/app/api/_kis/KISFetchClient';

// 해외주식 현재가 조회
// KIS API: /uapi/overseas-price/v1/quotations/price
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code'); // 종목코드 (예: AAPL, TSLA)
    const excd = searchParams.get('excd') ?? 'NAS'; // 거래소코드 (NAS: 나스닥, NYS: 뉴욕, AMS: 아멕스)

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
    };

    const data = await KISFetchClient({
      path: '/uapi/overseas-price/v1/quotations/price',
      trId: 'HHDFS00000300',
      method: 'GET',
      query,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('KIS overseas stock price route error:', error);
    return NextResponse.json(
      { message: 'KIS overseas stock price route error', detail: String(error) },
      { status: 500 }
    );
  }
}
