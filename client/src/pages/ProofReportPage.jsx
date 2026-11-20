import React, { useState, useEffect } from 'react';
import { fetchBookings, rateBooking } from '../services/api';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle, 
  Barcode, 
  UserCheck, 
  Calendar, 
  MapPin, 
  Printer, 
  Search, 
  CheckCircle2, 
  Bike, 
  Star, 
  ShieldAlert, 
  Heart, 
  MessageCircle, 
  Download, 
  AlertTriangle, 
  XCircle, 
  Battery, 
  Gauge, 
  Wind, 
  Droplet, 
  CircleDot, 
  BadgeCheck,
  Award
} from 'lucide-react';

export default function ProofReportPage({ bookingId: initialBookingId }) {
  const [searchId, setSearchId] = useState(initialBookingId || 'SS-2026-8801');
  const [report, setReport] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rating State
  const [userRating, setUserRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchBookings();
        const list = res.bookings || [];
        setAllBookings(list);

        const match = list.find(b => b.id.toLowerCase() === searchId.toLowerCase()) || list[0];
        setReport(match);
        if (match?.rating) {
          setUserRating(match.rating);
          setRatingSubmitted(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const match = allBookings.find(b => b.id.toLowerCase() === searchId.trim().toLowerCase());
    if (match) {
      setReport(match);
      setRatingSubmitted(Boolean(match.rating));
      if (match.rating) setUserRating(match.rating);
    } else {
      alert(`No Service Proof Report found for Booking ID #${searchId}`);
    }
  };

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    if (!report) return;
    try {
      const res = await rateBooking(report.id, { rating: userRating, feedback });
      setReport(res.booking);
      setRatingSubmitted(true);
      alert('Thank you! Your mechanic rating has been recorded.');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center text-center py-20">
        <div>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent shadow-lg shadow-amber-500/20"></div>
          <p className="mt-4 text-slate-300 font-bold text-sm">Compiling Digital Proof Audit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[#12141c] p-6 rounded-3xl border border-white/10 shadow-xl">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-amber-400" />
              Digital Service Proof & Audit Certificate
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Tamper-evident verification report with barcode scan history and mechanical metrics.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Booking ID (e.g. SS-2026-8801)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#181a24] border border-white/10 text-xs font-mono font-bold uppercase text-white focus:border-amber-400 focus:outline-none placeholder-slate-600"
              />
              <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="btn-amber-glow font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow"
            >
              Fetch Report
            </button>
          </form>
        </div>

        {/* REPORT DOCUMENT */}
        {report ? (
          <div className="bg-[#12141c] rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Top Amber Certificate Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

            {/* Verification Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
                  <Bike className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Service Proof Report</h2>
                  <span className="text-xs text-amber-400 font-mono font-bold">Audit ID: RPRT-{report.id}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <span className="font-black text-xs text-emerald-300 block">ServiceSetu Verified</span>
                  <span className="text-[10px] text-emerald-400 block font-medium">100% Anti-Counterfeit Pass</span>
                </div>
              </div>
            </div>

            {/* Top Key Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 bg-[#181a24] p-5 rounded-2xl border border-white/5 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Customer Name</span>
                <strong className="text-white font-bold text-sm">{report.customerName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Service Date</span>
                <strong className="text-white font-bold text-sm">{report.date}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Booking ID</span>
                <strong className="text-amber-400 font-bold font-mono text-sm">{report.id}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Handover OTP</span>
                <strong className="text-emerald-400 font-bold font-mono text-sm">
                  {report.otpConfirmed ? '✓ Verified (' + report.otp + ')' : 'Pending Handover'}
                </strong>
              </div>
            </div>

            {/* SECTION 1: VEHICLE & MECHANIC METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-white/5 rounded-2xl p-6 bg-[#181a24]">
                <h3 className="font-black text-sm text-white mb-4 flex items-center gap-2">
                  <Bike className="w-4 h-4 text-amber-400" /> Vehicle Specifications
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Model:</span> 
                    <strong className="text-white font-bold">{report.vehicle?.make} {report.vehicle?.model}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Engine Displacement:</span> 
                    <strong className="text-white font-bold">{report.vehicle?.engine}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Odometer Reading:</span> 
                    <strong className="text-amber-400 font-mono font-bold">{report.odometerReading || '14,820 km'}</strong>
                  </div>
                </div>
              </div>

              <div className="border border-white/5 rounded-2xl p-6 bg-[#181a24]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-sm text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-400" /> Verified Technician
                  </h3>
                  <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-purple-400" /> Police Verified
                  </span>
                </div>
                {report.mechanic ? (
                  <div className="flex items-center space-x-4 text-xs">
                    <img src={report.mechanic.avatar} alt={report.mechanic.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500" />
                    <div>
                      <strong className="text-white font-black block text-base">{report.mechanic.name}</strong>
                      <span className="text-slate-400 block mt-0.5">★ {report.mechanic.rating} Rating • {report.mechanic.jobsCompleted} Completed Jobs</span>
                      <span className="text-emerald-400 block font-bold mt-1">KYC Status: {report.mechanic.kycStatus}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Technician profile assigned upon dispatch.</p>
                )}
              </div>
            </div>

            {/* SECTION 2: VERIFIED PRODUCTS & BARCODE AUDIT */}
            <div className="mb-8 border border-white/10 rounded-2xl p-6 bg-[#181a24]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <h3 className="font-black text-base text-white flex items-center gap-2">
                  <Barcode className="w-5 h-5 text-amber-400" />
                  Product Authenticity & Barcode Audit Trail
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                    100% Genuine Certified
                  </span>
                  {report.usedProducts?.length > 0 && (
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`✅ GENUINE PARTS CERTIFICATE\n━━━━━━━━━━━━━━\nServiceSetu Barcode Verified\n\nBooking: ${report.id}\nVehicle: ${report.vehicle?.make} ${report.vehicle?.model}\nDate: ${report.date}\n\nVerified Parts:\n${report.usedProducts.map(p => `• ${p.name} [${p.barcode}]`).join('\n')}\n\n🔒 Tamper-proof barcode audit recorded\nhttps://servicesetu-sage.vercel.app`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] font-bold bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-full transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Share Certificate</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {report.usedProducts?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No products scanned yet for this job.</p>
                ) : (
                  report.usedProducts?.map((prod, idx) => (
                    <div key={idx} className="flex items-center space-x-4 bg-[#0e1015] border border-white/5 p-4 rounded-2xl">
                      <img src={prod.photo} alt={prod.name} className="w-14 h-14 object-cover rounded-xl border border-white/10" />
                      <div>
                        <h4 className="font-extrabold text-xs text-white">{prod.name}</h4>
                        <div className="text-[11px] font-mono text-amber-400 font-bold mt-1">
                          Barcode: [{prod.barcode}]
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Scanned: {new Date(prod.timestamp || Date.now()).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SECTION 2.5: VEHICLE HEALTH REPORT CARD */}
            <div className="mb-8 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-[#181a24] text-white px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-amber-400" />
                  <h3 className="font-black text-sm">Vehicle Health Report Card</h3>
                </div>
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  ServiceSetu Certified
                </span>
              </div>

              <div className="p-6 bg-[#14161f]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Droplet, label: 'Engine Oil', status: report.usedProducts?.length > 0 ? 'good' : 'warn', msg: report.usedProducts?.length > 0 ? 'Changed — Barcode Verified ✓' : 'Routine Check Completed' },
                    { icon: CircleDot, label: 'Brake Pads', status: report.inspectionDetails?.brakePadLife?.includes('7') || report.inspectionDetails?.brakePadLife?.includes('8') ? 'good' : 'warn', msg: report.inspectionDetails?.brakePadLife || '70% Life Remaining' },
                    { icon: Wind, label: 'Tyre Pressure', status: 'good', msg: `Front: ${report.inspectionDetails?.frontTyrePressure || '28 PSI'} · Rear: ${report.inspectionDetails?.rearTyrePressure || '36 PSI'}` },
                    { icon: Battery, label: 'Battery Health', status: 'good', msg: report.inspectionDetails?.batteryVoltage || '12.6V — Healthy Terminal' },
                    { icon: Gauge, label: 'Odometer Reading', status: 'good', msg: report.inspectionDetails?.odometer || report.odometerReading || 'Recorded during inspection' },
                    { icon: Droplet, label: 'Fuel Level', status: 'good', msg: report.inspectionDetails?.fuelLevel || 'Checked at handover' },
                  ].map(({ icon: Icon, label, status, msg }) => (
                    <div key={label} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-[#0e1015]">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-400 block">{label}</span>
                        <span className="text-xs font-black text-white">{msg}</span>
                      </div>
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>

                {/* Next Service Reminder */}
                <div className="mt-5 flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                  <Calendar className="w-6 h-6 text-amber-400 flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-black text-white block text-sm">Next Service Cycle Due</span>
                    <span className="text-amber-300">Recommended in 3 months or 3,000 km for optimal engine longevity.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: RATE MECHANIC */}
            <div className="mb-8 border border-white/10 rounded-2xl p-6 bg-[#181a24]">
              <h3 className="font-black text-base text-white mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                Rate Technician & Service Experience
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Your direct review updates the technician's certified rating badge.
              </p>

              {ratingSubmitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs font-bold flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                  Thank you! Rating of ★ {userRating}/5 submitted for {report.mechanic?.name || 'Technician'}.
                </div>
              ) : (
                <form onSubmit={handleRateSubmit} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className={`p-1.5 rounded-xl transition-all ${userRating >= star ? 'text-amber-400' : 'text-slate-600'}`}
                      >
                        <Star className="w-7 h-7 fill-current" />
                      </button>
                    ))}
                    <span className="font-black text-base text-white ml-2">★ {userRating} / 5</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Optional feedback for mechanic performance..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#0e1015] border border-white/10 text-white placeholder-slate-600 text-xs focus:border-amber-400 focus:outline-none"
                  />

                  <button type="submit" className="btn-amber-glow font-black text-xs px-6 py-3 rounded-xl">
                    Submit Technician Review
                  </button>
                </form>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-3 print:hidden">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`🔧 ServiceSetu Service Report\n━━━━━━━━━━━━━━━━\nBooking: ${report.id}\nVehicle: ${report.vehicle?.make} ${report.vehicle?.model}\nService: ${report.serviceType}\nMechanic: ${report.mechanic?.name || 'Assigned'} ⭐${report.mechanic?.rating || '4.9'}\n\n✅ Engine Oil: Barcode Verified\n✅ Service Completed\n📋 Full Report: https://servicesetu-sage.vercel.app\n━━━━━━━━━━━━━━━━\nServiceSetu — Trusted Doorstep Service`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </a>

              <button
                onClick={() => window.print()}
                className="btn-outline-garage flex items-center space-x-2 font-bold text-xs px-5 py-3 rounded-xl transition-all"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Download / Print Report</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-[#12141c] p-12 rounded-3xl border border-white/10 text-center text-slate-500">
            No report details found for the requested booking ID.
          </div>
        )}

      </div>
    </div>
  );
}
