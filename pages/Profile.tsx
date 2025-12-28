
import React from 'react';
import { RiderProfile } from '../types';
import Button from '../components/Button';
import { formatNaira } from '../utils/fareCalculator';

interface ProfileProps {
  profile: RiderProfile;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const stats = [
    { label: 'Fulfillment', value: profile.totalDeliveries, icon: 'fa-box' },
    { label: 'Network Rating', value: profile.rating, icon: 'fa-star' },
    { label: 'Total Settled', value: formatNaira(profile.earnings), icon: 'fa-wallet' },
    { label: 'Pilot Grade', value: 'VETERAN', icon: 'fa-medal' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[3.5rem] shadow-premium border border-slate-100 overflow-hidden">
        <div className="h-40 bg-slate-900 relative">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <i className="fa-solid fa-person-biking text-[10rem] text-white"></i>
          </div>
        </div>
        <div className="px-12 pb-12">
          <div className="relative -mt-16 mb-10 flex items-end justify-between">
            <div className="w-36 h-36 rounded-[2.5rem] border-8 border-white overflow-hidden shadow-2xl bg-slate-100">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div className="pb-4">
              <Button variant="outline" size="sm" className="rounded-2xl px-6 py-3 font-black uppercase text-[10px] tracking-widest border-slate-200">
                Configure Profile
              </Button>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{profile.name}</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Registry: {profile.bikeModel}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-indigo-600 transition-colors">{stat.label}</p>
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3.5rem] shadow-premium border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter">Pilot Records</h3>
          <div className="space-y-4">
            {['Speed Demon', 'Route Expert', 'Elite Pilot'].map((badge, idx) => (
              <div key={idx} className="flex items-center gap-6 p-6 border border-slate-100 rounded-[2rem] hover:bg-slate-50 transition-all">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black">
                  <i className="fa-solid fa-award"></i>
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">{badge}</h4>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-premium text-white relative overflow-hidden">
          <h3 className="text-2xl font-black mb-8 tracking-tighter">Safety Status</h3>
          <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem]">
            <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Clear History</p>
            <p className="text-sm font-medium text-slate-300 leading-relaxed">System monitoring indicates 100% safety compliance across 340 consecutive segments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
