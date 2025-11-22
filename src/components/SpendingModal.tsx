import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';

interface SpendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpend: (amount: number, item: string) => void;
  maxPoints: number;
}

const SpendingModal: React.FC<SpendingModalProps> = ({ isOpen, onClose, onSpend, maxPoints }) => {
  const [amount, setAmount] = useState('');
  const [item, setItem] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseInt(amount);
    if (isNaN(cost) || cost <= 0) {
      setError('请输入有效的积分数量');
      return;
    }
    if (cost > maxPoints) {
      setError('积分不足！继续努力存分吧！');
      return;
    }
    if (!item.trim()) {
        setError('请记录购买的物品名称');
        return;
    }

    onSpend(cost, item);
    setAmount('');
    setItem('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-scale-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
            <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6" />
            </div>
          <h2 className="text-2xl font-bold text-gray-800">消耗积分</h2>
          <p className="text-sm text-gray-500 mt-1">兑换你想要的奖励</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">消耗项目 (玩具/零食等)</label>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="例如：乐高积木"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">消耗积分</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-lg font-mono"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-pink-600 active:scale-95 transition-all"
          >
            确认消耗积分
          </button>
        </form>
      </div>
    </div>
  );
};

export default SpendingModal;