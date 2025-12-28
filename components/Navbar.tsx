
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { walletService } from '../utils/walletService';
import { formatNaira } from '../utils/fareCalculator';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (user?.role === 'sender') {
      const sync = () => setBalance(walletService.getWallet().balance);
      sync();
      const interval = setInterval(sync, 2000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-[150] px-8 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
          <i className="fa-solid fa-bolt-auto text-xl"></i>
        </div>
        <span className="text-xl font-black tracking-tighter hidden sm:block">BANDIT<span className="text-slate-400">RIDERS</span></span>
      </Link>

      <div className="flex items-center gap-8">
        {user && user.role === 'sender' && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/order" className="text-sm font-bold text-slate-900 hover:text-indigo-600">Order</Link>
            <Link to="/deliveries" className="text-sm font-bold text-slate-900 hover:text-indigo-600">Activity</Link>
            <Link to="/wallet" className="text-sm font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-2 hover:bg-indigo-100">
              <i className="fa-solid fa-wallet"></i>
              {formatNaira(balance)}
            </Link>
          </div>
        )}

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{user.role} Account</span>
                <span className="text-sm font-black text-slate-900">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="px-5 py-2.5 rounded-xl text-xs font-black uppercase text-slate-400 hover:text-red-600 transition-all">Logout</button>
              <img src={user.avatar} className="w-10 h-10 rounded-xl ring-2 ring-slate-100 cursor-pointer" alt="Avatar" onClick={() => navigate(user.role === 'rider' ? '/rider-dashboard' : '/order')} />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/auth" className="text-sm font-bold text-slate-500 hover:text-indigo-600">Login</Link>
              <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
