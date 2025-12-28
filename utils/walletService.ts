
import { WalletData, WalletTransaction } from '../types';

const WALLET_KEY = 'bandit_sender_wallet';

const DEFAULT_WALLET: WalletData = {
  balance: 5000, // Starting balance for demo purposes
  transactions: [
    {
      id: 'TX-INIT',
      type: 'fund',
      amount: 5000,
      description: 'Account Opening Bonus',
      date: new Date().toLocaleDateString()
    }
  ]
};

export const walletService = {
  getWallet: (): WalletData => {
    const saved = localStorage.getItem(WALLET_KEY);
    if (!saved) {
      localStorage.setItem(WALLET_KEY, JSON.stringify(DEFAULT_WALLET));
      return DEFAULT_WALLET;
    }
    return JSON.parse(saved);
  },

  fundWallet: (amount: number): WalletData => {
    const wallet = walletService.getWallet();
    const newTransaction: WalletTransaction = {
      id: `TX-FUND-${Math.floor(Math.random() * 100000)}`,
      type: 'fund',
      amount,
      description: 'Wallet Top-up (Simulated)',
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = {
      balance: wallet.balance + amount,
      transactions: [newTransaction, ...wallet.transactions]
    };

    localStorage.setItem(WALLET_KEY, JSON.stringify(updated));
    return updated;
  },

  payForDelivery: (amount: number, deliveryId: string): boolean => {
    const wallet = walletService.getWallet();
    if (wallet.balance < amount) return false;

    const newTransaction: WalletTransaction = {
      id: `TX-PAY-${Math.floor(Math.random() * 100000)}`,
      type: 'payment',
      amount,
      description: `Delivery Payment: ${deliveryId}`,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = {
      balance: wallet.balance - amount,
      transactions: [newTransaction, ...wallet.transactions]
    };

    localStorage.setItem(WALLET_KEY, JSON.stringify(updated));
    return true;
  },

  hasSufficientFunds: (amount: number): boolean => {
    const wallet = walletService.getWallet();
    return wallet.balance >= amount;
  }
};
