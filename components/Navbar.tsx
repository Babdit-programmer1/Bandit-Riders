
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { walletService } from '../utils/walletService';
import { formatNaira } from '../utils/fareCalculator';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isRider = user?.role === 'rider';

  return (
    <nav className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-[150] px-8 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-11 h-11 bg-indigo-600 text-white rounded-[1rem] flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
          <i className="fa-solid fa-bolt-auto text-2xl"></i>
        </div>
        <span className="text-2xl font-black tracking-tighter hidden sm:block">BANDIT<span className="text-slate-400">RIDERS</span></span>
      </Link>

      <div className="flex items-center gap-10">
        {user && !isRider && (
          <div className="hidden md:flex items-center gap-8">
            <Link to="/order" className={`text-sm font-black uppercase tracking-widest ${location.pathname === '/order' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>New Dispatch</Link>
            <Link to="/deliveries" className={`text-sm font-black uppercase tracking-widest ${location.pathname === '/deliveries' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>Activity</Link>
            <Link to="/wallet" className="flex items-center gap-3 bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">
              <i className="fa-solid fa-wallet"></i>
              <span className="text-sm font-black">{formatNaira(balance)}</span>
            </Link>
          </div>
        )}

        {user && isRider && (
          <Link to="/rider-dashboard" className="hidden md:block text-sm font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-xl border border-indigo-100">Mission Control</Link>
        )}

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="flex flex-col items-end mr-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{user.role}</span>
                <span className="text-sm font-black text-slate-900 leading-none">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                <i className="fa-solid fa-power-off text-xl"></i>
              </button>
              <img src={user.avatar} className="w-11 h-11 rounded-2xl ring-4 ring-slate-50 cursor-pointer object-cover shadow-sm" alt="Profile" onClick={() => navigate(isRider ? '/rider-dashboard' : '/order')} />
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/auth" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600">Login</Link>
              <Link to="/signup" className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-colors">Join Elite</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
