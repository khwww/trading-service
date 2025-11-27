const BASE_URL = 'https://openapi.koreainvestment.com:9443';

let cachedAccessToken: string | null = null;
let cachedExpiresAt: number | null = null;

export async function getServerAccessToken() {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;

  if (!appKey || !appSecret) {
    throw new Error('KIS env not configured');
  }

  const now = Date.now();

  // 캐시된 토큰이 있을때, 만료 1분전까지 재사용
  if (cachedAccessToken && cachedExpiresAt && cachedExpiresAt > now + 60_000) {
    console.log('cachedToken');
    return cachedAccessToken;
  }

  // 새 토큰 발급
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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KIS token error: ${text}`);
  }

  const data = await res.json();

  const accessToken = data.access_token as string;
  const expiresIn = Number(data.expires_in ?? 86400);

  cachedAccessToken = accessToken;
  cachedExpiresAt = now + expiresIn * 1000;
  console.log('newToken');
  return accessToken;
}
