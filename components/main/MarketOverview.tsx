const marketData = [
  {
    name: '달러 환율',
    value: '1,443.25',
    change: '+13.15',
    changePercent: '0.91%',
    isPositive: true,
  },
  {
    name: '나스닥',
    value: '22,740.39',
    change: '-213.27',
    changePercent: '0.92%',
    isPositive: false,
  },
  {
    name: 'S&P 500',
    value: '6,699.40',
    change: '-35.95',
    changePercent: '0.53%',
    isPositive: false,
  },
  {
    name: '다우존스',
    value: '44,722.06',
    change: '+25.14',
    changePercent: '0.06%',
    isPositive: true,
  },
];

export default function MarketOverview() {
  return (
    <div className="mb-4">
      <div className="flex gap-3  pb-1.5">
        {marketData.map((market) => (
          <div
            key={market.name}
            className="min-w-[180px] cursor-pointer rounded-lg border border-border/50 bg-card p-3 text-card-foreground shadow-sm hover:bg-muted "
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1 text-sm text-muted-foreground">
                  {market.name}
                </div>
                <div className="mb-0.5 text-xl font-semibold tabular-nums">
                  {market.value}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    market.isPositive ? 'text-red-500' : 'text-blue-500'
                  }`}
                >
                  <span>
                    {market.isPositive ? '+' : ''}
                    {market.change}
                  </span>
                  <span>
                    ({market.isPositive ? '+' : ''}
                    {market.changePercent})
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
