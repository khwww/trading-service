import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-key-change-this'
);

export type JwtPayload = {
  id: string;
  nickname: string;
};

// JWT 만들기
export async function signJwt(payload: JwtPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);

  return token;
}

// JWT 검증하기
export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify<JwtPayload>(token, SECRET_KEY);
    return payload;
  } catch (err) {
    console.log(err);
  }
}
