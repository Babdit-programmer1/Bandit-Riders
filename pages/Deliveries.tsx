
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delivery } from '../types';
import { authService } from '../services/authService';
import StatusBadge from '../components/StatusBadge';
import { formatNaira } from '../utils/fareCalculator';

const Deliveries: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bandit_deliveries') || '[]');
    setDeliveries(saved.filter((d: Delivery) => d.customerName === user?.name));
  }, [user]);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#f8fafc] px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">My Dispatch</h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Registry: {deliveries.length} entries</p>
          </div>
          <button onClick={() => navigate('/order')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all">New Order</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deliveries.length > 0 ? (
            deliveries.map(d => (
              <div 
                key={d.id} 
                onClick={() => navigate(`/track/${d.id}`)}
                className="bg-white p-8 rounded-[3rem] shadow-premium border border-slate-100 hover:shadow-3xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-8">
                  <StatusBadge type="status" value={d.status} />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{d.id}</span>
                </div>
                
                <div className="mb-10">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-4">{d.address}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <i className="fa-solid fa-clock"></i>
                    <span>Log {d.orderTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <span className="text-2xl font-black text-slate-900">{formatNaira(d.price)}</span>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <i className="fa-solid fa-arrow-right-long"></i>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border border-slate-100 shadow-premium">
              <i className="fa-solid fa-satellite-dish text-6xl text-slate-100 mb-6"></i>
              <h3 className="text-2xl font-black text-slate-300">Scanning Records...</h3>
              <button onClick={() => navigate('/order')} className="mt-8 text-indigo-600 font-black uppercase tracking-widest text-xs hover:underline">Start Dispatch</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deliveries;
