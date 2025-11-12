// 호가 데이터 타입
export interface OrderBookItem {
  date: string;
  rank: number;
  changeRate: string;
  volume: number;
}

// 차트 데이터 타입
export interface ChartDataPoint {
  time: string;
  price: number;
}

// 호가창 목업 데이터
export const mockOrderBook: OrderBookItem[] = [
  { date: '103.774원', rank: 16, changeRate: '+3.22%', volume: 47536005 },
  { date: '103.778원', rank: 15, changeRate: '+3.19%', volume: 47536037 },
  { date: '103.744원', rank: 9, changeRate: '+3.13%', volume: 47536005 },
  { date: '103.745원', rank: 17, changeRate: '+3.13%', volume: 47536070 },
  { date: '103.836원', rank: 9, changeRate: '+3.17%', volume: 47536155 },
  { date: '103.838원', rank: 10, changeRate: '+3.20%', volume: 47536048 },
  { date: '103.802원', rank: 7, changeRate: '+3.22%', volume: 47536007 },
  { date: '103.807원', rank: 9, changeRate: '+3.32%', volume: 47536100 },
  { date: '103.828원', rank: 19, changeRate: '+3.30%', volume: 47536026 },
  { date: '103.811원', rank: 10, changeRate: '+3.33%', volume: 47536052 },
  { date: '103.735원', rank: 17, changeRate: '+3.18%', volume: 47536140 },
  { date: '103.700원', rank: 13, changeRate: '+3.20%', volume: 47536199 },
  { date: '103.829원', rank: 18, changeRate: '+3.25%', volume: 47536027 },
  { date: '103.722원', rank: 10, changeRate: '+3.20%', volume: 47536106 },
  { date: '103.761원', rank: 9, changeRate: '+3.40%', volume: 47536165 },
  { date: '103.766원', rank: 13, changeRate: '+3.22%', volume: 47536160 },
];

// 차트 목업 데이터
export const mockChartData: ChartDataPoint[] = [
  { time: '09:00', price: 100500 },
  { time: '09:30', price: 99800 },
  { time: '10:00', price: 98500 },
  { time: '10:30', price: 97200 },
  { time: '11:00', price: 96800 },
  { time: '11:30', price: 98200 },
  { time: '12:00', price: 99500 },
  { time: '12:30', price: 101200 },
  { time: '13:00', price: 102800 },
  { time: '13:30', price: 104500 },
  { time: '14:00', price: 105200 },
  { time: '14:30', price: 106800 },
  { time: '15:00', price: 108200 },
  { time: '15:30', price: 107500 },
  { time: '16:00', price: 103800 },
];

// 주식 정보
export const stockInfo = {
  name: '삼성전자',
  code: '005930',
  currentPrice: 103800,
  change: 3300,
  changeRate: 3.28,
  changeType: 'up' as const,
  previousClose: 100500,
  marketCap: '한국 30%',
};
