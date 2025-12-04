const BASE_URL = process.env.KIS_BASE_URL;

type KISTokenCache = {
  accessToken: string;
  expiresAt: number;
};

type KISTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  access_token_token_expired: string;
};

const globalForKIS = globalThis as typeof globalThis & {
  kisTokenCache?: KISTokenCache;
};

let tokenCache: KISTokenCache | undefined = globalForKIS.kisTokenCache;

function parseKISExpiredAt(
  str: string | undefined,
  fallbackMs: number,
  now: number
): number {
  if (!str) return now + fallbackMs;

  const normalized = str.replace(' ', 'T');
  const d = new Date(normalized);
  const ts = d.getTime();

  if (!Number.isFinite(ts)) {
    return now + fallbackMs;
  }
  return ts;
}

export async function fetchAccessToken(): Promise<string> {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;

  if (!appKey || !appSecret) {
    throw new Error('KIS env not configured');
  }

  const now = Date.now();

  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    console.log('[KIS] use cached token');
    return tokenCache.accessToken;
  }

  console.log('[KIS] request new token');

  const res = await fetch(`${BASE_URL}/oauth2/tokenP`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      appkey: appKey,
      appsecret: appSecret,
    }),
  });

  const text = await res.text();
  console.log('[KIS TOKEN RAW]', res.status, text);

  if (!res.ok) {
    console.log('[KIS TOKEN RAW]', res.status, text);
  }

  let data: KISTokenResponse;
  try {
    data = JSON.parse(text) as KISTokenResponse;
  } catch (e) {
    throw new Error(
      `[KIS] token JSON parse error: ${String(e)}, status=${res.status}, body=${text}`
    );
  }

  const accessToken = data.access_token as string | undefined;
  const expiresIn = Number(data.expires_in ?? 86400); // 초 단위, 보통 86400(1일)
  const expiredStr = data.access_token_token_expired as string | undefined;

  if (!accessToken) {
    throw new Error(`[KIS] token response missing access_token: body=${text}`);
  }

  const expiresAt = parseKISExpiredAt(expiredStr, expiresIn * 1000, now);

  const newCache: KISTokenCache = {
    accessToken,
    expiresAt,
  };

  tokenCache = newCache;
  globalForKIS.kisTokenCache = newCache;

  console.log(
    '[KIS] new token issued, expiresAt:',
    new Date(expiresAt).toISOString()
  );

  return accessToken;
}
