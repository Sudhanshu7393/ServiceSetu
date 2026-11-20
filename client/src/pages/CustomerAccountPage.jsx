import React, { useState, useEffect } from 'react';
import { fetchBookings } from '../services/api';
import { 
  User, 
  Bike, 
  HeartPulse, 
  History, 
  Bell, 
  FileText, 
  ShieldCheck, 
  Download,
  Calendar,
  CheckCircle2,
  Wrench,
  Award
} from 'lucide-react';

export default function CustomerAccountPage() {
  const [customerBookings, setCustomerBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchBookings({ phone: '+91 98200 12345' });
        setCustomerBookings(res.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-[#12141c] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20">
              AP
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-white">Amit Patel</h1>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  Gold Club Rider
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">+91 98200 12345 • Koramangala, Bengaluru</p>
            </div>
          </div>

          <div className="bg-[#181a24] border border-white/10 px-4 py-3 rounded-2xl text-xs flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <div>
              <span className="font-bold text-white block">Proof-Backed Guarantee</span>
              <span className="text-slate-400 text-[11px]">100% Verified Barcode History</span>
            </div>
          </div>
        </div>

        {/* Dashboard 3 Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: My Garage Two-Wheeler */}
          <div className="bg-[#12141c] rounded-3xl p-6 border border-white/10 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  Registered Motorcycle
                </span>
                <Bike className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-black text-lg text-white">Honda CB350 H'ness</h3>
              <p className="text-xs text-slate-400 mt-1">348cc • Reg: KA-01-MJ-8891</p>
              
              <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Last Service:</span> <strong className="text-white">12 Oct 2026</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Engine Oil Used:</span> <strong className="text-amber-400">Motul 7100 4T 10W-40</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Next Service Due:</span> <strong className="text-emerald-400">Jan 2027</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Vehicle Health Status */}
          <div className="bg-[#12141c] rounded-3xl p-6 border border-white/10 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                  Audit Score: 98/100
                </span>
                <HeartPulse className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-black text-lg text-white">Digital Health Index</h3>
              <p className="text-xs text-slate-400 mt-1">Monitored via ServiceSetu Barcode & Inspection</p>

              <div className="mt-4 pt-4 border-t border-white/5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Brake Pad Wear:</span>
                  <span className="text-emerald-400 font-bold">Good (75% Life)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Battery Voltage:</span>
                  <span className="text-emerald-400 font-bold">12.6V (Optimal)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tyre Pressure:</span>
                  <span className="text-white font-bold">28F / 36R PSI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: AMC Subscription Status */}
          <div className="bg-[#12141c] rounded-3xl p-6 border border-amber-500/40 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                  Active Subscription
                </span>
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-black text-lg text-white">Gold Protection AMC</h3>
              <p className="text-xs text-slate-400 mt-1">Valid through Oct 2027</p>

              <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Free Services Remaining:</span> <strong className="text-amber-400">3 of 4 Visits</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Roadside SOS Dispatches:</span> <strong className="text-white">2 Emergency Passes</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Spare Parts Discount:</span> <strong className="text-emerald-400">15% Off Active</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Service History Timeline */}
        <div className="bg-[#12141c] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-lg text-white">Doorstep Service History & Reports</h3>
            </div>
            <span className="text-xs text-slate-400 font-bold">
              {customerBookings.length} Completed Service Audits
            </span>
          </div>

          <div className="space-y-4">
            {customerBookings.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No past service orders on record yet.
              </div>
            ) : (
              customerBookings.map(booking => (
                <div key={booking.id} className="bg-[#181a24] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black flex-shrink-0">
                      <Bike className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <strong className="text-white font-bold text-sm">{booking.vehicle?.make} {booking.vehicle?.model}</strong>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-black uppercase">
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {booking.serviceType} • OTP: <span className="font-mono text-amber-400 font-bold">{booking.otp}</span>
                      </p>
                      <span className="text-[11px] text-slate-500 block mt-0.5">Booking #{booking.id} • {booking.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                    <div className="text-left sm:text-right mr-2">
                      <span className="text-base font-black text-amber-400 font-mono block">₹{booking.totalPrice}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Paid & Verified</span>
                    </div>

                    <a
                      href={`https://servicesetu-sage.vercel.app`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-garage text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Proof Audit</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
