export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="font-bold text-primary-foreground text-sm">
              SD
            </span>
          </div>
          <span className="text-lg font-bold">스탁두두</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#FEE500] px-3 py-1.5 text-xs font-semibold text-black active:scale-95 transition"
          >
            <span>카카오로 시작하기</span>
          </button>
        </div>
      </div>
    </header>
  );
}
