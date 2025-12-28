
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Delivery, DeliveryStatus, User } from '../types';
import MapMock from '../components/MapMock';
import Button from '../components/Button';
import { formatNaira } from '../utils/fareCalculator';

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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-8 bg-white p-4 rounded-[3.5rem] shadow-premium border border-slate-100 h-[600px] relative overflow-hidden">
          <MapMock 
            progress={simProgress} 
            status={delivery.status} 
            distance={delivery.distance}
            estTime={delivery.estTime}
            items={delivery.items}
          />
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-premium border border-slate-100 relative overflow-hidden">
            <div className="mb-10">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 block">{delivery.id}</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6">{delivery.status}</h2>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-1000" 
                  style={{ width: `${simProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Logistics Origin</p>
                <p className="text-sm font-bold text-slate-800">{delivery.pickupAddress}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Destination</p>
                <p className="text-sm font-bold text-slate-800">{delivery.address}</p>
              </div>
              <div className="pt-8 border-t border-slate-50 flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Units</p>
                   <p className="text-lg font-black text-slate-900">{delivery.items.length} Package(s)</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settlement</p>
                   <p className="text-3xl font-black text-indigo-600 tracking-tighter">{formatNaira(delivery.price)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white shadow-3xl">
             {delivery.riderName ? (
               <div className="space-y-8">
                 <div className="flex items-center gap-6">
                   <img src={delivery.riderAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Rider"} className="w-20 h-20 rounded-3xl border-2 border-indigo-600 object-cover" alt="Pilot" />
                   <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Assigned Pilot</p>
                     <h4 className="text-2xl font-black">{delivery.riderName}</h4>
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Grade: Elite</p>
                   </div>
                 </div>
                 <Button fullWidth variant="outline" className="py-5 rounded-2xl border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5">
                   Secure Channel
                 </Button>
               </div>
             ) : (
               <div className="text-center py-6">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 animate-pulse">Scanning Grid for Rider...</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
