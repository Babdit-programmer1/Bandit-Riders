
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Global Logistics Network</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Dispatch at the <br/>
              <span className="gradient-text">Edge of Speed.</span>
            </h1>
            
            <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Elite riders. Intelligent routing. Instant fulfillment. Bandit Riders is the premier platform for high-performance urban deliveries.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Button size="lg" className="rounded-[2rem] px-12 py-7 text-lg font-black shadow-2xl shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/signup')}>
                Start Sending
              </Button>
              <Button variant="outline" size="lg" className="rounded-[2rem] px-12 py-7 text-lg font-black border-2 border-slate-100" onClick={() => navigate('/signup')}>
                Join as Rider
              </Button>
            </div>
          </div>
        </div>

        {/* Abstract Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] opacity-50 -mr-96 -mt-96"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50 rounded-full blur-[100px] opacity-40 -ml-48 -mb-48"></div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-slate-900 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Riders', val: '12.4K' },
              { label: 'Avg Delivery', val: '14.2m' },
              { label: 'Rating', val: '4.9/5' },
              { label: 'Success Rate', val: '99.9%' }
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-black text-white mb-2">{s.val}</p>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: 'fa-bolt', title: 'Express Dispatch', desc: 'Surgical precision in routing ensures your items arrive in record time.' },
              { icon: 'fa-user-ninja', title: 'Elite Couriers', desc: 'Vetted, high-performance riders trained for metropolitan agility.' },
              { icon: 'fa-satellite', title: 'Live Telemetry', desc: 'Sub-meter tracking accuracy for peace of mind on every shipment.' }
            ].map((f, i) => (
              <div key={i} className="group">
                <div className="w-16 h-16 bg-slate-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <i className={`fa-solid ${f.icon} text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-slate-50">
        <div className="container mx-auto px-6 text-center space-y-8">
           <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-bolt-auto text-2xl"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter">BANDIT<span className="text-slate-400">RIDERS</span></span>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2025 Bandit Riders Dispatch. Premium School Project Simulation.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
