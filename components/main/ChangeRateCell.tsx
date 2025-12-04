'use client';

type ChangeRateCellProps = {
  value: number | null | undefined;
};

export default function ChangeRateCell({ value }: ChangeRateCellProps) {
  if (value == null) {
    return <span className="text-xs text-neutral-400">-</span>;
  }

  const isUp = value > 0;
  const isDown = value < 0;

  const formatted =
    value > 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;

  const baseClass =
    'inline-flex min-w-[80px] justify-end rounded px-2 py-1 text-sm tabular-nums';

  const colorClass = isUp
    ? 'text-red-500'
    : isDown
      ? 'text-blue-500'
      : 'text-neutral-500';

  const flashClass = isUp
    ? 'change-flash-up'
    : isDown
      ? 'change-flash-down'
      : '';

  return (
    <span key={value} className={`${baseClass} ${colorClass} ${flashClass}`}>
      {formatted}
    </span>
  );
}
