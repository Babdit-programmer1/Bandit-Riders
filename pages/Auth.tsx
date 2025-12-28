
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import Button from '../components/Button';
import { authService } from '../services/authService';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  // Added password state to fix missing arguments in authService calls
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('sender');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Fix: authService.login expects 3 arguments (email, password, rememberMe)
      const user = authService.login(email, password, false);
      if (user) {
        navigate(user.role === 'rider' ? '/rider-dashboard' : '/order');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } else {
      // Fix: authService.signup expects 4 arguments (name, email, role, password)
      const success = authService.signup(name, email, role, password);
      if (success) {
        setIsLogin(true);
        setError('Account created! Please login now.');
      } else {
        setError('Email already exists.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
            <i className="fa-solid fa-bolt-auto text-3xl"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Elite'}
          </h2>
          <p className="text-slate-400 font-medium">Bandit Riders Dispatch Simulation</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" required placeholder="Alex Johnson"
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-semibold outline-none"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" required placeholder="alex@example.com"
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-semibold outline-none"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Added password field to the UI to capture state for authService calls */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" required placeholder="••••••••"
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-semibold outline-none"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Your Path</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'sender' ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                  <input type="radio" name="role" className="hidden" checked={role === 'sender'} onChange={() => setRole('sender')} />
                  <i className="fa-solid fa-user-tag text-xl"></i>
                  <span className="text-xs font-black uppercase">Sender</span>
                </label>
                <label className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'rider' ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                  <input type="radio" name="role" className="hidden" checked={role === 'rider'} onChange={() => setRole('rider')} />
                  <i className="fa-solid fa-motorcycle text-xl"></i>
                  <span className="text-xs font-black uppercase">Rider</span>
                </label>
              </div>
            </div>
          )}

          <Button type="submit" fullWidth size="lg" className="py-5 rounded-2xl text-lg font-black shadow-xl">
            {isLogin ? 'Enter Dashboard' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setPassword(''); }}
            className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
