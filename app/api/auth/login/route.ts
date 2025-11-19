import { NextResponse } from 'next/server';

// 사용자를 카카오 로그인 페이지로 리다이렉트
export async function GET() {
  const REST_API_KEY = process.env.KAKAO_REST_API_KEY!;
  const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI!;

  const kakaoAuthURL =
    `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code`;

  return NextResponse.redirect(kakaoAuthURL);
}
