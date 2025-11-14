'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TradingModal({ isOpen, onClose }: TradingModalProps) {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [marketPrice, setMarketPrice] = useState(true);
  const [quantity, setQuantity] = useState<number>(103800);
  const [amount, setAmount] = useState<number>(0);
  const [leverage, setLeverage] = useState<number>(10);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-white rounded-lg w-full max-w-md">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">시세</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded">
            <X size={20} />
          </button>
        </div>

        {/* 주문 타입 선택 */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-400">주문 후기</span>
            <button className="text-sm text-gray-400 hover:text-white">
              고급 주문 &gt;
            </button>
          </div>

          {/* 실시간/일반 탭 */}
          <div className="flex gap-2 mb-4">
            <button className="flex-1 py-2 text-sm border border-gray-700 rounded hover:bg-gray-800">
              실시간
            </button>
            <button className="flex-1 py-2 text-sm border border-gray-700 rounded hover:bg-gray-800">
              일반
            </button>
          </div>

          {/* 매수/매도 탭 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setOrderType('buy')}
              className={`flex-1 py-3 rounded font-semibold transition-colors ${
                orderType === 'buy'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              구매
            </button>
            <button
              onClick={() => setOrderType('sell')}
              className={`flex-1 py-3 rounded font-semibold transition-colors ${
                orderType === 'sell'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              판매
            </button>
            <button className="flex-1 py-3 bg-gray-800 text-gray-400 rounded font-semibold hover:bg-gray-700">
              대기
            </button>
          </div>

          {/* 주문 유형 */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">주문 유형</label>
            <select className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 text-white">
              <option>일반 주문</option>
            </select>
          </div>

          {/* 가격 */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">가격 / 개당</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-zinc-800 border border-gray-700 rounded px-3 py-2">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="flex-1 bg-transparent outline-none text-white"
                />
                <div className="flex flex-col gap-1 ml-2">
                  <button
                    onClick={() => setQuantity(q => q + 100)}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => setQuantity(q => Math.max(0, q - 100))}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    ▼
                  </button>
                </div>
              </div>
              <span className="text-white">원</span>
            </div>
          </div>

          {/* 수량 */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">수량</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-zinc-800 border border-gray-700 rounded px-3 py-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="flex-1 bg-transparent outline-none text-white"
                  placeholder="0"
                />
                <div className="flex flex-col gap-1 ml-2">
                  <button
                    onClick={() => setAmount(a => a + 1)}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => setAmount(a => Math.max(0, a - 1))}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 레버리지 슬라이더 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">레버리지</span>
              <span className="text-white font-semibold">{leverage}%</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="50"
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="flex-1"
              />
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setLeverage(10)}
                  className={`px-2 py-1 rounded ${leverage === 10 ? 'bg-gray-700' : 'bg-gray-800'}`}
                >
                  10%
                </button>
                <button
                  onClick={() => setLeverage(25)}
                  className={`px-2 py-1 rounded ${leverage === 25 ? 'bg-gray-700' : 'bg-gray-800'}`}
                >
                  25%
                </button>
                <button
                  onClick={() => setLeverage(50)}
                  className={`px-2 py-1 rounded ${leverage === 50 ? 'bg-gray-700' : 'bg-gray-800'}`}
                >
                  50%
                </button>
                <button className="px-2 py-1 rounded bg-gray-800">최대</button>
              </div>
            </div>
          </div>

          {/* 시장가 옵션 */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={marketPrice}
                onChange={(e) => setMarketPrice(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">시장가 (최근 30%)</span>
            </label>
          </div>

          {/* 국내거래 공제 */}
          <div className="mb-4 text-sm">
            <div className="flex items-center justify-between text-gray-400">
              <span>국내거래 공제</span>
              <span className="text-white">0원</span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>총 주문 금액</span>
              <span className="text-white">0원</span>
            </div>
          </div>

          {/* 구매하기 버튼 */}
          <button
            className={`w-full py-3 rounded font-semibold transition-colors ${
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
