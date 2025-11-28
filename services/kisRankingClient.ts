export type DomesticRankingMetric = 'volume' | 'amount' | 'rise' | 'fall';

export type DomesticRankingItem = {
  code: string; // 종목코드 (KIS의 mksc_shrn_iscd / stck_shrn_iscd 통합)
  name: string; // 종목명(한글)
  price: number; // 현재가
  changeRate: number; // 등락률 (%)
  volume: number; // 거래량
  amount: number; // 거래대금
  prevVolume: number; // 전일 거래량
};

// KIS 랭킹 API 공통 row 타입
type KISRankingRow = {
  mksc_shrn_iscd?: string; // 거래량/거래대금 랭킹에서 사용
  stck_shrn_iscd?: string; // 등락률 랭킹에서 사용
  hts_kor_isnm: string;
  stck_prpr: string | number;
  prdy_ctrt: string | number;
  acml_vol: string | number;
  acml_tr_pbmn: string | number;
  prdy_vol: string | number;
};

type ApiResponse = {
  output?: KISRankingRow[];
};

// 거래량/거래대금 랭킹: mksc_shrn_iscd
// 등락률 랭킹: stck_shrn_iscd
function getShortCode(row: KISRankingRow): string {
  const code = row.mksc_shrn_iscd ?? row.stck_shrn_iscd;
  if (!code) {
    throw new Error('KIS ranking row is missing stock short code');
  }
  return code;
}

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

  if (!data.output) return [];

  return data.output.map((row) => ({
    code: getShortCode(row),
    name: row.hts_kor_isnm, // 종목명
    price: Number(row.stck_prpr), // 현재가
    changeRate: Number(row.prdy_ctrt), // 등락률
    volume: Number(row.acml_vol), // 누적 거래량
    amount: Number(row.acml_tr_pbmn), // 누적 거래대금
    prevVolume: Number(row.prdy_vol), // 전일 거래량
  }));
}
