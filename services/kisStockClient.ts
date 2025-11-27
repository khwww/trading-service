// 주식 현재가 시세 타입
export type StockPrice = {
  code: string;           // 종목코드
  name: string;           // 종목명
  price: number;          // 현재가
  change: number;         // 전일 대비
  changeRate: number;     // 등락률 (%)
  changeSign: string;     // 등락 부호 (1:상한, 2:상승, 3:보합, 4:하한, 5:하락)
  volume: number;         // 누적 거래량
  amount: number;         // 누적 거래대금
  open: number;           // 시가
  high: number;           // 고가
  low: number;            // 저가
  prevClose: number;      // 전일 종가
};

type ApiResponse = {
  output: {
    stck_prpr: string;      // 현재가
    prdy_vrss: string;      // 전일 대비
    prdy_ctrt: string;      // 등락률
    prdy_vrss_sign: string; // 등락 부호
    acml_vol: string;       // 누적 거래량
    acml_tr_pbmn: string;   // 누적 거래대금
    stck_oprc: string;      // 시가
    stck_hgpr: string;      // 고가
    stck_lwpr: string;      // 저가
    stck_sdpr: string;      // 전일 종가
    hts_kor_isnm: string;   // 종목명
  };
  rt_cd: string;
  msg_cd: string;
  msg1: string;
};

export async function fetchStockPrice(code: string): Promise<StockPrice> {
  const res = await fetch(`/api/kis/stock/price?code=${code}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIS stock price error: ${text}`);
  }

  const data = (await res.json()) as ApiResponse;

  // API 응답 확인용 로그
  console.log('KIS API 응답:', data);
  console.log('KIS API output:', data.output);

  if (data.rt_cd !== '0') {
    throw new Error(`KIS API error: ${data.msg1}`);
  }

  const output = data.output;

  return {
    code,
    name: output.hts_kor_isnm,
    price: Number(output.stck_prpr),
    change: Number(output.prdy_vrss),
    changeRate: Number(output.prdy_ctrt),
    changeSign: output.prdy_vrss_sign,
    volume: Number(output.acml_vol),
    amount: Number(output.acml_tr_pbmn),
    open: Number(output.stck_oprc),
    high: Number(output.stck_hgpr),
    low: Number(output.stck_lwpr),
    prevClose: Number(output.stck_sdpr),
  };
}
