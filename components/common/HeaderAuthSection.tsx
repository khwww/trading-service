'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import Link from 'next/link';

type HeaderAuthSectionProps = {
  nickname: string | null;
};

export default function HeaderAuthSection({
  nickname,
}: HeaderAuthSectionProps) {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      alert('로그아웃이 완료되었습니다.');
      window.location.reload();
    } catch (e) {
      console.error('로그아웃 실패', e);
    }
  };

  if (!nickname) {
    return (
      <Link href="/api/auth/login">
        <button
          type="button"
          className="flex items-center gap-2 rounded bg-[#FEE500] px-3 py-1.5 text-sm font-semibold text-black active:scale-95 transition cursor-pointer"
        >
          <span>카카오 로그인</span>
        </button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{nickname} 님</span>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/70 cursor-pointer"
        >
          <User className="h-5 w-5 text-white" />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border border-border bg-primary/70 shadow-lg py-2 z-50">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm cursor-pointer hover:font-semibold"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
