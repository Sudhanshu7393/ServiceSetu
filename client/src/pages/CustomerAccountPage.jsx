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
  CheckCircle2
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Profile Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-2xl">
            AP
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold">Amit Patel</h1>
              <span className="bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                Gold Member
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">+91 98200 12345 • Bengaluru, India</p>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 px-4 py-3 rounded-2xl text-xs flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="font-bold text-white block">Proof-Backed Guarantee</span>
            <span className="text-slate-400 text-[11px]">100% Verified Barcode History</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Digital Garage & Health Score */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center">
              <Bike className="w-5 h-5 text-teal-600 mr-2" /> Digital Garage (Saved Vehicles)
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-slate-900">Royal Enfield Classic 350</span>
                <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded">Primary</span>
              </div>
              <p className="text-xs text-slate-500">Reg No: KA-05-MH-8812 • 349cc</p>
              
              {/* Health Score Bars */}
              <div className="mt-4 pt-3 border-t border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-700 flex items-center"><HeartPulse className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Vehicle Health Score</span>
                  <span className="font-extrabold text-emerald-600">88% (Excellent)</span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1"><span>Engine Oil Health:</span> <span>95% (Fresh Synthetic)</span></div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-emerald-500"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1"><span>Brake Pad Life:</span> <span>65%</span></div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-teal-500"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1"><span>Spark Plug & Air Filter:</span> <span>80%</span></div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-[80%] h-full bg-teal-500"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Service Reminders Widget */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 text-teal-600 mr-2" /> Automated Maintenance Reminders
            </h3>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-xs text-teal-900 space-y-1">
              <span className="font-bold block flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-teal-700" /> Next Doorstep Service Due</span>
              <p>Estimated in ~90 days or at 18,000 km odometer reading.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Service History & Digital Invoices */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center">
              <History className="w-5 h-5 text-teal-600 mr-2" /> Service History & Proof Reports
            </h3>

            {customerBookings.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No previous service bookings found.</p>
            ) : (
              <div className="space-y-4">
                {customerBookings.map(b => (
                  <div key={b.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{b.id}</span>
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                          {b.status}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">{b.package?.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{b.vehicle?.make} {b.vehicle?.model} • Oil: {b.oilOption?.brand}</p>
                      <span className="text-[11px] text-slate-400 block mt-1">Serviced on {b.date} by {b.mechanic?.name || 'Verified Mechanic'}</span>
                    </div>

                    <div className="text-right w-full sm:w-auto border-t sm:border-0 pt-2 sm:pt-0">
                      <span className="text-base font-extrabold text-slate-900 block">₹{b.totalPrice}</span>
                      <span className="text-[11px] text-emerald-700 font-semibold block mb-2">Invoice Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
