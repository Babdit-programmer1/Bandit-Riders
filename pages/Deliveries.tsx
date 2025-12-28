
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delivery } from '../types';
import { authService } from '../services/authService';
import StatusBadge from '../components/StatusBadge';

const Deliveries: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bandit_deliveries') || '[]');
    setDeliveries(saved.filter((d: Delivery) => d.customerName === user?.name));
  }, [user]);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">My Dispatch</h2>
            <p className="text-slate-400 font-medium uppercase tracking-widest text-[10px]">Tracking {deliveries.length} active orders</p>
          </div>
          <button onClick={() => navigate('/order')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all">New Order</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deliveries.length > 0 ? (
            deliveries.map(d => (
              <div 
                key={d.id} 
                onClick={() => navigate(`/track/${d.id}`)}
                className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{d.id}</span>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{d.address}</h3>
                  </div>
                  <StatusBadge type="status" value={d.status} />
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                    <i className="fa-solid fa-clock w-4"></i>
                    <span>Ordered at {d.orderTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                    <i className="fa-solid fa-box-open w-4"></i>
                    <span>{d.items.length} Package(s)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-2xl font-black text-slate-900">${d.price.toFixed(2)}</span>
                  <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                    Live Track <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <i className="fa-solid fa-satellite-dish text-6xl text-slate-200 mb-6"></i>
              <h3 className="text-2xl font-black text-slate-400">No active deliveries found.</h3>
              <p className="text-slate-400 font-medium mb-8">Start your first shipment today with Bandit Riders.</p>
              <button onClick={() => navigate('/order')} className="text-indigo-600 font-black uppercase tracking-widest text-sm hover:underline">Book Your First Rider</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deliveries;
