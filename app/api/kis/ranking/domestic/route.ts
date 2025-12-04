import { KISFetchClient } from '@/app/api/_kis/KISFetchClient';
import { NextRequest, NextResponse } from 'next/server';

type Metric = 'amount' | 'volume' | 'rise' | 'fall';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const metric = (searchParams.get('metric') ?? 'amount') as Metric;

    // 1) 거래대금 / 거래량
    if (metric === 'amount' || metric === 'volume') {
      const blng = metric === 'amount' ? '3' : '0'; // 거래량(0), 거래금액(3)

      const query = {
        FID_COND_MRKT_DIV_CODE: 'J',
        FID_COND_SCR_DIV_CODE: '20171',
        FID_INPUT_ISCD: '0000',
        FID_DIV_CLS_CODE: '1', // 전체(0), 보통(1), 우선(2)
        FID_BLNG_CLS_CODE: blng, // 평균거래량(0), 거래금액순(3)
        FID_TRGT_CLS_CODE: '111111111',
        FID_TRGT_EXLS_CLS_CODE: '1111110001', // 투자위험/관리종목/정리매매/불성실공시/우선주/거래정지/ETF/ETN/신용주문불가/SPAC
        FID_INPUT_PRICE_1: '',
        FID_INPUT_PRICE_2: '',
        FID_VOL_CNT: '',
        FID_INPUT_DATE_1: '',
      };

      const data = await KISFetchClient({
        path: '/uapi/domestic-stock/v1/quotations/volume-rank',
        trId: 'FHPST01710000',
        method: 'GET',
        query,
      });

      return NextResponse.json(data);
    }

    // 2) 급상승 / 급하락
    const isRise = metric === 'rise';

    const query = {
      fid_rsfl_rate2: '',
      fid_cond_mrkt_div_code: 'J',
      fid_cond_scr_div_code: '20170',
      fid_input_iscd: '0000',
      fid_rank_sort_cls_code: isRise ? '0' : '1',
      fid_input_cnt_1: '0',
      fid_prc_cls_code: '1',
      fid_input_price_1: '',
      fid_input_price_2: '',
      fid_vol_cnt: '',
      fid_trgt_cls_code: '0',
      fid_trgt_exls_cls_code: '0',
      fid_div_cls_code: '0',
      fid_rsfl_rate1: '',
    };

    const data = await KISFetchClient({
      path: '/uapi/domestic-stock/v1/ranking/fluctuation',
      trId: 'FHPST01700000',
      method: 'GET',
      query,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('KIS domestic ranking route error:', error);
    return NextResponse.json(
      {
        message: 'KIS domestic ranking route error',
        detail: String(error),
      },
      { status: 500 }
    );
  }
}
