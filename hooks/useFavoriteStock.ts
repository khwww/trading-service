'use client';

import { MarketType } from '@/lib/kis/KISRealtimePriceManager';
import { useEffect, useState } from 'react';

export type FavoriteStock = {
  code: string;
  name: string;
  market: MarketType;
  price?: number | string;
  change?: number | string;
  changeRate?: number | string;
};

const buildStorageKey = (userKey: string | null) =>
  userKey ? `stockdodo:favorites:${userKey}` : null;

export function useFavoriteStock(userKey: string | null) {
  const storageKey = buildStorageKey(userKey);
  const [favorites, setFavorites] = useState<FavoriteStock[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!storageKey) {
      setFavorites([]);
      setHydrated(true);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setFavorites(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to parse favorites from localStorage', e);
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  // 변경사항 저장
  useEffect(() => {
    if (!storageKey) return;
    if (!hydrated) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [storageKey, favorites, hydrated]);

  const isFavorite = (code: string) =>
    favorites.some((item) => item.code === code);

  const toggleFavorite = (stock: FavoriteStock) => {
    if (!storageKey) return;

    setFavorites((prev) => {
      const exists = prev.some((item) => item.code === stock.code);
      if (exists) {
        return prev.filter((item) => item.code !== stock.code);
      }
      return [...prev, stock];
    });
  };

  const removeFavorite = (code: string) => {
    if (!storageKey) return;

    setFavorites((prev) => prev.filter((item) => item.code !== code));
  };

  return { favorites, isFavorite, toggleFavorite, removeFavorite, hydrated };
}
