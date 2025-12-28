
import React, { useEffect, useState } from 'react';

interface MapMockProps {
  progress?: number;
  status?: string;
  distance?: string;
  estTime?: string;
  items?: string[];
  interactive?: boolean;
}

const MapMock: React.FC<MapMockProps> = ({ 
  progress = 0, 
  status, 
  distance = "Calculating...", 
  estTime = "-- mins", 
  items = [],
  interactive = false 
}) => {
  const isMoving = status === 'In Transit';
  const isDelivered = status === 'Delivered';
  const isPickedUp = status === 'Picked Up' || status === 'In Progress';
  
  // Local simulation of slight jitter for realism
  const [jitter, setJitter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isMoving) {
      const interval = setInterval(() => {
        setJitter({ 
          x: (Math.random() - 0.5) * 0.4, 
          y: (Math.random() - 0.5) * 0.4 
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isMoving]);

  // Derived labels
  const cargoLabel = items.length > 0 ? items[0] : "Standard Package";
  const moreCargo = items.length > 1 ? ` + ${items.length - 1} more` : "";

  return (
    <div className="relative w-full h-full bg-[#0f172a] rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl group">
      {/* Dark Map Base Grid */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }}></div>
      
      {/* City Road Network */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 0 15 H 100 M 0 45 H 100 M 0 75 H 100 M 15 0 V 100 M 45 0 V 100 M 75 0 V 100" stroke="white" strokeWidth="0.8" fill="none" />
        <path d="M 0 0 L 100 100 M 100 0 L 0 100" stroke="white" strokeWidth="0.4" fill="none" />
      </svg>

      <svg className="absolute inset-0 w-full h-full p-12" viewBox="0 0 100 100">
        {/* Main Route Path Line */}
        <path 
          d="M 10 20 Q 50 10, 90 80" 
          stroke="#1e293b" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
        />
        
        {/* Active Progress Path (Glow effect) */}
        <path 
          d="M 10 20 Q 50 10, 90 80" 
          stroke="#6366f1" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
          strokeDasharray="120" 
          strokeDashoffset={120 - (progress * 1.2)}
          className="transition-all duration-1000 ease-linear"
          style={{ filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.5))' }}
        />
        
        {/* Pickup Point */}
        <g transform="translate(10, 20)">
          <circle r="4" fill="#6366f1" />
          <circle r="8" fill="#6366f1" opacity="0.1" className="animate-pulse" />
          <text y="-8" textAnchor="middle" fill="#94a3b8" className="text-[3px] font-black uppercase tracking-[0.2em]">Origin</text>
        </g>
        
        {/* Dropoff Point */}
        <g transform="translate(90, 80)">
          <circle r="4" fill={isDelivered ? "#10b981" : "#f43f5e"} />
          <circle r="12" fill={isDelivered ? "#10b981" : "#f43f5e"} opacity="0.1" />
          <text y="12" textAnchor="middle" fill="#94a3b8" className="text-[3px] font-black uppercase tracking-[0.2em]">Final Destination</text>
        </g>
        
        {/* Rider & Cargo Icon */}
        {!isDelivered && (progress > 0 || isPickedUp) && (
          <g style={{ 
            transition: 'all 1s linear',
            transform: `translate(${10 + (progress * 0.8) + jitter.x}px, ${20 + (progress * 0.6) + jitter.y}px)` 
          }}>
            {/* Pulsing Radius */}
            <circle r="12" fill="#6366f1" opacity="0.1" className="animate-ping" />
            
            {/* Rider Body */}
            <circle r="5" fill="#6366f1" className="shadow-lg" />
            
            {/* Cargo Tag Floating near Rider */}
            <g transform="translate(8, -8)">
              <rect x="0" y="0" width="22" height="6" rx="1" fill="#6366f1" />
              <text x="11" y="4.5" textAnchor="middle" fill="white" className="text-[2.5px] font-bold uppercase tracking-tighter">
                Cargo Active
              </text>
            </g>
          </g>
        )}
      </svg>
      
      {/* Live Tracking HUD - Top Left */}
      <div className="absolute top-6 left-6 flex flex-col gap-3 max-w-[200px]">
        <div className="bg-black/40 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isMoving ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-amber-500'}`}></div>
          <span className="text-[9px] font-black text-white uppercase tracking-[0.15em]">
            {isDelivered ? 'Transmission Complete' : isMoving ? 'Rider In Transit' : 'Awaiting Departure'}
          </span>
        </div>

        {/* Cargo Detail HUD */}
        <div className="bg-indigo-600/10 backdrop-blur-xl p-4 rounded-3xl border border-indigo-500/20 animate-in fade-in slide-in-from-left-4 duration-1000">
           <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-2">Transporting</p>
           <h4 className="text-xs font-black text-white truncate leading-tight">
             {cargoLabel}{moreCargo}
           </h4>
        </div>
      </div>

      {/* Telemetry Stats - Bottom Right */}
      <div className="absolute bottom-6 right-6">
        <div className="bg-slate-900/80 backdrop-blur-2xl p-6 rounded-[2rem] shadow-3xl border border-white/5 flex items-center gap-8">
           <div className="flex flex-col gap-1">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Remaining</p>
              <div className="flex items-baseline gap-1">
                <p className="text-xl font-black text-white">{distance}</p>
              </div>
           </div>
           
           <div className="w-px h-10 bg-white/10"></div>
           
           <div className="flex flex-col gap-1">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">ETA</p>
              <p className="text-xl font-black text-indigo-400">{estTime}</p>
           </div>

           <div className="w-px h-10 bg-white/10"></div>

           <div className="flex flex-col gap-1">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Precision</p>
              <p className="text-xl font-black text-emerald-500">99%</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MapMock;
