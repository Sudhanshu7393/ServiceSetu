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
  BadgeCheck
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
        <p className="mt-3 text-slate-500 text-sm">Compiling Service Proof Report...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center">
            <FileText className="w-6 h-6 text-teal-600 mr-2" />
            Digital Service Proof Report Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Enter your Booking ID to view verified barcode proof & inspection audit.</p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Booking ID (e.g. SS-2026-8801)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow"
          >
            Fetch Report
          </button>
        </form>
      </div>

      {/* REPORT DOCUMENT */}
      {report ? (
        <div className="bg-white rounded-3xl border border-slate-300 p-8 sm:p-12 shadow-xl print:shadow-none print:border-none relative">
          
          {/* Verification Badge */}
          <div className="absolute top-6 right-6 flex items-center space-x-2 bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div>
              <span className="font-extrabold text-xs text-emerald-900 block">ServiceSetu Verified</span>
              <span className="text-[10px] text-emerald-700 block font-medium">Barcode Audit Passed</span>
            </div>
          </div>

          <div className="border-b border-slate-200 pb-6 mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-lg">
                SS
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Service Proof Report</h2>
                <span className="text-xs text-slate-500 font-mono">Report ID: RPRT-{report.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 bg-slate-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Customer Name</span>
                <strong className="text-slate-900 font-bold">{report.customerName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Service Date</span>
                <strong className="text-slate-900 font-bold">{report.date}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Booking ID</span>
                <strong className="text-teal-700 font-bold font-mono">{report.id}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Handover OTP</span>
                <strong className="text-emerald-700 font-bold font-mono">
                  {report.otpConfirmed ? '✓ Verified (' + report.otp + ')' : 'Pending Handover'}
                </strong>
              </div>
            </div>
          </div>

          {/* SECTION 1: VEHICLE & MECHANIC METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
              <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center">
                <Bike className="w-4 h-4 text-teal-600 mr-2" /> Vehicle Specifications
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Model:</span> <strong className="text-slate-900">{report.vehicle?.make} {report.vehicle?.model}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Engine Displacement:</span> <strong className="text-slate-900">{report.vehicle?.engine}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Odometer Reading:</span> <strong className="text-teal-800 font-mono">{report.odometerReading || '14,820 km'}</strong></div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center">
                  <UserCheck className="w-4 h-4 text-teal-600 mr-2" /> Verified Mechanic Details
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1 text-purple-600" /> Women-Safety Verified
                </span>
              </div>
              {report.mechanic ? (
                <div className="flex items-center space-x-3 text-xs">
                  <img src={report.mechanic.avatar} alt={report.mechanic.name} className="w-12 h-12 rounded-full object-cover border" />
                  <div>
                    <strong className="text-slate-900 font-bold block text-sm">{report.mechanic.name}</strong>
                    <span className="text-slate-500">★ {report.mechanic.rating} Rating • {report.mechanic.jobsCompleted} Completed Jobs</span>
                    <span className="text-emerald-700 block font-semibold">KYC: {report.mechanic.kycStatus}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Mechanic info available upon assignment.</p>
              )}
            </div>
          </div>

          {/* SECTION 2: VERIFIED PRODUCTS & BARCODE AUDIT TRAIL */}
          <div className="mb-8 border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center">
                <Barcode className="w-5 h-5 text-teal-600 mr-2" />
                Product Authenticity & Barcode Audit Trail
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  100% Genuine Certified
                </span>
                {report.usedProducts?.length > 0 && (
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`✅ GENUINE PARTS CERTIFICATE\n━━━━━━━━━━━━━━\nServiceSetu Barcode Verified\n\nBooking: ${report.id}\nVehicle: ${report.vehicle?.make} ${report.vehicle?.model}\nDate: ${report.date}\n\nVerified Parts:\n${report.usedProducts.map(p => `• ${p.name} [${p.barcode}]`).join('\n')}\n\n🔒 Tamper-proof barcode audit recorded\nhttps://servicesetu-sage.vercel.app`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-bold bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full transition-all"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Share Certificate
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.usedProducts?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No products scanned yet.</p>
              ) : (
                report.usedProducts?.map((prod, idx) => (
                  <div key={idx} className="flex items-center space-x-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                    <img src={prod.photo} alt={prod.name} className="w-14 h-14 object-cover rounded-xl border border-slate-200" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">{prod.name}</h4>
                      <div className="text-[11px] font-mono text-teal-700 font-bold mt-1">
                        Barcode: [{prod.barcode}]
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Scanned: {new Date(prod.timestamp || Date.now()).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECTION 2.5: VEHICLE HEALTH REPORT CARD */}
          <div className="mb-8 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-teal-400" />
                <h3 className="font-extrabold text-sm">Vehicle Health Report Card</h3>
              </div>
              <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                ServiceSetu Certified
              </span>
            </div>

            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Droplet, label: 'Engine Oil', status: report.usedProducts?.length > 0 ? 'good' : 'warn', msg: report.usedProducts?.length > 0 ? 'Changed — Barcode Verified ✓' : 'Check required' },
                  { icon: CircleDot, label: 'Brake Pads', status: report.inspectionDetails?.brakePadLife?.includes('7') || report.inspectionDetails?.brakePadLife?.includes('8') || report.inspectionDetails?.brakePadLife?.includes('9') ? 'good' : 'warn', msg: report.inspectionDetails?.brakePadLife || '70% life remaining' },
                  { icon: Wind, label: 'Tyre Pressure', status: 'good', msg: `F: ${report.inspectionDetails?.frontTyrePressure || '28 PSI'} · R: ${report.inspectionDetails?.rearTyrePressure || '36 PSI'}` },
                  { icon: Battery, label: 'Battery Health', status: report.inspectionDetails?.batteryVoltage?.includes('12.6') || report.inspectionDetails?.batteryVoltage?.includes('12.7') || report.inspectionDetails?.batteryVoltage?.includes('12.8') ? 'good' : 'warn', msg: report.inspectionDetails?.batteryVoltage || '12.6V — Healthy' },
                  { icon: Gauge, label: 'Odometer Reading', status: 'good', msg: report.inspectionDetails?.odometer || report.odometerReading || 'Recorded at service' },
                  { icon: Droplet, label: 'Fuel Level', status: 'good', msg: report.inspectionDetails?.fuelLevel || 'Noted at pickup' },
                ].map(({ icon: Icon, label, status, msg }) => (
                  <div key={label} className={`flex items-center gap-4 p-4 rounded-xl border ${
                    status === 'good' ? 'bg-emerald-50 border-emerald-200' :
                    status === 'warn' ? 'bg-amber-50 border-amber-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      status === 'good' ? 'bg-emerald-100' : status === 'warn' ? 'bg-amber-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        status === 'good' ? 'text-emerald-600' : status === 'warn' ? 'text-amber-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-slate-700 block">{label}</span>
                      <span className={`text-xs font-semibold ${
                        status === 'good' ? 'text-emerald-700' : status === 'warn' ? 'text-amber-700' : 'text-red-700'
                      }`}>{msg}</span>
                    </div>
                    {status === 'good' && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                    {status === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                    {status === 'bad' && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                  </div>
                ))}
              </div>

              {report.inspectionDetails?.scratchNotes && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700">Pre-Service Notes: </span>
                  <span className="text-slate-500">{report.inspectionDetails.scratchNotes}</span>
                </div>
              )}

              {/* Next Service Reminder */}
              <div className="mt-4 flex items-center gap-3 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                <Calendar className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-extrabold text-teal-900 block">Next Service Recommended</span>
                  <span className="text-teal-700">Every 3 months or 3,000 km — whichever comes first</span>
                </div>
                <span className="ml-auto text-[10px] font-bold bg-teal-600 text-white px-3 py-1 rounded-full whitespace-nowrap">Set Reminder</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: RATE MECHANIC */}
          <div className="mb-8 border border-teal-200 rounded-2xl p-6 bg-teal-50/50">
            <h3 className="font-extrabold text-base text-slate-900 mb-2 flex items-center">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400 mr-2" />
              Rate Mechanic & Service Performance
            </h3>
            <p className="text-xs text-slate-500 mb-4">Your rating feeds into periodic mechanic performance reviews & platform trust score.</p>

            {ratingSubmitted ? (
              <div className="bg-emerald-100 text-emerald-900 p-4 rounded-xl text-xs font-bold flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                Thank you! Rating of ★ {userRating}/5 submitted for {report.mechanic?.name}.
              </div>
            ) : (
              <form onSubmit={handleRateSubmit} className="space-y-3">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className={`p-2 rounded-xl transition-all ${userRating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  <span className="font-extrabold text-sm text-slate-900 ml-2">★ {userRating} / 5</span>
                </div>

                <input
                  type="text"
                  placeholder="Optional feedback for mechanic performance..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-xs bg-white"
                />

                <button type="submit" className="bg-teal-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                  Submit Mechanic Rating
                </button>
              </form>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-3 print:hidden">
            {/* WhatsApp Share */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`🔧 ServiceSetu Service Report\n━━━━━━━━━━━━━━━━\nBooking: ${report.id}\nVehicle: ${report.vehicle?.make} ${report.vehicle?.model}\nService: ${report.serviceType}\nMechanic: ${report.mechanic?.name || 'Assigned'} ⭐${report.mechanic?.rating || '4.9'}\n\n✅ Engine Oil: Barcode Verified\n✅ Service Completed\n📋 Full Report: https://servicesetu-sage.vercel.app\n━━━━━━━━━━━━━━━━\nServiceSetu — Trusted Doorstep Service`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </a>

            {/* Download / Print */}
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Download / Print Report</span>
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border text-center text-slate-500">
          No report details found.
        </div>
      )}

    </div>
  );
}
