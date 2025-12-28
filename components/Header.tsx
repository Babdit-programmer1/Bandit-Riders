
import React from 'react';
import { RiderProfile } from '../types';

interface HeaderProps {
  profile: RiderProfile;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ profile, title }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-xs font-medium text-gray-400">Total Earnings</span>
          <span className="text-sm font-bold text-green-600">${profile.earnings.toFixed(2)}</span>
        </div>

        <button className="relative text-gray-400 hover:text-indigo-600 transition-colors">
          <i className="fa-solid fa-bell text-xl"></i>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">2</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
