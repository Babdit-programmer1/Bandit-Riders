
import React, { useEffect, useState } from 'react';
import { generateRandomOffset, LAGOS_CENTER } from '../utils/geoUtils';
import { LocationCoords, User } from '../types';

interface Props {
  isOpen: boolean;
  onRiderSelected: (rider: any) => void;
}

const RiderPopupMap: React.FC<Props> = ({ isOpen, onRiderSelected }) => {
  const [dots, setDots] = useState<any[]>([]);
  const [status, setStatus] = useState('Scanning for nearby riders...');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPulse(true);
      // Simulate discovering 5 riders
      const mockRiders = [
        { id: 1, name: 'Sani Express', plate: 'LAG-442-XP', rating: 4.8, offset: generateRandomOffset(LAGOS_CENTER, 0.5) },
        { id: 2, name: 'Tunde Bandit', plate: 'OGU-112-AB', rating: 4.9, offset: generateRandomOffset(LAGOS_CENTER, 0.8) },
        { id: 3, name: 'Chioma Fast', plate: 'KAD-908-ZZ', rating: 4.7, offset: generateRandomOffset(LAGOS_CENTER, 0.3) },
        { id: 4, name: 'Musa Wheels', plate: 'ABJ-331-QR', rating: 4.9, offset: generateRandomOffset(LAGOS_CENTER, 1.2) },
        { id: 5, name: 'Ibrahim Pilot', plate: 'EKY-776-LK', rating: 4.6, offset: generateRandomOffset(LAGOS_CENTER, 0.6) },
      ];

      setTimeout(() => {
        setDots(mockRiders);
        setStatus('Optimizing match for efficiency...');
      }, 2000);

      setTimeout(() => {
        setStatus('Rider assigned! Handing over dispatch...');
        // Match the "best" rider (highest rating)
        const best = [...mockRiders].sort((a, b) => b.rating - a.rating)[0];
        onRiderSelected(best);
      }, 5000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
      <div className="w-full max-w-xl bg-white rounded-[3.5rem] overflow-hidden shadow-3xl animate-in zoom-in-95 duration-500">
        <div className="relative h-[400px] bg-slate-50 flex items-center justify-center overflow-hidden">
          {/* Radar Ring */}
          <div className={`absolute w-[300px] h-[300px] border-2 border-indigo-100 rounded-full ${pulse ? 'animate-ping' : ''}`}></div>
          <div className="absolute w-[150px] h-[150px] border border-indigo-200 rounded-full opacity-50"></div>
          
          {/* Central Point (User) */}
          <div className="relative z-10 w-6 h-6 bg-indigo-600 rounded-full ring-8 ring-indigo-50 flex items-center justify-center">
            <i className="fa-solid fa-user text-[8px] text-white"></i>
          </div>

          {/* Rider Dots */}
          {dots.map((r, i) => (
            <div 
              key={r.id}
              className="absolute transition-all duration-1000 ease-out"
              style={{ 
                left: `${50 + (r.offset.lng - LAGOS_CENTER.lng) * 500}%`,
                top: `${50 + (r.offset.lat - LAGOS_CENTER.lat) * 500}%`
              }}
            >
              <div className="group relative">
                <div className="w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 hover:scale-110 transition-transform">
                  <i className="fa-solid fa-motorcycle text-indigo-600"></i>
                </div>
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {r.name} • {r.rating}★
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Global Smart Matching Active</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{status}</h2>
          <p className="text-slate-400 font-medium italic text-sm">Searching our high-performance network for the nearest available pilot.</p>
        </div>
      </div>
    </div>
  );
};

export default RiderPopupMap;
