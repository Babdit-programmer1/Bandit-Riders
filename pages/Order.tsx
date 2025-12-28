
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delivery, DeliveryStatus, Priority, BookingEstimate } from '../types';
import { authService } from '../services/authService';
import { walletService } from '../utils/walletService';
import Button from '../components/Button';
import FareBreakdown from '../components/FareBreakdown';
import RiderPopupMap from '../components/RiderPopupMap';
import { calculateFare, formatNaira } from '../utils/fareCalculator';

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
    
    // Simulate API logic
    setTimeout(() => {
      const dist = parseFloat((Math.random() * 8 + 1).toFixed(1));
      const dur = Math.round(dist * 4 + 5);
      const breakdown = calculateFare(dist, dur);
      
      setEstimate({
        price: breakdown.total,
        distance: `${dist} km`,
        duration: `${dur} mins`,
        reasoning: "Dynamic rate based on Lagos grid telemetry.",
        breakdown
      });
      setIsLoading(false);
    }, 1200);
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
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3 block">Service Request</span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Express Dispatch</h2>
                <p className="text-slate-400 font-medium text-lg leading-relaxed">Fast, secure, and smart logistics for Lagos.</p>
              </div>

              <div className="space-y-8">
                <input type="text" required placeholder="Pickup Location" className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800" value={pickup} onChange={(e) => setPickup(e.target.value)} />
                <input type="text" required placeholder="Destination" className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-purple-600 focus:bg-white transition-all font-bold text-slate-800" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
                <input type="text" required placeholder="What are we delivering?" className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800" value={items} onChange={(e) => setItems(e.target.value)} />
              </div>

              <Button type="submit" fullWidth size="lg" isLoading={isLoading} className="py-7 rounded-[2rem] text-xl font-black bg-indigo-600 shadow-2xl">
                Get Quote (₦)
              </Button>
            </form>
          ) : (
            <div className="space-y-10 animate-in zoom-in-95 duration-500 relative z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Your Quote</h2>
                <button onClick={() => { setEstimate(null); setPaymentError(false); }} className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                  <i className="fa-solid fa-rotate-left"></i>
                </button>
              </div>

              {paymentError && (
                <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-4">
                  <h4 className="text-xl font-black text-red-900">Insufficient Funds</h4>
                  <p className="text-sm font-medium text-red-700">Top up your wallet to proceed.</p>
                  <Button variant="danger" size="md" className="rounded-xl px-8" onClick={() => navigate('/wallet')}>Fund Wallet</Button>
                </div>
              )}

              <FareBreakdown data={estimate.breakdown} />

              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-3xl">
                <div className="flex items-center gap-4 mb-6">
                  <i className="fa-solid fa-wallet text-indigo-400 text-xl"></i>
                  <p className="text-xs font-bold text-slate-400">Payment will be deducted from your Wallet Balance.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" size="lg" className="rounded-[2rem] border-white/10 text-slate-400" onClick={() => setEstimate(null)}>Cancel</Button>
                  <Button onClick={() => setShowRiderMap(true)} size="lg" className="rounded-[2rem] bg-indigo-600">Find Rider</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="bg-white p-10 rounded-[3.5rem] shadow-premium border border-slate-100">
             <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest">Wallet Credits</h3>
             <div className="bg-indigo-50 p-8 rounded-3xl flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Available Balance</p>
                   <p className="text-3xl font-black text-indigo-900">{formatNaira(walletBalance)}</p>
                </div>
                <button onClick={() => navigate('/wallet')} className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform">
                  <i className="fa-solid fa-plus"></i>
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
