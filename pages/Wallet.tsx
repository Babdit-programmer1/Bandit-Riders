
import React, { useState, useEffect } from 'react';
import { walletService } from '../utils/walletService';
import { formatNaira } from '../utils/fareCalculator';
import { WalletData } from '../types';
import FundWalletModal from '../components/FundWalletModal';
import Button from '../components/Button';

const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData>(walletService.getWallet());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleFund = (amount: number) => {
    const updated = walletService.fundWallet(amount);
    setWallet(updated);
    setIsModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#f8fafc] px-6">
      <FundWalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onFund={handleFund} 
      />

      {showToast && (
        <div className="fixed top-24 right-6 z-[500] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10">
          <i className="fa-solid fa-circle-check text-xl"></i>
          <div>
            <p className="text-xs font-black uppercase tracking-widest">Success</p>
            <p className="text-sm font-bold">Wallet successfully funded!</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">My Wallet</h2>
            <p className="text-slate-400 font-medium mt-2 italic">Lagos Dispatch Credits • Securely Stored</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl px-8 py-4 bg-indigo-600 shadow-xl font-black uppercase text-xs tracking-widest"
          >
            Fund Wallet
          </Button>
        </div>

        {/* Balance Card */}
        <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:bg-indigo-600/30"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-8">
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Available Balance</p>
              <h4 className="text-7xl font-black tracking-tighter leading-none">{formatNaira(wallet.balance)}</h4>
            </div>
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 text-3xl">
              <i className="fa-solid fa-wallet text-indigo-400"></i>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-premium border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Transaction History</h3>
          <div className="space-y-6">
            {wallet.transactions.length > 0 ? (
              wallet.transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-2 group hover:bg-slate-50 rounded-2xl transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${tx.type === 'fund' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      <i className={`fa-solid ${tx.type === 'fund' ? 'fa-arrow-down-long' : 'fa-arrow-up-long'}`}></i>
                    </div>
                    <div>
                      <h5 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{tx.description}</h5>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{tx.date} • {tx.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-black ${tx.type === 'fund' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'fund' ? '+' : '-'}{formatNaira(tx.amount)}
                    </p>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Settled</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <i className="fa-solid fa-receipt text-5xl text-slate-200 mb-4"></i>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
