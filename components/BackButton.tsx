
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define base paths where the back button should stay hidden
  const hidePaths = ['/', '/signup', '/auth', '/login'];
  const shouldHide = hidePaths.includes(location.pathname);

  if (shouldHide) return null;

  const handleBack = () => {
    // If there is no browser history (e.g., user landed on the page via a direct link),
    // we fallback to the landing page or dashboard instead of doing nothing.
    if (window.history.length <= 1) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <button 
      onClick={handleBack}
      className="fixed top-24 left-6 md:left-10 z-[200] w-12 h-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/50 flex items-center justify-center text-slate-900 hover:bg-indigo-600 hover:text-white hover:-translate-x-1 active:scale-95 transition-all duration-300 group"
      aria-label="Go back"
    >
      <i className="fa-solid fa-arrow-left text-lg transition-transform group-hover:scale-110"></i>
      
      {/* Tooltip for desktop */}
      <span className="absolute left-14 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
        Go Back
      </span>
    </button>
  );
};

export default BackButton;
