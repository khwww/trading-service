import type { MarketType } from '@/lib/kis/KISRealtimePriceManager';

export type RecentStock = {
  code: string;
  name: string;
  market: MarketType;
  viewedAt: number;
};

const STORAGE_KEY = 'stockdodo:recent-stocks';
const MAX_RECENT_STOCKS = 20;
const RECENT_STOCKS_UPDATED_EVENT = 'recent-stocks-updated';

// useSyncExternalStore를 위한 캐시
let cachedStocks: RecentStock[] = [];
let cachedStorageValue: string | null = null;

export function getRecentStocks(): RecentStock[] {
  if (typeof window === 'undefined') return cachedStocks;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    // 캐시된 값과 같으면 캐시된 배열 반환 (참조 유지)
    if (stored === cachedStorageValue) {
      return cachedStocks;
    }

    // 새로운 값이면 캐시 업데이트
    cachedStorageValue = stored;
    cachedStocks = stored ? (JSON.parse(stored) as RecentStock[]) : [];
    return cachedStocks;
  } catch {
    return cachedStocks;
  }
}

export function addRecentStock(stock: Omit<RecentStock, 'viewedAt'>): void {
  if (typeof window === 'undefined') return;

  try {
    const stocks = getRecentStocks();

    // 이미 존재하는 종목이면 제거 (나중에 맨 앞에 추가됨)
    const filtered = stocks.filter((s) => s.code !== stock.code);

    // 새 종목을 맨 앞에 추가
    const newStock: RecentStock = {
      ...stock,
      viewedAt: Date.now(),
    };

    const updated = [newStock, ...filtered];

    // 최대 개수 제한
    const trimmed = updated.slice(0, MAX_RECENT_STOCKS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    // 같은 탭 내에서 변경 감지를 위한 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent(RECENT_STOCKS_UPDATED_EVENT));
  } catch (error) {
    console.error('Failed to save recent stock:', error);
  }
}

export function removeRecentStock(code: string): void {
  if (typeof window === 'undefined') return;

  try {
    const stocks = getRecentStocks();
    const updated = stocks.filter((s) => s.code !== code);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(RECENT_STOCKS_UPDATED_EVENT));
  } catch (error) {
    console.error('Failed to remove recent stock:', error);
  }
}

export function clearRecentStocks(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(RECENT_STOCKS_UPDATED_EVENT));
  } catch (error) {
    console.error('Failed to clear recent stocks:', error);
  }
}

export function subscribeRecentStocks(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener(RECENT_STOCKS_UPDATED_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(RECENT_STOCKS_UPDATED_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
