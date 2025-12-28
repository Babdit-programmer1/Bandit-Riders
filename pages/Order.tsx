
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delivery, DeliveryStatus, Priority, BookingEstimate } from '../types';
import { authService } from '../services/authService';
import { walletService } from '../utils/walletService';
import { getBookingEstimate } from '../services/geminiService';
import Button from '../components/Button';
import FareBreakdown from '../components/FareBreakdown';
import RiderPopupMap from '../components/RiderPopupMap';
import { formatNaira } from '../utils/fareCalculator';

const Order: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [items, setItems] = useState('');
  const [estimate, setEstimate] = useState<BookingEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRiderMap, setShowRiderMap] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    setWalletBalance(walletService.getWallet().balance);
  }, []);

  const handleGetQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentError(false);
    
    try {
      const aiEstimate = await getBookingEstimate(pickup, dropoff, items);
      setEstimate(aiEstimate);
    } catch (err) {
      console.error("System calculation failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRiderFound = (rider: any) => {
    if (!estimate) return;
    
    const deliveryId = `BR-${Math.floor(Math.random() * 8999) + 1000}`;
    const paymentSuccess = walletService.payForDelivery(estimate.price, deliveryId);
    
    if (!paymentSuccess) {
      setPaymentError(true);
      setShowRiderMap(false);
      return;
    }

    const savedDeliveries = JSON.parse(localStorage.getItem('bandit_deliveries') || '[]');
    const newBooking: Delivery = {
      id: deliveryId,
      customerName: user?.name || 'Guest',
      pickupAddress: pickup,
      address: dropoff,
      items: items.split(',').map(i => i.trim()),
      status: DeliveryStatus.PENDING,
      priority: Priority.MEDIUM,
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      distance: estimate.distance,
      estTime: estimate.duration,
      price: estimate.price,
      fareBreakdown: estimate.breakdown,
      riderName: rider.name,
      riderPlate: rider.plate,
      progress: 0,
      history: [{ status: DeliveryStatus.PENDING, time: new Date().toLocaleTimeString() }]
    };
    
    localStorage.setItem('bandit_deliveries', JSON.stringify([newBooking, ...savedDeliveries]));
    navigate('/deliveries');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#f8fafc] px-6">
      <RiderPopupMap isOpen={showRiderMap} onRiderSelected={onRiderFound} />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 bg-white p-12 rounded-[3.5rem] shadow-premium border border-slate-100 relative overflow-hidden">
          {!estimate ? (
            <form onSubmit={handleGetQuote} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div className="mb-12">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Service Request</span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Express Dispatch</h2>
                <p className="text-slate-400 font-medium text-lg leading-relaxed">Secure, network-optimized logistics for premium cargo.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Origin</label>
                  <input type="text" required placeholder="Select Pickup Point" className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800 outline-none" value={pickup} onChange={(e) => setPickup(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                  <input type="text" required placeholder="Select Drop-off Point" className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-purple-600 focus:bg-white transition-all font-bold text-slate-800 outline-none" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargo Details</label>
                  <input type="text" required placeholder="Items for dispatch" className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800 outline-none" value={items} onChange={(e) => setItems(e.target.value)} />
                </div>
              </div>

              <Button type="submit" fullWidth size="lg" isLoading={isLoading} className="py-7 rounded-[2rem] text-xl font-black bg-slate-900 shadow-2xl hover:bg-indigo-600">
                Generate Dispatch Quote
              </Button>
            </form>
          ) : (
            <div className="space-y-10 animate-in zoom-in-95 duration-500 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Service Quote</h2>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Ref: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                </div>
                <button onClick={() => { setEstimate(null); setPaymentError(false); }} className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                  <i className="fa-solid fa-rotate-left"></i>
                </button>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-solid fa-shield-check text-indigo-600"></i>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Analysis</span>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                  {estimate.reasoning}
                </p>
              </div>

              {paymentError && (
                <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-4">
                  <h4 className="text-xl font-black text-red-900">Insufficient Credits</h4>
                  <p className="text-sm font-medium text-red-700">Top up your network wallet to authorize this dispatch.</p>
                  <Button variant="danger" size="md" className="rounded-xl px-8" onClick={() => navigate('/wallet')}>Fund Wallet</Button>
                </div>
              )}

              <FareBreakdown data={estimate.breakdown} />

              <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-3xl">
                <div className="flex items-center gap-4 mb-8 opacity-60">
                  <i className="fa-solid fa-lock text-indigo-400"></i>
                  <p className="text-xs font-bold">Encrypted wallet settlement active for this session.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="ghost" size="lg" className="rounded-[2rem] text-slate-400 hover:bg-white/5" onClick={() => setEstimate(null)}>Reset</Button>
                  <Button onClick={() => setShowRiderMap(true)} size="lg" className="rounded-[2rem] bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">Secure Rider</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="bg-white p-10 rounded-[3.5rem] shadow-premium border border-slate-100">
             <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest">Dispatch Credit</h3>
             <div className="bg-indigo-50 p-8 rounded-3xl flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Current Balance</p>
                   <p className="text-3xl font-black text-indigo-900">{formatNaira(walletBalance)}</p>
                </div>
                <button onClick={() => navigate('/wallet')} className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform">
                  <i className="fa-solid fa-plus"></i>
                </button>
             </div>
           </div>
           
           <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-premium text-white relative overflow-hidden">
             <h3 className="text-xl font-black mb-4">Elite Protocol</h3>
             <p className="text-slate-400 text-sm font-medium leading-relaxed">
               All dispatches are monitored via real-time telemetry. Our verified pilots are bound by the Bandit Excellence Charter, ensuring zero-loss fulfillment.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
