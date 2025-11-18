'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { mockChartData } from '@/data/mockData';
import { TrendingUp, TrendingDown, Maximize2, Share2 } from 'lucide-react';

export default function StockChart() {
  const splitIndex = Math.floor(mockChartData.length / 2);
  const chartDataWithColor = mockChartData.map((item, index) => ({
    ...item,
    fill: index < splitIndex ? 'url(#colorDown)' : 'url(#colorUp)'
  }));

  return (
    <div className="bg-black text-white p-4">
      {/* 차트 컨트롤 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <TrendingUp size={18} />
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <TrendingDown size={18} />
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3h18v18H3z"/>
            </svg>
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <Maximize2 size={18} />
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <Share2 size={18} />
          </button>
        </div>
        <div className="bg-red-500 text-white px-3 py-1 rounded text-sm">
          103,800
        </div>
      </div>

      {/* 차트 */}
      <div className="relative" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockChartData}>
            <defs>
              <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="time"
              stroke="#666"
              tick={{ fill: '#999', fontSize: 12 }}
            />
            <YAxis
              stroke="#666"
              tick={{ fill: '#999', fontSize: 12 }}
              domain={['dataMin - 5000', 'dataMax + 5000']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#dc2626"
              strokeWidth={2}
              fill="url(#colorUp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 차트 하단 버튼 */}
      <div className="flex items-center gap-2 mt-4">
        <button className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-gray-800">
          1분
        </button>
        <button className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-gray-800">
          일
        </button>
        <button className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-gray-800">
          주
        </button>
        <button className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-gray-800">
          월
        </button>
        <button className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-gray-800">
          년
        </button>
      </div>
    </div>
  );
}
