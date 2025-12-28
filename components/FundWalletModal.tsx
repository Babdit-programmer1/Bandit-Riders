
import React, { useState } from 'react';
import Button from './Button';
import { formatNaira } from '../utils/fareCalculator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFund: (amount: number) => void;
}

const FundWalletModal: React.FC<Props> = ({ isOpen, onClose, onFund }) => {
  const [customAmount, setCustomAmount] = useState('');
  const presets = [1000, 2000, 5000, 10000];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-3xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Fund Wallet</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {presets.map(amount => (
            <button
              key={amount}
              onClick={() => onFund(amount)}
              className="py-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all font-black text-slate-700"
            >
              {formatNaira(amount)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Or Enter Custom Amount</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">₦</span>
            <input
              type="number"
              placeholder="0.00"
              className="w-full pl-10 pr-8 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-900 outline-none"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
          </div>
          <Button
            fullWidth
            size="lg"
            className="py-5 rounded-2xl font-black bg-indigo-600 shadow-xl"
            disabled={!customAmount || parseFloat(customAmount) <= 0}
            onClick={() => {
              onFund(parseFloat(customAmount));
              setCustomAmount('');
            }}
          >
            Fund Wallet Now
          </Button>
          <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
            <i className="fa-solid fa-shield-halved mr-2"></i> Simulated Secure Payment Hub
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundWalletModal;
