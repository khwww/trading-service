import { cn } from '@/lib/utils';

const REGION_FILTERS = ['전체', '국내', '해외'] as const;
const METRIC_FILTERS = ['거래대금', '거래량', '급상승', '급하락'] as const;

type StockFilterProps = {
  region: string;
  metric: string | null;
  onRegionChange: (value: string) => void;
  onMetricChange: (value: string) => void;
};

export default function StockFilter({
  region,
  metric,
  onRegionChange,
  onMetricChange,
}: StockFilterProps) {
  return (
    <>
      <div className="mb-2 flex items-center gap-6 border-b border-border">
        <div className="relative pb-3 text-sm font-medium text-foreground">
          실시간 차트
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        </div>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        {REGION_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onRegionChange(filter)}
            className={cn(
              'rounded-full px-3 py-1 text-sm transition-all hover:scale-105 cursor-pointer',
              region === filter
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-transparent text-muted-foreground hover:bg-muted/40'
            )}
          >
            {filter}
          </button>
        ))}
        {METRIC_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onMetricChange(filter)}
            className={cn(
              'rounded-full px-3 py-1 text-sm transition-all hover:scale-105 border border-transparent cursor-pointer',
              metric === filter
                ? 'bg-muted text-foreground border-border'
                : 'bg-transparent text-muted-foreground hover:bg-muted/40'
            )}
          >
            {filter}
          </button>
        ))}
      </div>
    </>
  );
}
