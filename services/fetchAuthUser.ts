'use client';

export type AuthUser = { id: string; nickname: string } | null;

const USER_STORAGE_KEY = 'stockdodo:user';

export async function fetchAuthUser(): Promise<AuthUser> {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }

    const data = await res.json();
    const user: AuthUser = data.user ?? null;

    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }

    return user;
  } catch (e) {
    console.error('failed to fetch /api/auth/me', e);
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}
