import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const appKey = process.env.KIS_APP_KEY;
    const appSecret = process.env.KIS_APP_SECRET;

    if (!appKey || !appSecret) {
      return NextResponse.json(
        { message: 'KIS env not configured' },
        { status: 500 }
      );
    }

    const baseUrl = 'https://openapi.koreainvestment.com:9443';
    const url = `${baseUrl}/oauth2/tokenP`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        appkey: appKey,
        appsecret: appSecret,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('KIS token error:', text);
      return NextResponse.json(
        { message: 'KIS token request failed', detail: text },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('KIS token route error:', error);
    return NextResponse.json(
      { message: 'Unexpected error', detail: String(error) },
      { status: 500 }
    );
  }
}
