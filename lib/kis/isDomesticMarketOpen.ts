// 한국 정규장(09:00 ~ 15:30, 평일 기준) 열려 있는지 여부
export function isDomesticMarketOpen(date = new Date()): boolean {
  const day = date.getDay(); // 0: 일, 6: 토
  if (day === 0 || day === 6) return false; // 주말 휴장

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const OPEN = 9 * 60; // 09:00
  const CLOSE = 15 * 60 + 30; // 15:30

  return totalMinutes >= OPEN && totalMinutes <= CLOSE;
}
