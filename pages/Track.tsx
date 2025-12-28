
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Delivery, DeliveryStatus, User } from '../types';
import MapMock from '../components/MapMock';
import Button from '../components/Button';

const Track: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [simProgress, setSimProgress] = useState(0);
  const [riderInfo, setRiderInfo] = useState<User | null>(null);

  useEffect(() => {
    const sync = () => {
      const saved = JSON.parse(localStorage.getItem('bandit_deliveries') || '[]');
      const d = saved.find((item: Delivery) => item.id === id);
      if (!d) return navigate('/deliveries');
      setDelivery(d);
      setSimProgress(d.progress);

      // Fetch rider detailed info from users DB
      if (d.riderName) {
        const users = JSON.parse(localStorage.getItem('bandit_users_db') || '[]');
        const rider = users.find((u: User) => u.name === d.riderName);
        if (rider) setRiderInfo(rider);
      }
    };

    sync();
    const interval = setInterval(sync, 2000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  useEffect(() => {
    if (delivery?.status === DeliveryStatus.IN_TRANSIT && simProgress < 100) {
      const sim = setInterval(() => {
        setSimProgress(prev => Math.min(prev + 0.3, 98));
      }, 1000);
      return () => clearInterval(sim);
    }
  }, [delivery?.status, simProgress]);

  if (!delivery) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#f8fafc] px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Radar Map View */}
        <div className="lg:col-span-8 bg-white p-4 rounded-[3.5rem] shadow-premium border border-slate-100 h-[650px] relative overflow-hidden group">
          <MapMock 
            progress={simProgress} 
            status={delivery.status} 
            distance={delivery.distance}
            estTime={delivery.estTime}
            items={delivery.items}
          />
        </div>

        {/* Tracking Details Card */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-premium border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-16 -mt-16 opacity-50"></div>
            
            <div className="mb-10 relative z-10">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3 block">{delivery.id}</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">{delivery.status}</h2>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-1000 ease-out" 
                  style={{ width: `${simProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-10 relative z-10">
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-100"></div>
                  <div className="w-0.5 flex-1 bg-slate-100 my-2"></div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup Location</p>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{delivery.pickupAddress}</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${delivery.status === DeliveryStatus.DELIVERED ? 'bg-emerald-500 ring-emerald-100' : 'bg-slate-200'} ring-4`}></div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dropoff Destination</p>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{delivery.address}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-slate-50 flex justify-between items-center">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items</p>
                  <p className="text-lg font-black text-slate-900">{delivery.items.length} Packages</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Fee</p>
                  <p className="text-2xl font-black text-indigo-600">${delivery.price.toFixed(2)}</p>
               </div>
            </div>
          </div>

          {/* Rider Profile & Trust Interaction */}
          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden">
             {delivery.riderName ? (
               <div className="space-y-8 relative z-10">
                 <div className="flex items-center gap-6">
                   <img src={delivery.riderAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Rider"} className="w-20 h-20 rounded-[1.5rem] border-2 border-indigo-500 shadow-xl" alt="Rider" />
                   <div>
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Elite Dispatcher</p>
                     <h4 className="text-2xl font-black mb-1">{delivery.riderName}</h4>
                     <div className="flex gap-1 text-amber-400">
                        <i className="fa-solid fa-star text-[10px]"></i>
                        <i className="fa-solid fa-star text-[10px]"></i>
                        <i className="fa-solid fa-star text-[10px]"></i>
                        <i className="fa-solid fa-star text-[10px]"></i>
                        <i className="fa-solid fa-star text-[10px]"></i>
                        <span className="text-[10px] font-black text-white ml-2 uppercase">4.96 Rating</span>
                     </div>
                   </div>
                 </div>

                 {/* Credentials Badges for Senders to see */}
                 <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified Credentials</p>
                   <div className="flex flex-wrap gap-2">
                     {riderInfo?.credentials?.map(cred => (
                       <div key={cred.id} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                         <i className={`fa-solid ${cred.icon} text-indigo-400 text-[10px]`}></i>
                         <span className="text-[9px] font-black uppercase tracking-widest">{cred.label}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 <Button fullWidth variant="outline" className="py-5 rounded-2xl border-white/10 hover:bg-white/5 text-xs font-black uppercase tracking-widest">
                   Contact Dispatcher
                 </Button>
               </div>
             ) : (
               <div className="text-center py-6 space-y-4">
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                   <i className="fa-solid fa-satellite-dish text-indigo-400"></i>
                 </div>
                 <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Searching for available riders</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
