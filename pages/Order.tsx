
import React, { useState } from 'react';
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

  const handleGetQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentError(false);
    
    // Academic Simulation Delay
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
    }, 1500);
  };

  const onRiderFound = (rider: any) => {
    if (!estimate) return;
    
    const deliveryId = `BR-${Math.floor(Math.random() * 8999) + 1000}`;
    
    // Simulate wallet payment logic
    const paymentSuccess = walletService.payForDelivery(estimate.price, deliveryId);
    
    if (!paymentSuccess) {
      setPaymentError(true);
      setShowRiderMap(false);
      return;
    }

    const deliveries = JSON.parse(localStorage.getItem('bandit_deliveries') || '[]');
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
    
    deliveries.unshift(newBooking);
    localStorage.setItem('bandit_deliveries', JSON.stringify(deliveries));
    
    setTimeout(() => {
      navigate('/deliveries');
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#f8fafc] px-6">
      <RiderPopupMap isOpen={showRiderMap} onRiderSelected={onRiderFound} />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 bg-white p-12 rounded-[3.5rem] shadow-premium border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
          
          {!estimate ? (
            <form onSubmit={handleGetQuote} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div className="mb-12">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3 block">Service Request</span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Express Dispatch</h2>
                <p className="text-slate-400 font-medium text-lg leading-relaxed">Local Lagos rates. Academic pricing simulation.</p>
              </div>

              <div className="space-y-8">
                <div className="group space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">Pickup Point</label>
                  <input type="text" required placeholder="Pickup Location in Lagos" className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300" value={pickup} onChange={(e) => setPickup(e.target.value)} />
                </div>

                <div className="group space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                  <input type="text" required placeholder="Where is it headed?" className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-purple-600 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
                </div>

                <div className="group space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Package Contents</label>
                  <input type="text" required placeholder="e.g. Documents, Pizza, Electronics" className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300" value={items} onChange={(e) => setItems(e.target.value)} />
                </div>
              </div>

              <Button type="submit" fullWidth size="lg" isLoading={isLoading} className="py-7 rounded-[2rem] text-xl font-black bg-indigo-600 hover:bg-indigo-700 shadow-2xl transition-transform">
                Calculate Fare (₦)
              </Button>
            </form>
          ) : (
            <div className="space-y-10 animate-in zoom-in-95 duration-500 relative z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Logistics Quote</h2>
                <button onClick={() => { setEstimate(null); setPaymentError(false); }} className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                  <i className="fa-solid fa-rotate-left"></i>
                </button>
              </div>

              {paymentError && (
                <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-4 animate-in shake duration-500">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl">
                    <i className="fa-solid fa-circle-exclamation"></i>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-red-900">Insufficient Wallet Balance</h4>
                    <p className="text-sm font-medium text-red-700 mt-1">Please fund your Bandit Wallet before requesting this dispatch.</p>
                  </div>
                  <Button variant="danger" size="md" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest" onClick={() => navigate('/wallet')}>
                    Fund Wallet Now
                  </Button>
                </div>
              )}

              <FareBreakdown data={estimate.breakdown} />

              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-3xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-wallet"></i>
                  </div>
                  <p className="text-xs font-bold text-slate-400 italic">"Payment will be deducted from your secure Bandit Wallet."</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" size="lg" className="rounded-[2rem] py-6 font-black text-slate-400 border-white/10 hover:bg-white/5" onClick={() => setEstimate(null)}>Cancel</Button>
                  <Button 
                    onClick={() => setShowRiderMap(true)} 
                    size="lg" 
                    className="rounded-[2rem] py-6 font-black bg-indigo-600 hover:bg-indigo-700 shadow-xl"
                  >
                    Confirm & Find Rider
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden h-[300px] flex flex-col justify-end">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <i className="fa-solid fa-wallet text-[8rem]"></i>
              </div>
              <h4 className="text-4xl font-black tracking-tighter leading-none mb-4">Cashless <br/>Ecosystem</h4>
              <p className="text-sm font-bold opacity-70">Pay effortlessly from your in-app wallet. Fast, secure, and fully simulated.</p>
           </div>

           <div className="bg-white p-10 rounded-[3.5rem] shadow-premium border border-slate-100">
             <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest">Wallet Status</h3>
             <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Balance</p>
                   <p className="text-2xl font-black text-slate-900">{formatNaira(walletService.getWallet().balance)}</p>
                </div>
                <button 
                  onClick={() => navigate('/wallet')}
                  className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
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
