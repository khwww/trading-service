import { NextResponse } from 'next/server';
import { KISFetchClient } from '@/app/api/_kis/KISFetchClient';

// 시장 지수/환율 조회 API
type MarketItem = {
  code: string;
  name: string;
  marketCode: 'N' | 'X'; // N: 해외지수, X: 환율
};

// 조회할 시장 지수/환율 목록
const MARKET_ITEMS: MarketItem[] = [
  { code: 'FX@KRW', name: '달러 환율', marketCode: 'X' },
  { code: 'COMP', name: '나스닥', marketCode: 'N' },
  { code: 'SPX', name: 'S&P 500', marketCode: 'N' },
  { code: '.DJI', name: '다우존스', marketCode: 'N' },
];

type KISMarketResponse = {
  rt_cd: string;
  msg_cd: string;
  msg1: string;
  output1: {
    ovrs_nmix_prpr: string; // 현재가
    ovrs_nmix_prdy_vrss: string; // 전일 대비
    prdy_ctrt: string; // 전일 대비율
    prdy_vrss_sign: string; // 전일 대비 부호
    hts_kor_isnm: string; // 한글 종목명
    stck_shrn_iscd: string; // 단축 종목코드
  };
};

function getDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export async function GET() {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7); 

    const results = await Promise.all(
      MARKET_ITEMS.map(async (item) => {
        try {
          const query = {
            FID_COND_MRKT_DIV_CODE: item.marketCode,
            FID_INPUT_ISCD: item.code,
            FID_INPUT_DATE_1: getDateString(startDate),
            FID_INPUT_DATE_2: getDateString(today),
            FID_PERIOD_DIV_CODE: 'D',
          };

          const data = await KISFetchClient<KISMarketResponse>({
            path: '/uapi/overseas-price/v1/quotations/inquire-daily-chartprice',
            trId: 'FHKST03030100',
            method: 'GET',
            query,
          });

          if (data.rt_cd !== '0' || !data.output1) {
            return null;
          }

          const output = data.output1;
          const sign = output.prdy_vrss_sign;
          const isPositive = sign === '1' || sign === '2';

          return {
            code: item.code,
            name: output.hts_kor_isnm || item.name,
            value: parseFloat(output.ovrs_nmix_prpr) || 0,
            change: parseFloat(output.ovrs_nmix_prdy_vrss) || 0,
            changePercent: parseFloat(output.prdy_ctrt) || 0,
            isPositive,
          };
        } catch (error) {
          console.error(`Failed to fetch ${item.code}:`, error);
          return null;
        }
      })
    );

    // null 필터링
    const validResults = results.filter((r) => r !== null);

    return NextResponse.json({ data: validResults });
  } catch (error) {
    console.error('KIS market overview route error:', error);
    return NextResponse.json(
      { message: 'KIS market overview route error', detail: String(error) },
      { status: 500 }
    );
  }
}
