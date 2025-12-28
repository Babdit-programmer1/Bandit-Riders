
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import Button from '../components/Button';
import { authService } from '../services/authService';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('sender');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const user = authService.signup(name, email, role, password);
    if (user) {
      navigate(user.role === 'rider' ? '/rider-dashboard' : '/order');
    } else {
      setError('Email already exists. Try logging in.');
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
            <i className="fa-solid fa-bolt-auto text-3xl"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Join the Elite</h2>
          <p className="text-slate-400 font-medium italic">Create your secure dispatch profile.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              required 
              placeholder="Alex Johnson" 
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-semibold outline-none" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all font-semibold outline-none" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Your Path</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${role === 'sender' ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-slate-50 border-transparent text-slate-300'}`}>
                <input type="radio" name="role" className="hidden" checked={role === 'sender'} onChange={() => setRole('sender')} />
                <i className="fa-solid fa-box-open text-2xl"></i>
                <span className="text-xs font-black uppercase tracking-widest">Sender</span>
              </label>
              <label className={`cursor-pointer p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${role === 'rider' ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-slate-50 border-transparent text-slate-300'}`}>
                <input type="radio" name="role" className="hidden" checked={role === 'rider'} onChange={() => setRole('rider')} />
                <i className="fa-solid fa-motorcycle text-2xl"></i>
                <span className="text-xs font-black uppercase tracking-widest">Rider</span>
              </label>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" className="py-5 rounded-2xl text-lg font-black shadow-xl bg-indigo-600 hover:bg-indigo-700">Create Account</Button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/auth" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
