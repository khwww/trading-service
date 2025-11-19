import { signJwt } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const REST_API_KEY = process.env.KAKAO_REST_API_KEY!;
  const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI!;

  // 인가 코드로 액세스 토큰 요청
  const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    console.error('토큰 요청 에러', tokenData);
    return NextResponse.json(tokenData, { status: 400 });
  }

  // 액세스 토큰으로 사용자 정보 요청
  const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  const userData = await userResponse.json();
  const kakaoId = String(userData.id);
  const nickname = userData.kakao_account?.profile?.nickname ?? '카카오사용자';

  // JWT 만들기
  const jwt = await signJwt({
    id: kakaoId,
    nickname,
  });

  const response = NextResponse.redirect(new URL('/', request.url));

  response.cookies.set({
    name: 'auth',
    value: jwt,
    httpOnly: true, // JS에서 접근 불가 → XSS 방어
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7일
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production', // 배포 환경에서만 true
  });

  return response;
}
