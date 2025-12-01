import { getServerAccessToken } from '@/services/kisServerAuth';

const BASE_URL = process.env.KIS_BASE_URL;

type KISMethod = 'GET' | 'POST';

export type KISRequestConfig = {
  path: string;
  trId: string;
  method?: KISMethod;
  query?: Record<string, string>;
  body?: unknown;
};

export async function KISFetchClient<TResponse = unknown>(
  config: KISRequestConfig
): Promise<TResponse> {
  const { path, trId, method = 'GET', query, body } = config;

  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  const accessToken = await getServerAccessToken();

  if (!appKey || !appSecret) {
    throw new Error('KIS env not configured');
  }

  const url = new URL(BASE_URL + path);

  if (query) {
    const params = new URLSearchParams(query);
    url.search = params.toString();
  }

  const headers: Record<string, string> = {
    'content-type': 'application/json; charset=utf-8',
    authorization: `Bearer ${accessToken}`,
    appkey: appKey,
    appsecret: appSecret,
    tr_id: trId,
    custtype: 'P',
  };

  const res = await fetch(url.toString(), {
    method,
    headers,
    cache: 'no-store',
    body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('KIS request error:', {
      url: url.toString(),
      status: res.status,
      statusText: res.statusText,
      trId,
      body: text,
    });
    throw new Error(
      `KIS request failed (${res.status} ${res.statusText}): ${text}`
    );
  }

  return (await res.json()) as TResponse;
}
