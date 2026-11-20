import React, { useState } from 'react';
import { 
  Bike, 
  Search, 
  ShoppingBag, 
  User, 
  LogOut, 
  Menu, 
  X, 
  PhoneCall,
  Sparkles
} from 'lucide-react';

export default function Navbar({ currentUser, isLoginPage, activeTab, setActiveTab, onLogout, onOpenLogin, cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const customerNavItems = [
    { id: 'booking', label: 'Models & Booking' },
    { id: 'services-showcase', label: 'Services', isScroll: true },
    { id: 'store', label: 'Bike Parts' },
    { id: 'amc', label: 'AMC Plans' },
    { id: 'reports', label: 'Proof Reports' },
    { id: 'account', label: 'My Garage' },
  ];

  const mechanicNavItems = [
    { id: 'mechanic', label: 'Mechanic Jobs' },
    { id: 'reports', label: 'Inspection Proofs' }
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Dashboard' },
    { id: 'reports', label: 'Barcode Audits' },
    { id: 'store', label: 'Store Management' }
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
        const el = document.getElementById('signature-packages-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setActiveTab(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#060709]/90 backdrop-blur-xl border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Reference MOTO Style */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => {
              if (currentUser && !isLoginPage) {
                setActiveTab(currentUser.role === 'mechanic' ? 'mechanic' : currentUser.role === 'admin' ? 'admin' : 'booking');
              }
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Bike className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-black text-2xl tracking-tight text-white">
                Service<span className="text-orange-500">Setu</span>
              </span>
            </div>
          </div>

          {/* Center Navigation Links - Reference Style: Clean, Spaced, Subtle */}
          {!isLoginPage && (
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`text-sm tracking-wide transition-all relative py-1 cursor-pointer font-medium ${
                      isActive 
                        ? 'text-white font-bold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-orange-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center space-x-4">
            
            {/* Minimal Search Button */}
            <button 
              onClick={() => {
                setActiveTab('booking');
                setTimeout(() => {
                  const searchInput = document.getElementById('vehicle-search-input');
                  if (searchInput) searchInput.focus();
                }, 100);
              }}
              title="Search Models & Services"
              className="p-2 text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Shopping Cart Icon with Red Pill Badge */}
            <button 
              onClick={() => setActiveTab('store')}
              title="Genuine Parts Cart"
              className="relative p-2 text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 rounded-full bg-orange-500 text-slate-950 text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Order Now Button (Exact shape from Reference) */}
            <button
              onClick={() => {
                setActiveTab('booking');
                setTimeout(() => {
                  const el = document.getElementById('booking-flow-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="btn-copper-pill text-xs font-black px-5 py-2.5 rounded-full tracking-wide shadow-md hidden sm:inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Order Now</span>
            </button>

            {/* User Profile / Status */}
            {currentUser && !isLoginPage && (
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-slate-950 font-black flex items-center justify-center text-[10px]">
                  {currentUser.avatar?.length === 2 ? currentUser.avatar : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="text-white font-bold hidden md:inline">{currentUser.name?.split(' ')[0]}</span>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1 text-slate-400 hover:text-red-400 rounded-full transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white lg:hidden rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0e12] border-b border-white/10 px-6 py-5 space-y-3">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between py-2 text-sm font-semibold ${
                  isActive ? 'text-orange-500 font-bold' : 'text-slate-300'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
