import React, { useState } from 'react';
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

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    role: 'customer',
    name: 'Amit Patel',
    phone: '+91 98200 12345',
    avatar: 'AP',
    badge: 'Gold Member'
  });

  const [activeTab, setActiveTab] = useState('booking');
  const [selectedBookingForReport, setSelectedBookingForReport] = useState('SS-2026-8801');
  const [isLoginPage, setIsLoginPage] = useState(false);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsLoginPage(false);
    
    if (userData.role === 'customer') {
      setActiveTab('booking');
    } else if (userData.role === 'mechanic') {
      setActiveTab('mechanic');
    } else if (userData.role === 'admin') {
      setActiveTab('admin');
    }
  };

  const handleLogout = () => {
    setIsLoginPage(true);
  };

  const handleBookingCreated = (booking) => {
    if (booking?.id) {
      setSelectedBookingForReport(booking.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-900 font-sans">
      <Navbar 
        currentUser={currentUser} 
        isLoginPage={isLoginPage}
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginPage(true)}
      />

      <main className="flex-grow">
        {isLoginPage ? (
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
