import { NextResponse } from 'next/server';

const BASE_URL = process.env.KIS_BASE_URL;

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

    const url = `${BASE_URL}/oauth2/Approval`;
    console.log('[KIS Approval] Requesting:', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        appkey: appKey,
        secretkey: appSecret,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('KIS approval error:', text);
      return NextResponse.json(
        { message: 'KIS approval request failed', detail: text },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[KIS Approval] Route error:', error);
    console.error('[KIS Approval] BASE_URL:', BASE_URL);
    return NextResponse.json(
      { message: 'Unexpected error', detail: String(error) },
      { status: 500 }
    );
  }
}
