import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import BookingPage from './pages/BookingPage';
import MechanicDashboard from './pages/MechanicDashboard';
import ProofReportPage from './pages/ProofReportPage';
import AdminDashboard from './pages/AdminDashboard';
import StorePage from './pages/StorePage';
import AmcPage from './pages/AmcPage';
import CustomerAccountPage from './pages/CustomerAccountPage';
import { subscribeAuthState, logoutFirebase } from './services/firebase';

export default function App() {
  // PERSISTENT LOGIN STATE: Restore session from localStorage so user is NEVER logged out on reload
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('servicesetu_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedTab = localStorage.getItem('servicesetu_active_tab');
      return savedTab || 'booking';
    } catch (e) {
      return 'booking';
    }
  });

  const [selectedBookingForReport, setSelectedBookingForReport] = useState('SS-2026-8801');

  // isLoginPage is ONLY true if there is NO currentUser stored
  const [isLoginPage, setIsLoginPage] = useState(() => {
    try {
      return !localStorage.getItem('servicesetu_user');
    } catch (e) {
      return false;
    }
  });

  // Keep Firebase Auth State in sync
  useEffect(() => {
    const unsubscribe = subscribeAuthState((firebaseUser) => {
      if (firebaseUser) {
        const userEmail = (firebaseUser.email || '').trim().toLowerCase();
        const isAdmin = userEmail === 'sudhanshupandey7393@gmail.com';
        
        // If not already set or different, update
        const stored = localStorage.getItem('servicesetu_user');
        if (!stored) {
          const autoUser = {
            role: isAdmin ? 'admin' : 'customer',
            name: isAdmin ? 'Sudhanshu Pandey' : (firebaseUser.displayName || userEmail.split('@')[0] || 'Customer User'),
            email: userEmail,
            avatar: firebaseUser.photoURL || (isAdmin ? 'SP' : 'CU'),
            badge: isAdmin ? 'Platform SuperAdmin' : 'Customer Account'
          };
          localStorage.setItem('servicesetu_user', JSON.stringify(autoUser));
          setCurrentUser(autoUser);
          setIsLoginPage(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (userData) => {
    try {
      localStorage.setItem('servicesetu_user', JSON.stringify(userData));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    setCurrentUser(userData);
    setIsLoginPage(false);
    
    if (userData.role === 'customer') {
      setActiveTab('booking');
      localStorage.setItem('servicesetu_active_tab', 'booking');
    } else if (userData.role === 'mechanic') {
      setActiveTab('mechanic');
      localStorage.setItem('servicesetu_active_tab', 'mechanic');
    } else if (userData.role === 'admin') {
      setActiveTab('admin');
      localStorage.setItem('servicesetu_active_tab', 'admin');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('servicesetu_user');
      localStorage.removeItem('servicesetu_active_tab');
    } catch (e) {}
    logoutFirebase();
    setCurrentUser(null);
    setIsLoginPage(true);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    try {
      localStorage.setItem('servicesetu_active_tab', tabId);
    } catch (e) {}
  };

  const handleBookingCreated = (booking) => {
    if (booking?.id) {
      setSelectedBookingForReport(booking.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar 
        currentUser={currentUser} 
        isLoginPage={isLoginPage}
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginPage(true)}
      />

      <main className="flex-grow">
        {isLoginPage || !currentUser ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <>
            {activeTab === 'booking' && <BookingPage onBookingCreated={handleBookingCreated} />}
            {activeTab === 'mechanic' && <MechanicDashboard mechanicId="mech-101" />}
            {activeTab === 'reports' && <ProofReportPage bookingId={selectedBookingForReport} />}
            {activeTab === 'account' && <CustomerAccountPage />}
            {activeTab === 'admin' && <AdminDashboard />}
            {activeTab === 'store' && <StorePage />}
            {activeTab === 'amc' && <AmcPage />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
