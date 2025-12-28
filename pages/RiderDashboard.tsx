
import React, { useState, useEffect } from 'react';
import { Delivery, DeliveryStatus, User } from '../types';
import { authService } from '../services/authService';
import { getAIInsights } from '../services/geminiService';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import MapMock from '../components/MapMock';
import { formatNaira } from '../utils/fareCalculator';

const RiderDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editVehicle, setEditVehicle] = useState(user?.vehicleType || '');
  const [editPlate, setEditPlate] = useState(user?.plateNumber || '');

  useEffect(() => {
    const syncData = () => {
      const saved = JSON.parse(localStorage.getItem('bandit_deliveries') || '[]');
      setDeliveries(saved);
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsOnline(currentUser.isAvailable !== false);
      }
    };
    syncData();
    const interval = setInterval(syncData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchInsights = async () => {
      if (deliveries.length > 0) {
        setIsInsightsLoading(true);
        try {
          const aiData = await getAIInsights(deliveries);
          setInsights(aiData);
        } catch (err) {
          console.error("Telemetry sync failed");
        } finally {
          setIsInsightsLoading(false);
        }
      }
    };
    fetchInsights();
  }, [deliveries.length === 0]);

  const handleSaveProfile = () => {
    authService.updateUser({
      name: editName,
      vehicleType: editVehicle,
      plateNumber: editPlate,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${editName}`
    });
    setUser(authService.getCurrentUser());
    setIsEditingProfile(false);
  };

  const updateStatus = (id: string, newStatus: DeliveryStatus) => {
    let progress = 0;
    switch(newStatus) {
      case DeliveryStatus.ACCEPTED: progress = 5; break;
      case DeliveryStatus.PICKED_UP: progress = 25; break;
      case DeliveryStatus.IN_PROGRESS: progress = 40; break;
      case DeliveryStatus.IN_TRANSIT: progress = 50; break;
      case DeliveryStatus.DELIVERED: progress = 100; break;
      default: progress = 0;
    }

    const updated = deliveries.map(d => {
      if (d.id === id) {
        return { 
          ...d, 
          status: newStatus, 
          progress, 
          riderName: user?.name,
          riderAvatar: user?.avatar,
          riderPlate: user?.plateNumber,
          history: [...d.history, { status: newStatus, time: new Date().toLocaleTimeString() }]
        };
      }
      return d;
    });

    setDeliveries(updated);
    localStorage.setItem('bandit_deliveries', JSON.stringify(updated));
  };

  const activeJobs = deliveries.filter(d => 
    d.status !== DeliveryStatus.DELIVERED && d.status !== DeliveryStatus.CANCELLED
  );

  const totalEarnings = deliveries
    .filter(d => d.status === DeliveryStatus.DELIVERED && d.riderName === user?.name)
    .reduce((sum, d) => sum + d.price, 0);

  const currentActiveJob = activeJobs.find(j => j.status !== DeliveryStatus.PENDING);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#f8fafc] px-6">
      {isEditingProfile && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-3xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Pilot Configuration</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity</label>
                <input type="text" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold outline-none" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vessel Type</label>
                <input type="text" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold outline-none" value={editVehicle} onChange={(e) => setEditVehicle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry</label>
                <input type="text" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold outline-none" value={editPlate} onChange={(e) => setEditPlate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button variant="outline" className="rounded-2xl py-4 font-black uppercase text-xs tracking-widest" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                <Button className="rounded-2xl py-4 bg-slate-900 font-black uppercase text-xs tracking-widest" onClick={handleSaveProfile}>Update Hub</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-premium border border-slate-100 relative overflow-hidden">
            <div className={`absolute top-0 inset-x-0 h-28 ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'} transition-colors`}></div>
            <button onClick={() => setIsEditingProfile(true)} className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-xl flex items-center justify-center text-white transition-all z-20">
              <i className="fa-solid fa-gear"></i>
            </button>
            <div className="relative z-10 pt-4 text-center">
              <img src={user?.avatar} className="w-28 h-28 rounded-[2.5rem] border-4 border-white shadow-2xl mx-auto mb-6 object-cover" alt="Profile" />
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{user?.name}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 mb-8">{user?.plateNumber} • {user?.vehicleType}</p>
              
              <div onClick={() => { setIsOnline(!isOnline); authService.updateUser({ isAvailable: !isOnline }); }} className={`flex items-center justify-between p-6 rounded-3xl border-2 cursor-pointer transition-all ${isOnline ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                <span className="text-xs font-black uppercase tracking-widest">{isOnline ? 'Network Online' : 'Network Offline'}</span>
                <div className={`w-12 h-6 rounded-full relative ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isOnline ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white shadow-3xl">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Current Session Earnings</p>
            <h4 className="text-5xl font-black tracking-tighter">{formatNaira(totalEarnings)}</h4>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-premium border border-slate-100">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Fleet Telemetry</h3>
               <i className="fa-solid fa-tower-broadcast text-slate-300"></i>
             </div>
             <div className="space-y-6">
                {isInsightsLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                  </div>
                ) : insights.length > 0 ? (
                  insights.map((insight, i) => (
                    <div key={i} className="group">
                       <div className="flex items-center gap-3 mb-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${insight.category === 'safety' ? 'bg-rose-500' : 'bg-slate-300'}`}></span>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{insight.title}</p>
                       </div>
                       <p className="text-xs font-bold text-slate-600 leading-relaxed">
                         {insight.content}
                       </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-bold text-slate-400 italic">Scanning grid for mission data...</p>
                )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <div className="flex justify-between items-end">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Command Center</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{deliveries.length} Records Logged</p>
          </div>
          
          <div className="space-y-6">
            {activeJobs.length > 0 ? (
              activeJobs.map(job => (
                <div key={job.id} className="bg-white p-10 rounded-[3.5rem] shadow-premium border border-slate-100 animate-in slide-in-from-right-4 duration-500">
                  <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.id}</span>
                        <StatusBadge type="status" value={job.status} />
                      </div>
                      <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{job.address}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase">Fulfillment: {job.pickupAddress}</p>
                    </div>
                    <div className="lg:w-64 bg-slate-50 p-8 rounded-[2.5rem] text-center border border-slate-100 flex flex-col justify-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee</p>
                      <p className="text-3xl font-black text-slate-900 mb-6">{formatNaira(job.price)}</p>
                      <div className="space-y-2">
                        {job.status === DeliveryStatus.PENDING && <Button fullWidth onClick={() => updateStatus(job.id, DeliveryStatus.ACCEPTED)} className="py-4 bg-slate-900">Accept Request</Button>}
                        {job.status === DeliveryStatus.ACCEPTED && <Button fullWidth onClick={() => updateStatus(job.id, DeliveryStatus.PICKED_UP)} className="py-4 bg-indigo-600">Package Received</Button>}
                        {job.status === DeliveryStatus.PICKED_UP && <Button fullWidth onClick={() => updateStatus(job.id, DeliveryStatus.IN_TRANSIT)} className="py-4 bg-purple-600">Begin Transit</Button>}
                        {job.status === DeliveryStatus.IN_TRANSIT && <Button fullWidth onClick={() => updateStatus(job.id, DeliveryStatus.DELIVERED)} className="py-4 bg-emerald-600 font-black">Complete Fulfillment</Button>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-32 text-center bg-white rounded-[4rem] border border-slate-100 shadow-premium">
                <i className="fa-solid fa-radar text-6xl text-slate-100 mb-6"></i>
                <h3 className="text-2xl font-black text-slate-300">Scanning Lagos Grid...</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4">Operational Status: Ready</p>
              </div>
            )}
          </div>
          {currentActiveJob && (
            <div className="bg-white p-10 rounded-[3.5rem] shadow-premium h-[500px]">
              <MapMock status={currentActiveJob.status} progress={currentActiveJob.progress} distance={currentActiveJob.distance} estTime={currentActiveJob.estTime} items={currentActiveJob.items} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
