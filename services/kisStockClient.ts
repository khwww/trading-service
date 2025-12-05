// 주식 현재가 시세 타입
export type StockPrice = {
  code: string; // 종목코드
  name: string; // 종목명
  price: number; // 현재가
  change: number; // 전일 대비
  changeRate: number; // 등락률 (%)
  changeSign: string; // 등락 부호 (1:상한, 2:상승, 3:보합, 4:하한, 5:하락)
  volume: number; // 누적 거래량
  amount: number; // 누적 거래대금
  open: number; // 시가
  high: number; // 고가
  low: number; // 저가
  prevClose: number; // 전일 종가
};

type ApiResponse = {
  output: {
    stck_prpr: string; // 현재가
    prdy_vrss: string; // 전일 대비
    prdy_ctrt: string; // 등락률
    prdy_vrss_sign: string; // 등락 부호
    acml_vol: string; // 누적 거래량
    acml_tr_pbmn: string; // 누적 거래대금
    stck_oprc: string; // 시가
    stck_hgpr: string; // 고가
    stck_lwpr: string; // 저가
    stck_sdpr: string; // 전일 종가
    hts_kor_isnm: string; // 종목명
  };
  rt_cd: string;
  msg_cd: string;
  msg1: string;
};

export async function fetchStockPrice(code: string): Promise<StockPrice> {
  const res = await fetch(`/api/kis/stock/price?code=${code}`, {
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIS stock price error: ${text}`);
  }

  const data = (await res.json()) as ApiResponse;

  if (data.rt_cd !== "0") {
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

// 일별 시세 타입
export type DailyPrice = {
  date: string; // 날짜 (YYYYMMDD)
  close: number; // 종가
  open: number; // 시가
  high: number; // 고가
  low: number; // 저가
  volume: number; // 거래량
  amount: number; // 거래대금
  changeRate: number; // 등락률
  changeSign: string; // 등락 부호
};

type DailyApiResponse = {
  output: Array<{
    stck_bsop_date: string; // 영업일자
    stck_clpr: string; // 종가
    stck_oprc: string; // 시가
    stck_hgpr: string; // 고가
    stck_lwpr: string; // 저가
    acml_vol: string; // 누적 거래량
    acml_tr_pbmn: string; // 누적 거래대금
    prdy_ctrt: string; // 전일 대비율
    prdy_vrss_sign: string; // 전일 대비 부호
  }>;
  rt_cd: string;
  msg_cd: string;
  msg1: string;
};

export async function fetchStockDaily(code: string): Promise<DailyPrice[]> {
  const res = await fetch(`/api/kis/stock/daily?code=${code}`, {
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIS stock daily error: ${text}`);
  }

  const data = (await res.json()) as DailyApiResponse;

  if (data.rt_cd !== "0") {
    throw new Error(`KIS API error: ${data.msg1}`);
  }

  return data.output.map((item) => ({
    date: item.stck_bsop_date,
    close: Number(item.stck_clpr),
    open: Number(item.stck_oprc),
    high: Number(item.stck_hgpr),
    low: Number(item.stck_lwpr),
    volume: Number(item.acml_vol),
    amount: Number(item.acml_tr_pbmn),
    changeRate: Number(item.prdy_ctrt),
    changeSign: item.prdy_vrss_sign,
  }));
}

// ========== 해외 주식 ==========

// 해외 주식 현재가 시세 타입
export type OverseasStockPrice = {
  code: string; // 종목코드
  name: string; // 종목명
  price: number; // 현재가
  change: number; // 전일 대비
  changeRate: number; // 등락률 (%)
  changeSign: string; // 등락 부호
  volume: number; // 거래량
  open: number; // 시가
  high: number; // 고가
  low: number; // 저가
  prevClose: number; // 전일 종가
  excd: string; // 거래소코드
};

type OverseasPriceApiResponse = {
  output: {
    rsym: string; // 실시간 종목코드
    zdiv: string; // 소수점 자릿수
    curr: string; // 통화
    vnit: string; // 거래단위
    open: string; // 시가
    high: string; // 고가
    low: string; // 저가
    last: string; // 현재가
    base: string; // 전일 종가
    diff: string; // 전일 대비
    rate: string; // 등락률
    pvol: string; // 거래량
    tvol: string; // 거래대금
    tamt: string; // 거래대금(달러)
    ordy: string; // 매수가능여부
  };
  rt_cd: string;
  msg_cd: string;
  msg1: string;
};

export async function fetchOverseasStockPrice(
  code: string,
  excd: string = "NAS"
): Promise<OverseasStockPrice> {
  const res = await fetch(
    `/api/kis/stock/overseas/price?code=${code}&excd=${excd}`,
    { method: "GET" }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIS overseas stock price error: ${text}`);
  }

  const data = (await res.json()) as OverseasPriceApiResponse;

  console.log("KIS Overseas Price API 응답:", data);

  if (data.rt_cd !== "0") {
    throw new Error(`KIS API error: ${data.msg1}`);
  }

  const output = data.output;
  const diff = Number(output.diff);

  return {
    code,
    name: "", // 해외 주식 현재가 API는 종목명을 반환하지 않음 (별도 처리 필요)
    price: Number(output.last),
    change: diff,
    changeRate: Number(output.rate),
    changeSign: diff > 0 ? "2" : diff < 0 ? "5" : "3", // 2:상승, 5:하락, 3:보합
    volume: Number(output.pvol),
    open: Number(output.open),
    high: Number(output.high),
    low: Number(output.low),
    prevClose: Number(output.base),
    excd,
  };
}

// 해외 주식 일별 시세 타입
export type OverseasDailyPrice = {
  date: string; // 날짜 (YYYYMMDD)
  close: number; // 종가
  open: number; // 시가
  high: number; // 고가
  low: number; // 저가
  volume: number; // 거래량
  changeRate: number; // 등락률
  changeSign: string; // 등락 부호
};

type OverseasDailyApiResponse = {
  output2: Array<{
    xymd: string; // 일자 (YYYYMMDD)
    clos: string; // 종가
    open: string; // 시가
    high: string; // 고가
    low: string; // 저가
    tvol: string; // 거래량
    tamt: string; // 거래대금
    rate: string; // 등락률
  }>;
  rt_cd: string;
  msg_cd: string;
  msg1: string;
};

export async function fetchOverseasStockDaily(
  code: string,
  excd: string = "NAS"
): Promise<OverseasDailyPrice[]> {
  const res = await fetch(
    `/api/kis/stock/overseas/daily?code=${code}&excd=${excd}`,
    { method: "GET" }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIS overseas stock daily error: ${text}`);
  }

  const data = (await res.json()) as OverseasDailyApiResponse;

  console.log("KIS Overseas Daily API 응답:", data);

  if (data.rt_cd !== "0") {
    throw new Error(`KIS API error: ${data.msg1}`);
  }

  return data.output2.map((item) => {
    const changeRate = Number(item.rate);
    return {
      date: item.xymd,
      close: Number(item.clos),
      open: Number(item.open),
      high: Number(item.high),
      low: Number(item.low),
      volume: Number(item.tvol),
      changeRate,
      changeSign: changeRate > 0 ? "2" : changeRate < 0 ? "5" : "3",
    };
  });
}
