import React, { useState } from 'react';
import { 
  Wrench, 
  Bike, 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  LogOut, 
  ShieldCheck, 
  Award, 
  FileText, 
  LayoutDashboard,
  Menu,
  X,
  PhoneCall
} from 'lucide-react';

export default function Navbar({ currentUser, isLoginPage, activeTab, setActiveTab, onLogout, onOpenLogin, cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const customerNavItems = [
    { id: 'booking', label: 'Book Service', icon: Wrench },
    { id: 'services-showcase', label: 'Services', icon: Bike, isScroll: true },
    { id: 'store', label: 'Bike Parts & Oils', icon: ShoppingBag },
    { id: 'amc', label: 'AMC Plans', icon: Award },
    { id: 'reports', label: 'Proof Reports', icon: FileText },
    { id: 'account', label: 'My Garage', icon: User },
  ];

  const mechanicNavItems = [
    { id: 'mechanic', label: 'Mechanic Jobs', icon: Wrench },
    { id: 'reports', label: 'Inspection Proofs', icon: FileText }
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Barcode Audits', icon: FileText },
    { id: 'store', label: 'Manage Store', icon: ShoppingBag }
  ];

  const navItems = currentUser?.role === 'mechanic' 
    ? mechanicNavItems 
    : currentUser?.role === 'admin' 
    ? adminNavItems 
    : customerNavItems;

  const handleNavClick = (item) => {
    if (item.isScroll) {
      setActiveTab('booking');
      setTimeout(() => {
        const el = document.getElementById('services-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setActiveTab(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d0e12]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Moto Style matching reference */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              if (currentUser && !isLoginPage) {
                setActiveTab(currentUser.role === 'mechanic' ? 'mechanic' : currentUser.role === 'admin' ? 'admin' : 'booking');
              }
            }}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Bike className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-2xl tracking-tight text-white">
                  Service<span className="text-amber-400">Setu</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md hidden sm:inline-block">
                  Doorstep Garage
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Professional Two-Wheeler Care & Repair
              </p>
            </div>
          </div>

          {/* Center Navigation Links - Reference Style */}
          {!isLoginPage && (
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                      isActive 
                        ? 'text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Icons & Auth Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Quick Search Action */}
            <button 
              onClick={() => {
                setActiveTab('booking');
                setTimeout(() => {
                  const searchInput = document.getElementById('vehicle-search-input');
                  if (searchInput) searchInput.focus();
                }, 100);
              }}
              title="Search bike models & services"
              className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-colors hidden sm:flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist / SOS Support */}
            <a
              href="tel:1800-SETU-BIKE"
              title="24/7 Breakdown SOS Helpline"
              className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-colors hidden sm:flex items-center justify-center"
            >
              <PhoneCall className="w-5 h-5" />
            </a>

            {/* Store & Cart Icon matching Reference Header */}
            <button 
              onClick={() => setActiveTab('store')}
              title="View Genuine Parts Store"
              className="relative p-2.5 text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-md shadow-amber-500/30">
                {cartCount > 0 ? cartCount : '•'}
              </span>
            </button>

            {/* User Profile / Login */}
            {isLoginPage ? (
              <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
                Secure Login Portal
              </span>
            ) : currentUser ? (
              <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl text-xs">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-xs shadow">
                  {currentUser.avatar?.length === 2 ? currentUser.avatar : <User className="w-4 h-4 stroke-[2.5]" />}
                </div>
                <div className="hidden md:block text-left">
                  <span className="font-extrabold text-white block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-amber-400 font-bold capitalize tracking-wide">{currentUser.role}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout / Switch Role"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="btn-amber-glow text-xs font-black px-4 py-2.5 rounded-xl tracking-wide"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white lg:hidden rounded-xl hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111318] border-b border-white/10 px-4 py-4 space-y-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4 text-amber-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
