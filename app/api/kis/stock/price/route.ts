import { NextRequest, NextResponse } from 'next/server';
import { KISFetchClient } from '@/app/api/_kis/KISFetchClient';

// 주식현재가 시세 조회
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

    const query = {
      FID_COND_MRKT_DIV_CODE: 'J',
      FID_INPUT_ISCD: code,
    };

    const data = await KISFetchClient({
      path: '/uapi/domestic-stock/v1/quotations/inquire-price',
      trId: 'FHKST01010100',
      method: 'GET',
      query,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('KIS stock price route error:', error);
    return NextResponse.json(
      { message: 'KIS stock price route error', detail: String(error) },
      { status: 500 }
    );
  }
}
