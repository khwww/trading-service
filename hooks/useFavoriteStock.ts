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

const FAVORITES_EVENT = 'stockdodo:favorites-changed';

type FavoritesEventDetail = {
  storageKey: string;
  favorites: FavoriteStock[];
};

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

  useEffect(() => {
    if (!storageKey) return;
    if (!hydrated) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [storageKey, favorites, hydrated]);

  useEffect(() => {
    if (!storageKey) return;
    if (typeof window === 'undefined') return;

    const handler = (event: Event) => {
      const custom = event as CustomEvent<FavoritesEventDetail>;
      if (custom.detail.storageKey !== storageKey) return;

      setTimeout(() => {
        setFavorites(custom.detail.favorites);
      }, 0);
    };

    window.addEventListener(FAVORITES_EVENT, handler);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, handler);
    };
  }, [storageKey]);

  const isFavorite = (code: string) =>
    favorites.some((item) => item.code === code);

  const broadcast = (next: FavoriteStock[]) => {
    if (typeof window === 'undefined' || !storageKey) return;
    const event = new CustomEvent<FavoritesEventDetail>(FAVORITES_EVENT, {
      detail: { storageKey, favorites: next },
    });
    window.dispatchEvent(event);
  };

  const toggleFavorite = (stock: FavoriteStock) => {
    if (!storageKey) return;

    setFavorites((prev) => {
      const exists = prev.some((item) => item.code === stock.code);
      const next = exists
        ? prev.filter((item) => item.code !== stock.code)
        : [...prev, stock];

      broadcast(next);
      return next;
    });
  };

  const removeFavorite = (code: string) => {
    if (!storageKey) return;

    setFavorites((prev) => {
      const next = prev.filter((item) => item.code !== code);
      broadcast(next);
      return next;
    });
  };

  return { favorites, isFavorite, toggleFavorite, removeFavorite, hydrated };
}
