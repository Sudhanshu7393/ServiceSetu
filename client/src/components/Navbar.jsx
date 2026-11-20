import React, { useState } from 'react';
import { 
  Bike, 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  LogOut, 
  Wrench, 
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
    { id: 'booking', label: 'Home' },
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
        const el = document.getElementById('services-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setActiveTab(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - MotoFix / ServiceSetu Style matching Reference */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              if (currentUser && !isLoginPage) {
                setActiveTab(currentUser.role === 'mechanic' ? 'mechanic' : currentUser.role === 'admin' ? 'admin' : 'booking');
              }
            }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Bike className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-2xl tracking-tight text-white">
                  Service<span className="text-amber-400">Setu</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md hidden sm:inline-block">
                  Garage
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Professional Two-Wheeler Care & Repair
              </p>
            </div>
          </div>

          {/* Center Navigation Links - Clean Minimal Reference Style */}
          {!isLoginPage && (
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`text-sm font-semibold transition-colors relative py-2 cursor-pointer ${
                      isActive 
                        ? 'text-amber-400 font-bold' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Icons matching Reference Header */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search Icon */}
            <button 
              onClick={() => {
                setActiveTab('booking');
                setTimeout(() => {
                  const searchInput = document.getElementById('vehicle-search-input');
                  if (searchInput) searchInput.focus();
                }, 100);
              }}
              title="Search Models & Services"
              className="p-2 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist / Favorites Heart Icon */}
            <button 
              onClick={() => setActiveTab('store')}
              title="Saved Items"
              className="p-2 text-slate-300 hover:text-amber-400 transition-colors hidden sm:block"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Shopping Cart Icon with Red/Amber Badge */}
            <button 
              onClick={() => setActiveTab('store')}
              title="Cart"
              className="relative p-2 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">
                {cartCount > 0 ? cartCount : '1'}
              </span>
            </button>

            {/* User Profile / Status */}
            {isLoginPage ? (
              <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                Login Required
              </span>
            ) : currentUser ? (
              <div className="flex items-center space-x-2.5 bg-[#14161f] border border-white/10 px-3 py-1.5 rounded-2xl text-xs">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-xs">
                  {currentUser.avatar?.length === 2 ? currentUser.avatar : <User className="w-4 h-4" />}
                </div>
                <div className="hidden md:block text-left">
                  <span className="font-extrabold text-white block text-xs leading-none">{currentUser.name}</span>
                  <span className="text-[10px] text-amber-400 font-bold capitalize">{currentUser.role}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1 text-slate-400 hover:text-red-400 rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="btn-amber-glow text-xs font-black px-4 py-2 rounded-xl"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white lg:hidden rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111318] border-b border-white/10 px-4 py-4 space-y-2">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-400' 
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-amber-400" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
