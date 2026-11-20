import React, { useState } from 'react';
import { loginWithFirebaseEmail, registerWithFirebaseEmail, loginWithGooglePopup } from '../services/firebase';
import { 
  Wrench, 
  Bike,
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
    <div className="min-h-[calc(100vh-5rem)] bg-[#0b0c10] flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#12141c] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT COLUMN: BRAND HERO WITH REFERENCE MOTORCYCLE FLAVOR */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#181a24] to-[#0e1015] p-8 sm:p-12 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
          
          <div className="relative z-10 space-y-6">
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/25">
                <Bike className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-2xl tracking-tight text-white block">
                  Service<span className="text-amber-400">Setu</span>
                </span>
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                  Doorstep Garage
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                Doorstep Servicing Brought To Your Location
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Certified mechanics visit your home. Transparent upfront pricing, genuine barcode-scanned parts, and digital proof reports.
              </p>
            </div>

            <div className="space-y-3 pt-3">
              <div className="flex items-center space-x-3 text-xs bg-[#12141c] p-3.5 rounded-2xl border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <strong className="text-white font-bold block">Verified Technicians</strong>
                  <span className="text-slate-400 text-[11px]">Police verified & skill certified</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs bg-[#12141c] p-3.5 rounded-2xl border border-white/5">
                <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <strong className="text-white font-bold block">100% Genuine Spare Parts</strong>
                  <span className="text-slate-400 text-[11px]">Anti-counterfeit barcode verification</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs bg-[#12141c] p-3.5 rounded-2xl border border-white/5">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 flex-shrink-0" />
                <div>
                  <strong className="text-white font-bold block">7-Day Free Redo Guarantee</strong>
                  <span className="text-slate-400 text-[11px]">Zero hidden fees or surprises</span>
                </div>
              </div>
            </div>

          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center font-bold text-white">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" /> 4.9 Average Rating
            </span>
            <span className="text-amber-400 font-bold">• 10,000+ Serviced Bikes</span>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTHENTICATION FORM */}
        <div className="lg:col-span-7 bg-[#12141c] p-8 sm:p-12 flex flex-col justify-between">
          <div>
            
            {/* Header & Mode Switcher */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block mb-1.5">
                  Secure Access
                </span>
                <h3 className="text-2xl font-black text-white">
                  {authMode === 'login' ? 'Sign In to ServiceSetu' : 'Create Customer Account'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setErrorMsg(null);
                }}
                className="text-xs font-bold text-amber-400 hover:text-white bg-white/5 px-3.5 py-2 rounded-xl border border-white/10 transition-all cursor-pointer"
              >
                {authMode === 'login' ? 'Create Account' : 'Existing User? Log In'}
              </button>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-500/40 text-red-300 rounded-2xl text-xs font-bold flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Role Category Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Select Account Portal
              </label>
              <div className="grid grid-cols-3 gap-2 bg-[#0e1015] p-1.5 rounded-2xl text-xs font-bold border border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('customer');
                    setEmail('');
                    setErrorMsg(null);
                  }}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                    selectedRole === 'customer' 
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20' 
                      : 'text-slate-400 hover:text-white'
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
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20' 
                      : 'text-slate-400 hover:text-white'
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
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20' 
                      : 'text-slate-400 hover:text-white'
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
              className="w-full bg-[#181a24] hover:bg-[#1f2230] text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md text-xs flex items-center justify-center space-x-3 mb-6 cursor-pointer border border-white/10"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
              </svg>
              <span>Continue with Google ({selectedRole === 'admin' ? 'SuperAdmin' : selectedRole === 'mechanic' ? 'Mechanic' : 'Customer'})</span>
            </button>

            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Or Continue With Credentials
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Email + Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {authMode === 'register' && (
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0e1015] border border-white/10 text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none text-sm font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  {selectedRole === 'admin' ? 'SuperAdmin Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRole === 'admin' ? 'sudhanshupandey7393@gmail.com' : 'user@example.com'}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0e1015] border border-white/10 text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none text-sm font-medium"
                  />
                  <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0e1015] border border-white/10 text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none text-sm font-medium"
                  />
                  <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-amber-glow font-black py-4 rounded-xl text-sm flex items-center justify-center space-x-2 mt-6 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    {authMode === 'login' ? <ArrowRight className="w-4 h-4 stroke-[3]" /> : <UserPlus className="w-4 h-4" />}
                    <span>{authMode === 'login' ? `Sign In as ${selectedRole === 'admin' ? 'SuperAdmin' : selectedRole === 'mechanic' ? 'Mechanic' : 'Customer'}` : 'Create Customer Account'}</span>
                  </>
                )}
              </button>
            </form>

          </div>

          <div className="text-center pt-8 text-[11px] text-slate-500 border-t border-white/10 mt-6">
            Protected by 256-bit SSL encryption & ServiceSetu Verification Protocol.
          </div>
        </div>

      </div>
    </div>
  );
}
