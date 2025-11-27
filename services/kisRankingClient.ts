export type DomesticRankingMetric = 'volume' | 'amount';

export type DomesticRankingItem = {
  code: string; // 종목코드
  name: string; // 종목명(한글)
  price: number; // 현재가
  changeRate: number; // 등락률 (%)
  volume: number; // 거래량
  amount: number; // 거래대금
  prevVolume: number; // 전일 거래량
};

type ApiResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: any[];
};

export async function fetchDomesticRanking(
  metric: DomesticRankingMetric = 'volume'
): Promise<DomesticRankingItem[]> {
  const res = await fetch(`/api/kis/ranking/domestic?metric=${metric}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIS ranking error: ${text}`);
  }

  const data = (await res.json()) as ApiResponse;
  console.log(data);
  if (!data.output) return [];

  return data.output.map((row) => ({
    code: row.mksc_shrn_iscd, // 단축코드
    name: row.hts_kor_isnm, // 종목명
    price: Number(row.stck_prpr), // 현재가
    changeRate: Number(row.prdy_ctrt), // 등락률
    volume: Number(row.acml_vol), // 누적 거래량
    amount: Number(row.acml_tr_pbmn), // 누적 거래대금
    prevVolume: Number(row.prdy_vol), // 전일 거래량
  }));
}
