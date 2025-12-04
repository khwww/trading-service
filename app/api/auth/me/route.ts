import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth')?.value;

  if (!token) {
    return NextResponse.json(
      { user: null, error: 'No auth token' },
      { status: 401 }
    );
  }

  const payload = await verifyJwt(token);

  if (!payload) {
    return NextResponse.json(
      { user: null, error: 'Invalid token' },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      user: {
        id: payload.id,
        nickname: payload.nickname,
      },
    },
    { status: 200 }
  );
}
