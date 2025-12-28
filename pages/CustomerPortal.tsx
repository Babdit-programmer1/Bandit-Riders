
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delivery, DeliveryStatus, Priority, BookingEstimate, CustomerView } from '../types';
import { INITIAL_DELIVERIES } from '../data/mockData';
import { authService } from '../services/authService';
import Button from '../components/Button';
import MapMock from '../components/MapMock';
import StatusBadge from '../components/StatusBadge';
import { calculateFare } from '../utils/fareCalculator';

const CustomerPortal: React.FC<{ onAddBooking: any, myBookings: any }> = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [currentView, setCurrentView] = useState<CustomerView>('landing');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [items, setItems] = useState('');
  const [estimate, setEstimate] = useState<BookingEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingDelivery, setTrackingDelivery] = useState<Delivery | null>(null);
  
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem('bandit_deliveries');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });

  useEffect(() => {
    localStorage.setItem('bandit_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleGetQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const distance = (Math.random() * 10 + 2).toFixed(1);
      const distNum = parseFloat(distance);
      const durNum = Math.round(distNum * 3 + 5);
      const breakdown = calculateFare(distNum, durNum);

      setEstimate({
        price: breakdown.total,
        distance: `${distance} km`,
        duration: `${durNum} mins`,
        reasoning: "Calculated based on city grid optimization.",
        breakdown: breakdown
      });
      setIsLoading(false);
    }, 800);
  };

  const handleConfirm = () => {
    if (!estimate) return;
    const newBooking: Delivery = {
      id: `BR-${Math.floor(Math.random() * 9000) + 1000}`,
      customerName: user?.name || 'Guest',
      pickupAddress: pickup,
      address: dropoff,
      items: items.split(','),
      status: DeliveryStatus.PENDING,
      priority: Priority.MEDIUM,
      orderTime: new Date().toLocaleTimeString(),
      distance: estimate.distance,
      estTime: estimate.duration,
      price: estimate.price,
      progress: 0,
      // Added missing history property
      history: [{ status: DeliveryStatus.PENDING, time: new Date().toLocaleTimeString() }]
    };
    setDeliveries([newBooking, ...deliveries]);
    setTrackingDelivery(newBooking);
    setCurrentView('tracking');
    setEstimate(null);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <header className="bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-bolt-auto"></i>
          </div>
          <span className="text-xl font-black tracking-tighter">BANDIT<span className="text-slate-400">RIDERS</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender Account</span>
            <span className="text-sm font-black text-slate-900">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="text-sm font-bold text-slate-400 hover:text-red-600">Logout</button>
          <img src={user?.avatar} className="w-10 h-10 rounded-xl ring-2 ring-slate-50" />
        </div>
      </header>

      <main className="container mx-auto px-6 pt-10 pb-20">
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
          <nav className="flex justify-center mb-12">
            <div className="glass p-1.5 rounded-2xl shadow-premium flex items-center gap-1">
              <button onClick={() => setCurrentView('landing')} className={`px-8 py-2.5 rounded-xl text-sm font-bold ${currentView === 'landing' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Overview</button>
              <button onClick={() => setCurrentView('booking')} className={`px-8 py-2.5 rounded-xl text-sm font-bold ${currentView === 'booking' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Book Now</button>
              <button onClick={() => setCurrentView('tracking')} className={`px-8 py-2.5 rounded-xl text-sm font-bold ${currentView === 'tracking' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Track</button>
            </div>
          </nav>

          {currentView === 'booking' && (
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-[40px] shadow-premium border border-slate-100">
              {!estimate ? (
                <form onSubmit={handleGetQuote} className="space-y-8">
                  <h2 className="text-3xl font-black text-slate-900">New Dispatch</h2>
                  <div className="space-y-4">
                    <input type="text" placeholder="Pickup Address" className="w-full p-5 bg-slate-50 rounded-2xl border-none" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
                    <input type="text" placeholder="Drop-off Address" className="w-full p-5 bg-slate-50 rounded-2xl border-none" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required />
                    <input type="text" placeholder="Package Contents (e.g. Laptop, Flowers)" className="w-full p-5 bg-slate-50 rounded-2xl border-none" value={items} onChange={(e) => setItems(e.target.value)} required />
                  </div>
                  <Button type="submit" fullWidth size="lg" isLoading={isLoading} className="py-6 rounded-2xl font-black">Get Estimate</Button>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="bg-slate-900 p-8 rounded-3xl text-white">
                    <p className="text-xs font-black text-indigo-400 mb-1 uppercase">Guaranteed Quote</p>
                    <p className="text-5xl font-black">${estimate.price.toFixed(2)}</p>
                    <p className="mt-4 text-slate-400">{estimate.distance} • {estimate.duration}</p>
                  </div>
                  <Button onClick={handleConfirm} fullWidth size="lg" className="py-6 rounded-2xl font-black">Confirm Dispatch</Button>
                  <button onClick={() => setEstimate(null)} className="w-full text-center text-slate-400 font-bold">Cancel</button>
                </div>
              )}
            </div>
          )}

          {currentView === 'tracking' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-xl font-black text-slate-900">Recent Shipments</h3>
                {deliveries.filter(d => d.customerName === user?.name).map(d => (
                  <button key={d.id} onClick={() => setTrackingDelivery(d)} className={`w-full text-left p-6 rounded-3xl border-2 transition-all ${trackingDelivery?.id === d.id ? 'border-indigo-600 bg-white' : 'border-transparent bg-white shadow-sm'}`}>
                    <p className="font-black text-slate-900">{d.address}</p>
                    <StatusBadge type="status" value={d.status} />
                  </button>
                ))}
              </div>
              <div className="lg:col-span-8">
                {trackingDelivery ? (
                  <div className="bg-white p-8 rounded-[40px] shadow-premium space-y-6">
                    <h3 className="text-2xl font-black">Live Tracker: {trackingDelivery.id}</h3>
                    <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden">
                      <MapMock progress={trackingDelivery.progress} status={trackingDelivery.status} />
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[400px] flex items-center justify-center bg-slate-50 border-2 border-dashed rounded-[40px]">
                    <p className="text-slate-400 font-black uppercase">Select an order to track</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'landing' && (
            <div className="text-center py-20 space-y-8">
              <h1 className="text-6xl font-black text-slate-900 leading-tight">Elite Shipping<br/><span className="gradient-text">Simplified.</span></h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">The most reliable dispatch network for urban hubs. Your world, delivered by Bandits.</p>
              <Button size="lg" className="px-12 py-6 rounded-2xl text-xl font-black" onClick={() => setCurrentView('booking')}>Start Shipping</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerPortal;
