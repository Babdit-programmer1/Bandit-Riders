
import React from 'react';
import { Delivery, DeliveryStatus } from '../types';
import { formatNaira } from '../utils/fareCalculator';

interface DashboardProps {
  deliveries: Delivery[];
}

const Dashboard: React.FC<DashboardProps> = ({ deliveries }) => {
  const activeDeliveries = deliveries.filter(d => 
    d.status !== DeliveryStatus.DELIVERED && 
    d.status !== DeliveryStatus.CANCELLED
  );
  const completedToday = deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).length;
  const currentEarnings = deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Tasks', val: activeDeliveries.length, icon: 'fa-box-archive', color: 'indigo' },
          { label: 'Fulfillment', val: completedToday, icon: 'fa-flag-checkered', color: 'emerald' },
          { label: 'Total Pay', val: formatNaira(currentEarnings), icon: 'fa-wallet', color: 'slate' },
          { label: 'Precision', val: '99.8%', icon: 'fa-shield-heart', color: 'indigo' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-100 group">
            <div className={`w-12 h-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
              <i className={`fa-solid ${stat.icon} text-lg`}></i>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="bg-slate-950 rounded-[3rem] p-10 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tighter">System Telemetry</h2>
            <p className="text-slate-400 text-sm font-medium">Real-time network data for optimal fleet performance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Peak Demand", content: "Surge zones active in Central Hub.", icon: "fa-chart-line" },
            { title: "Grid Status", content: "Main arteries clear for transit.", icon: "fa-bolt" },
            { title: "Weather Log", content: "Optimal visibility maintained.", icon: "fa-sun" }
          ].map((insight, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <i className={`fa-solid ${insight.icon} text-indigo-400`}></i>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">{insight.title}</h4>
              </div>
              <p className="text-slate-400 text-xs font-bold leading-relaxed">{insight.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
