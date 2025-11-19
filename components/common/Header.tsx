import { verifyJwt } from '@/lib/jwt';
import { cookies } from 'next/headers';
import Link from 'next/link';
import HeaderAuthSection from './HeaderAuthSection';

export default async function Header() {
  const token = (await cookies()).get('auth')?.value;

  let nickname: string | null = null;

  if (token) {
    const payload = await verifyJwt(token);
    if (payload) {
      nickname = payload.nickname;
    }
  }
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-3 header-dynamic-padding">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="font-bold text-primary-foreground text-sm">
              SD
            </span>
          </div>
          <span className="text-lg font-bold">스탁두두</span>
        </Link>
        <HeaderAuthSection nickname={nickname} />
      </div>
    </header>
  );
}
