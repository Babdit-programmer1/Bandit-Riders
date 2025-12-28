
import React from 'react';
import { RiderProfile } from '../types';
import Button from '../components/Button';

interface ProfileProps {
  profile: RiderProfile;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const stats = [
    { label: 'Deliveries', value: profile.totalDeliveries, icon: 'fa-box', color: 'bg-blue-50 text-blue-600' },
    { label: 'Rating', value: `${profile.rating}/5.0`, icon: 'fa-star', color: 'bg-amber-50 text-amber-600' },
    { label: 'Earnings', value: `$${profile.earnings.toFixed(2)}`, icon: 'fa-hand-holding-dollar', color: 'bg-green-50 text-green-600' },
    { label: 'Exp', value: 'Lv. 12', icon: 'fa-medal', color: 'bg-purple-50 text-purple-600' },
  ];

  const badges = [
    { name: 'Speed Demon', icon: 'fa-bolt', desc: 'Average delivery < 15 mins' },
    { name: 'Rain Rider', icon: 'fa-cloud-rain', desc: '100 deliveries in bad weather' },
    { name: 'Five Star', icon: 'fa-star', desc: '50 consecutive 5-star ratings' },
    { name: 'Eco Carrier', icon: 'fa-leaf', desc: 'Efficient fuel consumption' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-indigo-600 relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <i className="fa-solid fa-person-biking text-8xl text-white"></i>
          </div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex items-end justify-between">
            <div className="w-32 h-32 rounded-3xl border-4 border-white overflow-hidden shadow-xl bg-gray-100">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div className="pb-2">
              <Button variant="outline" size="sm" className="gap-2">
                <i className="fa-solid fa-pen"></i> Edit Profile
              </Button>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900">{profile.name}</h2>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <i className="fa-solid fa-motorcycle"></i>
              <span className="font-medium">{profile.bikeModel}</span>
              <span className="mx-2">•</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">VETERAN</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <i className={`fa-solid ${stat.icon}`}></i>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <h4 className="text-xl font-black text-gray-900">{stat.value}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <i className="fa-solid fa-award text-indigo-600"></i> Achievements
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors cursor-default group">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${badge.icon} text-xl`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{badge.name}</h4>
                  <p className="text-xs text-gray-500">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <i className="fa-solid fa-shield-halved text-indigo-600"></i> Safety Log
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <p className="text-sm font-bold text-emerald-800">Perfect Safety Score</p>
              <p className="text-xs text-emerald-600 mt-1">You haven't had a reported incident in 340 deliveries. Keep it up!</p>
            </div>
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Maintenance</h5>
              <div className="flex justify-between items-center text-sm py-2 border-b">
                <span className="text-gray-600">Oil Change</span>
                <span className="text-gray-400">12 days ago</span>
              </div>
              <div className="flex justify-between items-center text-sm py-2 border-b">
                <span className="text-gray-600">Tire Rotation</span>
                <span className="text-gray-400">1 month ago</span>
              </div>
              <div className="flex justify-between items-center text-sm py-2 border-b">
                <span className="text-gray-600">Brake Check</span>
                <span className="text-gray-400">3 months ago</span>
              </div>
            </div>
            <Button variant="secondary" fullWidth className="mt-4">
              Log Maintenance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
