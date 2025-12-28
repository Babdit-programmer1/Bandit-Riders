
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import Button from '../components/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  // Pre-fill email if remembered
  useEffect(() => {
    const savedEmail = authService.getRememberedEmail();
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = authService.login(email, password, rememberMe);
    if (user) {
      navigate(user.role === 'rider' ? '/rider-dashboard' : '/order');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
            <i className="fa-solid fa-bolt-auto text-3xl"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-400 font-medium">Access your dispatch grid.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="alex@example.com" 
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-semibold outline-none" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <button type="button" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">Forgot?</button>
            </div>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-semibold outline-none" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <div className="flex items-center gap-3 ml-1">
            <button 
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200'}`}
            >
              {rememberMe && <i className="fa-solid fa-check text-[10px]"></i>}
            </button>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest select-none cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
              Remember Me
            </span>
          </div>

          <Button type="submit" fullWidth size="lg" className="py-5 rounded-2xl text-lg font-black shadow-xl bg-indigo-600 hover:bg-indigo-700">Login Now</Button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/signup" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">New here? Join the Bandits</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
