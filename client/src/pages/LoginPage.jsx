import React, { useState } from 'react';
import { loginWithFirebaseEmail, registerWithFirebaseEmail, loginWithGooglePopup } from '../services/firebase';
import { 
  Wrench, 
  User, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  AlertCircle,
  CheckCircle2,
  Shield,
  Star,
  UserPlus
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer', 'mechanic', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await loginWithGooglePopup();
      if (res.user) {
        const userEmail = (res.user.email || '').trim().toLowerCase();

        // Strict Admin Role Check
        if (selectedRole === 'admin') {
          if (userEmail !== 'sudhanshupandey7393@gmail.com') {
            setLoading(false);
            setErrorMsg('Unauthorized: Only the platform owner (sudhanshupandey7393@gmail.com) has SuperAdmin access.');
            return;
          }
        }

        const role = selectedRole === 'admin' && userEmail === 'sudhanshupandey7393@gmail.com' 
          ? 'admin' 
          : selectedRole === 'mechanic' 
          ? 'mechanic' 
          : 'customer';

        const userData = {
          role,
          name: role === 'admin' ? 'Sudhanshu Pandey' : (res.user.displayName || userEmail.split('@')[0] || 'Customer User'),
          email: userEmail || (role === 'admin' ? 'sudhanshupandey7393@gmail.com' : 'customer@gmail.com'),
          avatar: res.user.photoURL || (role === 'admin' ? 'SP' : 'CU'),
          badge: role === 'admin' ? 'Platform SuperAdmin' : role === 'mechanic' ? 'Verified Mechanic' : 'Customer Account'
        };

        setLoading(false);
        onLogin(userData);
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Google Sign-In failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both your Email Address and Password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    // Strict Admin Check
    const cleanEmail = email.trim().toLowerCase();
    if (selectedRole === 'admin' && cleanEmail !== 'sudhanshupandey7393@gmail.com') {
      setErrorMsg('Unauthorized: Only the platform owner (sudhanshupandey7393@gmail.com) has SuperAdmin access.');
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'register') {
        await registerWithFirebaseEmail(cleanEmail, password, fullName || 'User');
      } else {
        await loginWithFirebaseEmail(cleanEmail, password);
      }

      const role = selectedRole === 'admin' && cleanEmail === 'sudhanshupandey7393@gmail.com' 
        ? 'admin' 
        : selectedRole === 'mechanic' 
        ? 'mechanic' 
        : 'customer';

      const userData = {
        role,
        name: role === 'admin' ? 'Sudhanshu Pandey' : (fullName || cleanEmail.split('@')[0]),
        email: cleanEmail,
        avatar: role === 'admin' ? 'SP' : cleanEmail.substring(0, 2).toUpperCase(),
        badge: role === 'admin' ? 'Platform SuperAdmin' : role === 'mechanic' ? 'Verified Mechanic' : 'Customer Account'
      };

      setLoading(false);
      onLogin(userData);
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Authentication error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* LEFT COLUMN: BRAND HERO */}
        <div className="lg:col-span-5 gradient-bg p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-6">
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg shadow-teal-500/30">
                <Wrench className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white block">Service<span className="text-teal-400">Setu</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300">Doorstep Vehicle Servicing</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Doorstep Servicing Brought To Your Location
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Verified mechanics visit your home or office. Transparent upfront pricing, genuine spare parts, and digital proof reports.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs bg-slate-950/40 p-3 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <div>
                  <strong className="text-white font-bold block">Verified Mechanics</strong>
                  <span className="text-slate-300 text-[11px]">Background-checked doorstep experts</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs bg-slate-950/40 p-3 rounded-2xl border border-white/10">
                <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <strong className="text-white font-bold block">100% Genuine Spare Parts</strong>
                  <span className="text-slate-300 text-[11px]">Barcode verified authentic products</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs bg-slate-950/40 p-3 rounded-2xl border border-white/10">
                <Star className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <strong className="text-white font-bold block">Fixed Upfront Pricing</strong>
                  <span className="text-slate-300 text-[11px]">Zero hidden fees or surprises</span>
                </div>
              </div>
            </div>

          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center font-bold"><Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" /> 4.9 Rating</span>
            <span>• 10,000+ Serviced Bikes</span>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTHENTICATION FORM */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-between">
          <div>
            
            {/* Header & Mode Switcher */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full inline-block mb-1">
                  Portal Login
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {authMode === 'login' ? 'Sign In to ServiceSetu' : 'Create Customer Account'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setErrorMsg(null);
                }}
                className="text-xs font-bold text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition-all"
              >
                {authMode === 'login' ? 'Create Account' : 'Existing User? Log In'}
              </button>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Role Category Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Select Login Account Category</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('customer');
                    setEmail('');
                    setErrorMsg(null);
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
                    setEmail('');
                    setErrorMsg(null);
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
                    setEmail('sudhanshupandey7393@gmail.com');
                    setErrorMsg(null);
                  }}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                    selectedRole === 'admin' 
                      ? 'bg-teal-600 text-white shadow-md' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>SuperAdmin</span>
                </button>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md text-xs flex items-center justify-center space-x-3 mb-5 cursor-pointer border border-slate-700 active:scale-98"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
              </svg>
              <span>Continue with Google ({selectedRole === 'admin' ? 'SuperAdmin' : selectedRole === 'mechanic' ? 'Mechanic' : 'Customer'})</span>
            </button>

            <div className="relative flex py-2 items-center mb-5">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or Sign In With Email</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Email + Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {authMode === 'register' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {selectedRole === 'admin' ? 'SuperAdmin Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRole === 'admin' ? 'sudhanshupandey7393@gmail.com' : 'user@example.com'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center space-x-2 mt-4 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    {authMode === 'login' ? <ArrowRight className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{authMode === 'login' ? `Sign In as ${selectedRole === 'admin' ? 'SuperAdmin' : selectedRole === 'mechanic' ? 'Mechanic' : 'Customer'}` : 'Create Account'}</span>
                  </>
                )}
              </button>
            </form>

          </div>

          <div className="text-center pt-6 text-[11px] text-slate-400 border-t border-slate-100">
            Protected by 256-bit SSL encryption & ServiceSetu Verification Protocol.
          </div>
        </div>

      </div>
    </div>
  );
}
