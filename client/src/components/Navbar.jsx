import React from 'react';
import { 
  Wrench, 
  UserCheck, 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  Award, 
  User, 
  LogOut
} from 'lucide-react';

export default function Navbar({ currentUser, isLoginPage, activeTab, setActiveTab, onLogout, onOpenLogin }) {
  
  const roleNavItems = {
    customer: [
      { id: 'booking', label: 'Book Service', icon: Wrench },
      { id: 'account', label: 'My Garage & Account', icon: User },
      { id: 'reports', label: 'Service Proof Reports', icon: FileText },
      { id: 'store', label: 'Store & Parts', icon: ShoppingBag },
      { id: 'amc', label: 'AMC Subscription', icon: Award }
    ],
    mechanic: [
      { id: 'mechanic', label: 'Mechanic Job Portal', icon: UserCheck },
      { id: 'reports', label: 'Customer Proof Reports', icon: FileText }
    ],
    admin: [
      { id: 'admin', label: 'Admin Operations Portal', icon: LayoutDashboard },
      { id: 'reports', label: 'System Barcode Audits', icon: FileText }
    ]
  };

  const navItems = roleNavItems[currentUser?.role] || roleNavItems.customer;

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              if (currentUser && !isLoginPage) {
                setActiveTab(currentUser.role === 'mechanic' ? 'mechanic' : currentUser.role === 'admin' ? 'admin' : 'booking');
              }
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-teal-500/20">
              <Wrench className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Service<span className="text-teal-400">Setu</span></span>
                {!isLoginPage && currentUser && (
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md border ${
                    currentUser.role === 'admin' 
                      ? 'bg-purple-950 text-purple-300 border-purple-800' 
                      : currentUser.role === 'mechanic' 
                      ? 'bg-amber-950 text-amber-300 border-amber-800' 
                      : 'bg-teal-950 text-teal-300 border-teal-800'
                  }`}>
                    {currentUser.role === 'admin' ? 'Admin Portal' : currentUser.role === 'mechanic' ? 'Mechanic Portal' : 'Doorstep'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Trusted Doorstep Vehicle Service</p>
            </div>
          </div>

          {/* Navigation Links ONLY shown when logged in and NOT on login page */}
          {!isLoginPage && currentUser && (
            <nav className="hidden md:flex space-x-1 lg:space-x-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-teal-600/20 text-teal-300 border border-teal-500/40 shadow-sm' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action / Profile Chip */}
          <div className="flex items-center space-x-3">
            {isLoginPage ? (
              <span className="text-xs text-slate-400 font-semibold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                Official Auth Portal
              </span>
            ) : currentUser ? (
              <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl text-xs">
                <div className="w-7 h-7 rounded-full bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  {currentUser.avatar?.length === 2 ? currentUser.avatar : <User className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="font-bold text-white block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-teal-300 capitalize">{currentUser.role} • {currentUser.badge}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Switch Account / Logout"
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors ml-1 border-l border-slate-800 pl-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow"
              >
                Login / Account
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
