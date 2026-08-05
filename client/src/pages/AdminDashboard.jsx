import React, { useState, useEffect } from 'react';
import { fetchBookings, fetchAuditLogs } from '../services/api';
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  Barcode, 
  Award, 
  ShoppingBag, 
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  UserCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [bRes, aRes] = await Promise.all([
        fetchBookings(),
        fetchAuditLogs()
      ]);
      setBookings(bRes.bookings || []);
      setAuditLogs(aRes.logs || []);
    } catch (err) {
      console.error('Admin fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Calculate 4-Way Revenue Breakdown
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const bookingFeeRevenue = Math.round(totalRevenue * 0.55);
  const oilMarginRevenue = Math.round(totalRevenue * 0.25);
  const accessoryRevenue = Math.round(totalRevenue * 0.12);
  const amcRevenue = Math.round(totalRevenue * 0.08);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xl">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold">ServiceSetu Platform Operations Hub</h1>
              <span className="bg-purple-950 text-purple-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border border-purple-800">
                SuperAdmin Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Logged in as: <strong className="text-white">Sudhanshu Pandey</strong> (sudhanshupandey7393@gmail.com)</p>
          </div>
        </div>

        <button
          onClick={loadAdminData}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Real Data</span>
        </button>
      </div>

      {/* 4-Way Revenue Stream Breakdown Cards */}
      <div>
        <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-teal-600 mr-2" />
          4-Way Revenue Breakdown Engine
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-bold">1. Booking Charges (55%)</span>
              <Wrench className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">₹{bookingFeeRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-slate-500">Service labor & doorstep visit fees</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-bold">2. Oil Margins (25%)</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">₹{oilMarginRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-slate-500">Synthetic oil brand upgrade margins</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-bold">3. Accessories (12%)</span>
              <ShoppingBag className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">₹{accessoryRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-slate-500">Filters, spark plugs & spare parts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-bold">4. AMC Contracts (8%)</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">₹{amcRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-slate-500">Annual maintenance subscriptions</p>
          </div>

        </div>
      </div>

      {/* Duplicate Barcode Security Incident Audit Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center">
              <ShieldAlert className="w-5 h-5 text-red-600 mr-2" />
              Duplicate Barcode Security Incident Audit Log ({auditLogs.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time fraud prevention engine tracking duplicate barcode reuse attempts.</p>
          </div>
          <span className="bg-red-50 text-red-700 border border-red-200 font-bold text-xs px-3 py-1 rounded-xl">
            Live Security Audit Active
          </span>
        </div>

        {auditLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border">
            No barcode duplicate security incidents flagged. All scanned products verified unique!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Incident ID</th>
                  <th className="py-3 px-4">Attempted Barcode</th>
                  <th className="py-3 px-4">Target Booking</th>
                  <th className="py-3 px-4">Mechanic</th>
                  <th className="py-3 px-4">Original Registered Booking</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-red-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{log.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-red-700">{log.attemptedBarcode}</td>
                    <td className="py-3 px-4 font-mono">{log.bookingId}</td>
                    <td className="py-3 px-4">{log.mechanicName} ({log.mechanicId})</td>
                    <td className="py-3 px-4 font-mono text-amber-800">Booking #{log.originalBookingId}</td>
                    <td className="py-3 px-4">
                      <span className="bg-red-100 text-red-800 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full border border-red-300">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
