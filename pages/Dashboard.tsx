
import React from 'react';
import { Delivery, DeliveryStatus } from '../types';

interface DashboardProps {
  deliveries: Delivery[];
}

const Dashboard: React.FC<DashboardProps> = ({ deliveries }) => {
  const activeDeliveries = deliveries.filter(d => d.status === DeliveryStatus.PENDING || d.status === DeliveryStatus.IN_PROGRESS);
  const completedToday = deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).length;
  const currentEarnings = deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Rider Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pending Tasks', val: activeDeliveries.length, icon: 'fa-box-archive', color: 'indigo' },
          { label: 'Daily Goals', val: completedToday, icon: 'fa-flag-checkered', color: 'emerald' },
          { label: 'Current Session', val: `$${currentEarnings.toFixed(2)}`, icon: 'fa-wallet', color: 'orange' },
          { label: 'Reliability', val: '99.8%', icon: 'fa-shield-heart', color: 'rose' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-premium border border-slate-100 group hover:-translate-y-1 transition-all duration-300">
            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${stat.icon} text-xl`}></i>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* Announcements / System Hub (Replaced AI Hub) */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 opacity-[0.03] rounded-full blur-[100px] -mr-40 -mt-40"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/20">
              <i className="fa-solid fa-satellite-dish"></i>
              System Dispatch Active
            </div>
            <h2 className="text-4xl font-black text-white">Elite Courier Insights</h2>
            <p className="text-slate-400 text-lg max-w-2xl font-medium">Real-time network telemetry to assist with your daily shift objectives and route efficiency.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { title: "Peak Demand", content: "High volume detected in Central Hub. Surge pricing active for the next 45 minutes.", icon: "fa-chart-line", category: "earnings" },
            { title: "Route Safety", content: "Visibility is reduced on Northern routes due to weather. Maintain standard safety distance.", icon: "fa-cloud-showers-heavy", category: "safety" },
            { title: "Fast Track", content: "Traffic optimization successful. Main arteries are clear for express deliveries.", icon: "fa-bolt", category: "efficiency" }
          ].map((insight, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/10 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                  <i className={`fa-solid ${insight.icon}`}></i>
                </div>
                <h4 className="text-xl font-black text-white">{insight.title}</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-colors">{insight.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Targets and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <i className="fa-solid fa-bullseye text-indigo-600"></i> Active Objectives
          </h3>
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Shift Completion</span>
                <span className="text-sm font-black text-indigo-600">12 / 15 Orders</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 p-1 shadow-inner">
                <div className="bg-indigo-600 h-2 rounded-full w-[80%] transition-all duration-1000"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Earning Benchmark</span>
                <span className="text-sm font-black text-emerald-600">$120.50 / $150.00</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 p-1 shadow-inner">
                <div className="bg-emerald-500 h-2 rounded-full w-[75%] transition-all duration-1000"></div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <div className="flex items-center gap-6 bg-amber-50 p-6 rounded-[2rem] border border-amber-100">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
                </div>
                <p className="text-sm text-amber-900 font-bold leading-relaxed">
                  Traffic pattern changes detected downtown. Adjusting estimated times for your pending orders.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-8">Shift History</h3>
          <div className="space-y-4">
            {deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).length > 0 ? (
              deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).slice(0, 4).map(d => (
                <div key={d.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{d.customerName}</p>
                      <p className="text-xs font-bold text-slate-400 truncate max-w-[150px]">{d.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">+${d.price.toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{d.orderTime}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <i className="fa-solid fa-history text-4xl text-slate-100 mb-4"></i>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No recent completions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
