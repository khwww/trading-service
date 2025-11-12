'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function TradingPanel() {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [marketPrice, setMarketPrice] = useState(true);
  const [quantity, setQuantity] = useState<number>(103800);
  const [amount, setAmount] = useState<number>(0);
  const [leverage, setLeverage] = useState<number>(10);

  return (
    <div className="bg-black text-white p-4 h-full border-l border-gray-800">
      <h2 className="text-lg font-semibold mb-4">주문하기</h2>

      <div className="space-y-4">
        {/* 주문 후기 */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">주문 후기</span>
          <button className="text-gray-400 hover:text-white">
            일반 주문 ▾
          </button>
        </div>

        {/* 매수/매도 탭 */}
        <div className="flex gap-2">
          <button
            onClick={() => setOrderType('buy')}
            className={`flex-1 py-2.5 rounded text-sm font-semibold transition-colors ${
              orderType === 'buy'
                ? 'bg-red-500 text-white'
                : 'bg-gray-900 text-gray-400'
            }`}
          >
            구매
          </button>
          <button
            onClick={() => setOrderType('sell')}
            className={`flex-1 py-2.5 rounded text-sm font-semibold transition-colors ${
              orderType === 'sell'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-900 text-gray-400'
            }`}
          >
            판매
          </button>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-800 pt-4">
          {/* 가격 / 개당 */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-2 block">가격 / 개당</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center justify-between bg-zinc-900 border border-gray-700 rounded px-3 py-2">
                <span className="text-white font-medium">{quantity.toLocaleString()}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(0, q - 100))}
                    className="text-gray-400 hover:text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => setQuantity(q => q + 100)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 수량 */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-2 block">수량</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center justify-between bg-zinc-900 border border-gray-700 rounded px-3 py-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="flex-1 bg-transparent outline-none text-white"
                  placeholder="0"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAmount(a => Math.max(0, a - 1))}
                    className="text-gray-400 hover:text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => setAmount(a => a + 1)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 레버리지 슬라이더 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">시장가</span>
              <span className="text-white text-sm font-semibold">{leverage}%</span>
            </div>
            <div className="mb-2">
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((leverage - 10) / 40) * 100}%, #374151 ${((leverage - 10) / 40) * 100}%, #374151 100%)`
                }}
              />
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setLeverage(10)}
                className={`px-3 py-1 rounded ${leverage === 10 ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400'}`}
              >
                10%
              </button>
              <button
                onClick={() => setLeverage(25)}
                className={`px-3 py-1 rounded ${leverage === 25 ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400'}`}
              >
                25%
              </button>
              <button
                onClick={() => setLeverage(50)}
                className={`px-3 py-1 rounded ${leverage === 50 ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400'}`}
              >
                50%
              </button>
              <button
                onClick={() => setLeverage(50)}
                className="px-3 py-1 rounded bg-gray-900 text-gray-400"
              >
                최대
              </button>
            </div>
          </div>

          {/* 시장가 체크박스 */}
          <div className="mb-4 flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={marketPrice}
                onChange={(e) => setMarketPrice(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-300">시장가 (최근 30%)</span>
            </label>
            <div className="ml-auto">
              <input
                type="checkbox"
                className="w-4 h-4 rounded"
              />
            </div>
          </div>

          {/* 국내거래 공제 정보 */}
          <div className="mb-4 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">국내거래 공제</span>
              <span className="text-white">0원</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">총 주문 금액</span>
              <span className="text-white">0원</span>
            </div>
          </div>

          {/* 구매하기 버튼 */}
          <button
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              orderType === 'buy'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}
