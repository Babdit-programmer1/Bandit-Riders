
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-indigo-50 px-5 py-2.5 rounded-full border border-indigo-100 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
              <div className="flex h-2 w-2 relative">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></div>
              </div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Next-Gen Dispatch Network</span>
            </div>
            
            <h1 className="text-7xl md:text-[10rem] font-black text-slate-900 leading-[0.85] tracking-tighter mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              SPEED IS <br/>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ABSOLUTE.</span>
            </h1>
            
            <p className="text-xl text-slate-500 font-medium mb-16 max-w-2xl leading-relaxed">
              Premium Lagos dispatch for those who don't wait. Vetted riders, sub-meter accuracy, and instant wallet settlement.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="rounded-full px-12 py-8 text-xl font-black shadow-[0_20px_50px_rgba(79,70,229,0.3)] bg-indigo-600 hover:scale-105 transition-transform" onClick={() => navigate('/signup')}>
                Dispatch Now
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-12 py-8 text-xl font-black border-2 border-slate-100 hover:bg-slate-50" onClick={() => navigate('/signup')}>
                Earn as Rider
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-[100px]"></div>
        </div>
      </section>

      <div className="bg-slate-950 py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Active Pilots', val: '15.2K' },
              { label: 'Avg Fulfillment', val: '12.4m' },
              { label: 'Network Uptime', val: '99.9%' },
              { label: 'Lagos Coverage', val: '100%' }
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <p className="text-5xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors">{s.val}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
