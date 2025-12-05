'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchAuthUser, type AuthUser } from '@/services/fetchAuthUser';
import { useFavoriteStock } from '@/hooks/useFavoriteStock';
import { useRealtimePrice } from '@/hooks/useRealtimePrice';
import type { MarketType } from '@/lib/kis/KISRealtimePriceManager';
import { Heart } from 'lucide-react';
import ChangeRateCell from '../main/ChangeRateCell';

export default function FavoritesPanel() {
  const [user, setUser] = useState<AuthUser>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    async function initAuth() {
      try {
        const cached = localStorage.getItem('stockdodo:user');
        if (cached && !canceled) {
          setUser(JSON.parse(cached));
        }
      } catch (e) {
        console.error('failed to parse cached user', e);
      }

      const me = await fetchAuthUser();
      if (!canceled) {
        setUser(me);
        setAuthLoading(false);
      }
    }

    initAuth();
    return () => {
      canceled = true;
    };
  }, []);

  const userKey = user?.id ?? null;
  const { favorites, hydrated, removeFavorite } = useFavoriteStock(userKey);
  const isLoggedIn = !!userKey;

  const symbols = useMemo(
    () =>
      favorites.map((stock) => ({
        symbol: stock.code,
        market: stock.market as MarketType,
      })),
    [favorites]
  );

  const { ticksByKey } = useRealtimePrice(symbols);

  const mergedFavorites = useMemo(
    () =>
      favorites.map((stock) => {
        const key = `${stock.market}:${stock.code}`;
        const tick = ticksByKey[key];

        if (!tick) return stock;

        return {
          ...stock,
          price: tick.price,
          changeRate: tick.changeRate,
        };
      }),
    [favorites, ticksByKey]
  );

  return (
    <div
      className="h-full bg-zinc-900 text-white overflow-y-auto"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="p-3 border-b border-gray-800">
        <h2 className="text-base font-bold">관심</h2>
      </div>

      <div className="p-3">
        {authLoading || !hydrated ? (
          <div className="text-xs text-gray-400">불러오는 중...</div>
        ) : !isLoggedIn ? (
          <div className="text-xs text-gray-400">
            로그인이 필요한 서비스입니다.
            <br />
            관심 종목을 등록하려면 먼저 로그인해주세요.
          </div>
        ) : mergedFavorites.length === 0 ? (
          <div className="text-xs text-gray-400">
            아직 등록된 관심 종목이 없습니다.
            <br />
            메인 화면에서 하트를 눌러 관심 종목을 추가해보세요.
          </div>
        ) : (
          <div className="space-y-1.5">
            {mergedFavorites.map((stock) => {
              const displayPrice =
                typeof stock.price === 'number'
                  ? stock.price
                  : stock.price
                    ? Number(stock.price)
                    : null;

              const displayChangeRate =
                typeof stock.changeRate === 'number'
                  ? stock.changeRate
                  : typeof stock.changeRate === 'string'
                    ? parseFloat(stock.changeRate.replace('%', ''))
                    : null;

              return (
                <div
                  key={stock.code}
                  className="group flex items-center gap-2 py-2 hover:bg-zinc-800 cursor-pointer rounded px-2"
                >
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite?.(stock.code);
                    }}
                    aria-label="관심 종목 해제"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500 group-hover:scale-110 transition-transform" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{stock.name}</div>
                  </div>
                  <div className="text-right shrink-0">
                    {displayPrice != null && (
                      <div className="text-sm">
                        {displayPrice.toLocaleString()}원
                      </div>
                    )}
                    {displayChangeRate != null && (
                      <div className="mt-1">
                        <ChangeRateCell value={displayChangeRate} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
