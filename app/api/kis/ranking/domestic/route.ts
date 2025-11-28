import { NextRequest, NextResponse } from 'next/server';
import { getServerAccessToken } from '@/services/kisServerAuth';

const BASE_URL = 'https://openapi.koreainvestment.com:9443';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    type Metric = 'amount' | 'volume' | 'rise' | 'fall';
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

    let url: string;
    let trId: string;

    if (metric === 'amount' || metric === 'volume') {
      // 거래대금, 거래량
      const blng = metric === 'amount' ? '3' : '0'; // 거래량(0), 거래금액(3)

      const params = new URLSearchParams({
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
      });

      url = `${BASE_URL}/uapi/domestic-stock/v1/quotations/volume-rank?${params.toString()}`;
      trId = 'FHPST01710000';
    } else {
      // 급상승, 급하락
      const isRise = metric === 'rise';

      const params = new URLSearchParams({
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
      });

      url = `${BASE_URL}/uapi/domestic-stock/v1/ranking/fluctuation?${params.toString()}`;
      trId = 'FHPST01700000';
    }

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
      console.error('KIS domestic ranking error:', text);
      return NextResponse.json(
        { message: 'KIS domestic ranking request failed', detail: text },
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
