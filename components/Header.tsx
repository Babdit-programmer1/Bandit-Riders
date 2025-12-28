
import React from 'react';
import { RiderProfile } from '../types';
import { formatNaira } from '../utils/fareCalculator';

interface HeaderProps {
  profile: RiderProfile;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ profile, title }) => {
  return (
    <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-40">
      <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{title}</h2>

      <div className="flex items-center gap-8">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Session Revenue</span>
          <span className="text-sm font-black text-emerald-600 leading-tight">{formatNaira(profile.earnings)}</span>
        </div>

        <button className="relative text-slate-300 hover:text-indigo-600 transition-colors">
          <i className="fa-solid fa-bell text-xl"></i>
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-black border-2 border-white">2</span>
        </button>

        <img src={profile.avatar} alt={profile.name} className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm" />
      </div>
    </header>
  );
};

export default Header;
