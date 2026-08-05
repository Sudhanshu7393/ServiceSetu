import React, { useState } from 'react';
import { 
  Wrench, 
  User, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Phone, 
  CheckCircle2,
  Sparkles,
  Shield,
  Star,
  Barcode,
  Bike
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('customer'); // customer, mechanic, admin
  const [identifier, setIdentifier] = useState('+91 98200 12345');
  const [password, setPassword] = useState('123456');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'customer') {
      onLogin({
        role: 'customer',
        name: 'Amit Patel',
        phone: identifier,
        avatar: 'AP',
        badge: 'Gold Member'
      });
    } else if (selectedRole === 'mechanic') {
      onLogin({
        role: 'mechanic',
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        mechanicId: 'mech-101',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        badge: 'Verified Expert'
      });
    } else if (selectedRole === 'admin') {
      onLogin({
        role: 'admin',
        name: 'Operations Admin',
        email: 'admin@servicesetu.in',
        avatar: 'AD',
        badge: 'Platform SuperAdmin'
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* LEFT COLUMN: BRAND HERO SHOWCASE (5 COLS) */}
        <div className="lg:col-span-5 gradient-bg p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-6">
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg shadow-teal-500/30">
                <Wrench className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white block">Service<span className="text-teal-400">Setu</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300">Trusted Doorstep Service</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                India's First Proof-Backed Servicing Ecosystem
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Verified mechanics visit your location. Every oil container and spare part unit scanned with live barcode duplicate audit.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs bg-slate-950/40 p-3 rounded-2xl border border-white/10">
                <Barcode className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <div>
                  <strong className="text-white font-bold block">100% Barcode Authenticity</strong>
                  <span className="text-slate-300 text-[11px]">Duplicate reuse blocked automatically</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs bg-slate-950/40 p-3 rounded-2xl border border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <strong className="text-white font-bold block">Verified Doorstep Mechanics</strong>
                  <span className="text-slate-300 text-[11px]">KYC & background checked experts</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs bg-slate-950/40 p-3 rounded-2xl border border-white/10">
                <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <div>
                  <strong className="text-white font-bold block">Fixed Upfront Pricing</strong>
                  <span className="text-slate-300 text-[11px]">Transparent engine oil upgrade diffs</span>
                </div>
              </div>
            </div>

          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center font-bold"><Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" /> 4.9 Rating</span>
            <span>• 10,000+ Serviced Bikes</span>
          </div>
        </div>

        {/* RIGHT COLUMN: SLEEK LOGIN CARD (7 COLS) */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-between">
          <div>
            
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full inline-block mb-2">
                Account Portal Access
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">Welcome Back</h3>
              <p className="text-xs text-slate-500 mt-1">Select your role category below to log in to your dashboard.</p>
            </div>

            {/* Category Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('customer');
                  setIdentifier('+91 98200 12345');
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                  selectedRole === 'customer' 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('mechanic');
                  setIdentifier('MECH-101');
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                  selectedRole === 'mechanic' 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Mechanic</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setIdentifier('admin@servicesetu.in');
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                  selectedRole === 'admin' 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {selectedRole === 'customer' ? 'Mobile Phone Number' : selectedRole === 'mechanic' ? 'Mechanic ID' : 'Admin Email'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password / Security PIN</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center space-x-2 mt-4"
              >
                <span>Login as {selectedRole === 'customer' ? 'Customer' : selectedRole === 'mechanic' ? 'Mechanic' : 'Admin'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Login Chips */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
                Quick 1-Click Demo Login
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onLogin({ role: 'customer', name: 'Amit Patel', phone: '+91 98200 12345', badge: 'Gold Member' })}
                  className="p-2.5 rounded-xl bg-slate-50 border hover:bg-teal-50 hover:border-teal-300 text-left transition-all text-xs"
                >
                  <strong className="text-slate-900 block font-bold text-[11px]">👤 Customer</strong>
                  <span className="text-slate-500 text-[10px]">Amit Patel</span>
                </button>

                <button
                  type="button"
                  onClick={() => onLogin({ role: 'mechanic', name: 'Rajesh Kumar', mechanicId: 'mech-101', badge: 'Verified Expert' })}
                  className="p-2.5 rounded-xl bg-slate-50 border hover:bg-teal-50 hover:border-teal-300 text-left transition-all text-xs"
                >
                  <strong className="text-slate-900 block font-bold text-[11px]">🔧 Mechanic</strong>
                  <span className="text-slate-500 text-[10px]">Rajesh Kumar</span>
                </button>

                <button
                  type="button"
                  onClick={() => onLogin({ role: 'admin', name: 'Operations Admin', badge: 'SuperAdmin' })}
                  className="p-2.5 rounded-xl bg-slate-50 border hover:bg-teal-50 hover:border-teal-300 text-left transition-all text-xs"
                >
                  <strong className="text-slate-900 block font-bold text-[11px]">🛡️ Admin</strong>
                  <span className="text-slate-500 text-[10px]">SuperAdmin</span>
                </button>
              </div>
            </div>

          </div>

          <div className="text-center pt-6 text-[11px] text-slate-400 border-t border-slate-100">
            Protected by 256-bit SSL encryption & ServiceSetu Standard Verification Protocol.
          </div>
        </div>

      </div>
    </div>
  );
}
