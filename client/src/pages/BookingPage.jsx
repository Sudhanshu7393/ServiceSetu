import React, { useState, useEffect } from 'react';
import { 
  fetchVehicles, 
  fetchServicePackages, 
  fetchOilOptions, 
  createBooking 
} from '../services/api';
import RazorpayModal from '../components/RazorpayModal';
import LiveTrackingModal from '../components/LiveTrackingModal';
import { 
  Bike, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Droplet, 
  Sparkles, 
  Phone, 
  UserCheck, 
  CheckCircle2, 
  FileCheck, 
  Navigation, 
  Search, 
  PlusCircle, 
  HelpCircle,
  BadgeCheck,
  RefreshCcw,
  Zap,
  ChevronLeft,
  ChevronRight,
  Shield,
  Star,
  Wrench,
  Fuel
} from 'lucide-react';

export default function BookingPage({ onBookingCreated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Data
  const [vehiclesData, setVehiclesData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [oilOptionsData, setOilOptionsData] = useState([]);

  // Vehicle Search & Custom Entry
  const [searchQuery, setSearchQuery] = useState('');
  const [customMake, setCustomMake] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [isCustomVehicle, setIsCustomVehicle] = useState(false);

  // Form Selections
  const [selectedMake, setSelectedMake] = useState('Honda');
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [selectedOil, setSelectedOil] = useState(null);

  // Schedule & Location
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:30 AM');
  const [customerName, setCustomerName] = useState('Amit Patel');
  const [customerPhone, setCustomerPhone] = useState('+91 98200 12345');
  const [address, setAddress] = useState('Flat 402, Royal Palms, Koramangala 4th Block, Bengaluru');
  const [pincode, setPincode] = useState('560034');
  const [locationCoords, setLocationCoords] = useState({ lat: 12.9352, lng: 77.6245 });

  // Modal States
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Services Carousel Scroll
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);

  const showcaseServices = [
    {
      id: 'srv-1',
      title: 'General Bike Service',
      desc: 'Routine maintenance with oil change & inspection.',
      tag: 'Doorstep Special',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
      targetPkgId: 'pkg-standard'
    },
    {
      id: 'srv-2',
      title: 'Engine Tune-Up',
      desc: 'Improve bike performance, mileage & smoothness.',
      tag: 'Performance',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
      targetPkgId: 'pkg-performance'
    },
    {
      id: 'srv-3',
      title: 'Bike Washing & Detailing',
      desc: 'Shine & protect with premium foam wash + polish.',
      tag: 'Shine & Spa',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
      targetPkgId: 'pkg-standard'
    },
    {
      id: 'srv-4',
      title: 'Brake & Clutch Repair',
      desc: 'Smooth and responsive control on every ride.',
      tag: 'Safety Check',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80',
      targetPkgId: 'pkg-heavy'
    }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [vRes, pRes, oRes] = await Promise.all([
          fetchVehicles(),
          fetchServicePackages(),
          fetchOilOptions()
        ]);
        setVehiclesData(vRes.data || []);
        setPackagesData(pRes.data || []);
        setOilOptionsData(oRes.data || []);

        if (vRes.data?.[0]?.models?.[0]) {
          setSelectedMake(vRes.data[0].make);
          setSelectedModel(vRes.data[0].models[0]);
        }
        if (pRes.data?.[1]) setSelectedPkg(pRes.data[1]);
        if (oRes.data?.[0]) setSelectedOil(oRes.data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const currentMakeObj = vehiclesData.find(v => v.make === selectedMake);
  const availableModels = currentMakeObj?.models || [];

  const filteredModels = availableModels.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const basePrice = selectedPkg?.price || 0;
  const oilUpgradeCost = selectedOil?.priceDifference || 0;
  const subtotal = basePrice + oilUpgradeCost;
  const gstAmount = Math.round(subtotal * 0.18);
  const totalPrice = subtotal + gstAmount;

  const handlePaymentSuccess = async () => {
    setShowRazorpay(false);
    try {
      setIsSubmitting(true);
      const vehiclePayload = isCustomVehicle ? {
        make: customMake,
        model: customModel,
        engine: 'Custom Engine',
        category: 'Custom Motorcycle',
        defaultOilQty: '1.0L'
      } : {
        make: selectedMake,
        model: selectedModel.name,
        engine: selectedModel.engine,
        category: selectedModel.category,
        defaultOilQty: selectedModel.defaultOilQty
      };

      const payload = {
        customerName,
        customerPhone,
        address,
        pincode,
        vehicle: vehiclePayload,
        servicePackage: selectedPkg,
        oilBrand: selectedOil,
        scheduledDate: bookingDate,
        timeSlot,
        pricing: {
          basePrice,
          oilUpgradeCost,
          subtotal,
          gstAmount,
          totalPrice
        },
        locationCoords
      };

      const res = await createBooking(payload);
      if (res.success && res.booking) {
        setCreatedBooking(res.booking);
        setStep(6);
        if (onBookingCreated) {
          onBookingCreated(res.booking);
        }
      }
    } catch (err) {
      alert(`Booking submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToBooking = () => {
    const el = document.getElementById('booking-flow-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectServiceCard = (srv) => {
    if (packagesData.length > 0) {
      const match = packagesData.find(p => p.id === srv.targetPkgId) || packagesData[0];
      setSelectedPkg(match);
    }
    scrollToBooking();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center bg-[#0b0c10]">
        <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-amber-500 border-t-transparent shadow-lg shadow-amber-500/20"></div>
        <p className="mt-5 text-slate-300 font-bold text-sm tracking-wide">Initializing ServiceSetu Garage System...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-red-950/40 border border-red-500/40 rounded-3xl text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-xl font-black text-white">Backend Connection Error</h3>
        <p className="text-sm text-red-300 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION - EXACT REPLICA OF THE REFERENCE IMAGE DESIGN             */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-6 pb-16 lg:py-16 border-b border-white/5 bg-[#0b0c10]">
        
        {/* Large Bold Geometric Speed Chevron Slashes (Right Side of Reference) */}
        <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none hidden lg:block overflow-hidden">
          <svg className="w-full h-full opacity-35" viewBox="0 0 700 600" fill="none" preserveAspectRatio="none">
            <polygon points="350,0 700,0 520,600 170,600" fill="#1b1d24" />
            <polygon points="460,0 700,0 590,600 350,600" fill="#22252e" />
            <polygon points="580,0 700,0 660,600 540,600" fill="#2d303b" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* LEFT COLUMN: THE ICONIC TALL GOLDEN ARCH & SEAMLESS CUTOUT MOTORCYCLE */}
            <div className="lg:col-span-5 flex justify-center items-end relative min-h-[380px] sm:min-h-[440px]">
              
              {/* The Signature Tall Golden/Amber Arch from Reference */}
              <div className="w-[280px] sm:w-[340px] h-[360px] sm:h-[430px] rounded-t-full border-[14px] border-[#e58a13] shadow-[0_0_60px_rgba(229,138,19,0.35)] relative flex items-center justify-center">
                {/* Subtle soft ambient halo inside arch */}
                <div className="w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              </div>

              {/* The Seamless Cutout Motorcycle - Grounded directly in front with ZERO background box! */}
              <div className="absolute -bottom-2 -left-4 sm:-left-8 w-[340px] sm:w-[440px] lg:w-[480px] pointer-events-none transition-transform hover:scale-105 duration-500 drop-shadow-[0_25px_30px_rgba(0,0,0,0.95)]">
                <img 
                  src="/images/hero-bike.png" 
                  alt="Performance Custom Motorcycle" 
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    // Fallback to alt transparent bike if primary fails
                    e.target.src = "/images/hero-bike-alt.png";
                  }}
                />
              </div>

            </div>

            {/* RIGHT COLUMN: HEADLINE, DESCRIPTION & BUTTONS */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Exact High-Impact Headline from Reference */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                <span className="text-[#e58a13] block">
                  Best Bike Repair
                </span>
                <span className="text-[#e58a13] block">
                  & Maintenance Services
                </span>
              </h1>

              {/* Exact Subtext from Reference */}
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Professional two-wheeler servicing, repairs, detailing & performance upgrades. Trusted by riders for precision and care.
              </p>

              {/* Action Buttons exactly matching Reference Design */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={scrollToBooking}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-base font-extrabold bg-[#e58a13] hover:bg-[#d97706] text-slate-950 transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Service</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('services-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-base font-bold text-white border border-white/60 hover:border-[#e58a13] hover:text-[#e58a13] transition-all bg-transparent cursor-pointer"
                >
                  <span>View All Services</span>
                </button>
              </div>

              {/* Live Metric Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <strong className="text-white text-lg font-black block">250+</strong>
                  <span className="text-slate-400 text-xs">Bike Models</span>
                </div>
                <div>
                  <strong className="text-[#e58a13] text-lg font-black block">100%</strong>
                  <span className="text-slate-400 text-xs">Barcode Genuine</span>
                </div>
                <div>
                  <strong className="text-emerald-400 text-lg font-black block">7-Day</strong>
                  <span className="text-slate-400 text-xs">Free Redo Warranty</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. "OUR SERVICES" CAROUSEL ROW - MATCHING BOTTOM HALF OF REFERENCE         */}
      {/* ========================================================================= */}
      <section id="services-section" className="py-14 bg-[#14161d] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Navigation Arrows */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#e58a13] mb-1">
                <Bike className="w-5 h-5 stroke-[2.5]" />
                <span className="text-xs font-black uppercase tracking-wider">Our Services</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Best Bike Repair & Maintenance Services
              </h2>
            </div>

            {/* Orange Arrow Controls from Reference */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveServiceIdx((prev) => (prev > 0 ? prev - 1 : showcaseServices.length - 1))}
                className="w-8 h-8 rounded-lg bg-[#e58a13] hover:bg-[#d97706] text-slate-950 flex items-center justify-center font-black transition-all"
                title="Previous service"
              >
                <ChevronLeft className="w-4 h-4 stroke-[3]" />
              </button>
              <button 
                onClick={() => setActiveServiceIdx((prev) => (prev < showcaseServices.length - 1 ? prev + 1 : 0))}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-950 flex items-center justify-center font-black transition-all"
                title="Next service"
              >
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* 4 Photographic Cards exactly matching Reference Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {showcaseServices.map((srv, idx) => (
              <div
                key={srv.id}
                onClick={() => handleSelectServiceCard(srv)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer h-72 sm:h-80 transition-all duration-300 ${
                  activeServiceIdx === idx 
                    ? 'ring-2 ring-[#e58a13] scale-[1.02] shadow-2xl' 
                    : 'hover:-translate-y-1 shadow-lg'
                }`}
              >
                {/* Background Photo */}
                <img 
                  src={srv.image} 
                  alt={srv.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90"
                />

                {/* Vignette Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Card Text Content (Anchored at Bottom like Reference) */}
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <h3 className="text-base font-extrabold text-white group-hover:text-[#e58a13] transition-colors leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 7-DAY GUARANTEE & SERVICE WORKFLOW EXPLAINER                           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* 7-Day Guarantee Banner */}
        <div className="bg-[#12141c] border border-amber-500/30 rounded-3xl p-5 sm:p-6 mb-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#e58a13] text-slate-950 flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-amber-500/20">
              <BadgeCheck className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-white font-black text-base sm:text-lg">
                ServiceSetu 7-Day Satisfaction Guarantee
              </h4>
              <p className="text-xs text-slate-300">
                Not 100% happy with your service? Our mobile master technician will redo it for FREE. No questions asked.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-amber-300 flex-wrap justify-center">
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <RefreshCcw className="w-3.5 h-3.5 text-amber-400" /> Free Redo Guarantee
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> 30-Day Parts Warranty
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> 90-Min Arrival
            </span>
          </div>
        </div>

        {/* 4 Simple Steps Explainer */}
        <div className="bg-[#12141c] border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-400">
              How Doorstep Two-Wheeler Servicing Works
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: '01', title: 'Pick Vehicle & Package', desc: 'Select your bike brand, model & upfront engine oil.' },
              { num: '02', title: 'Mechanic at Your Door', desc: 'Verified technician arrives with tools and consumable kit.' },
              { num: '03', title: 'Barcode-Verified Service', desc: 'Real-time oil scan & physical inspection audit.' },
              { num: '04', title: 'OTP Handover & Proof', desc: 'Digital report with health metrics & warranty certificate.' },
            ].map(stepItem => (
              <div key={stepItem.num} className="bg-[#181a24] p-5 rounded-2xl border border-white/5 relative group hover:border-amber-500/30 transition-colors">
                <span className="text-2xl font-black text-amber-500/30 group-hover:text-amber-500/80 transition-colors block mb-2 font-mono">
                  {stepItem.num}
                </span>
                <strong className="text-white font-extrabold text-sm block mb-1">{stepItem.title}</strong>
                <p className="text-xs text-slate-400 leading-relaxed">{stepItem.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. THE INTERACTIVE BOOKING FLOW - DARK LUXURY WORKSHOP THEME              */}
      {/* ========================================================================= */}
      <section id="booking-flow-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Stepper Progress Bar */}
        {step < 6 && (
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-4xl mx-auto bg-[#12141c] border border-white/10 p-3.5 sm:p-4 rounded-2xl shadow-xl">
              {[
                { num: 1, title: 'Select Vehicle' },
                { num: 2, title: 'Service Package' },
                { num: 3, title: 'Engine Oil' },
                { num: 4, title: 'Schedule & Place' },
                { num: 5, title: 'Confirm & Pay' }
              ].map(s => (
                <div 
                  key={s.num}
                  onClick={() => { if (step > s.num) setStep(s.num); }}
                  className={`flex items-center space-x-2 cursor-pointer transition-colors ${
                    step >= s.num ? 'text-[#e58a13] font-extrabold' : 'text-slate-500 font-medium'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    step === s.num 
                      ? 'bg-[#e58a13] text-slate-950 ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/30' 
                      : step > s.num 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}>
                    {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="text-xs sm:text-sm hidden md:inline">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: VEHICLE SELECTION */}
        {step === 1 && (
          <div className="bg-[#12141c] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Bike className="w-6 h-6 text-[#e58a13]" />
                  Step 1: Select Your Two-Wheeler
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Choose your motorcycle or scooter from the catalog or input manually.
                </p>
              </div>

              {/* Custom Vehicle Entry Toggle */}
              <button
                type="button"
                onClick={() => setIsCustomVehicle(!isCustomVehicle)}
                className="btn-outline-garage text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#e58a13]" />
                <span>{isCustomVehicle ? 'Browse Standard Brands' : 'Add Custom Bike Model'}</span>
              </button>
            </div>

            {isCustomVehicle ? (
              <div className="bg-[#181a24] border border-amber-500/30 p-6 rounded-2xl space-y-5">
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#e58a13]" />
                  Manual Vehicle Specification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Make / Manufacturer</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Enfield, Jawa, KTM, Aprilia..."
                      value={customMake}
                      onChange={(e) => setCustomMake(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#0e1015] border border-white/10 text-white placeholder-slate-600 text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Model Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Hunter 350, Continental GT, Duke 390..."
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#0e1015] border border-white/10 text-white placeholder-slate-600 text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Brand Tabs */}
                <div className="mb-8">
                  <label className="block text-xs font-black uppercase tracking-wider text-[#e58a13] mb-3">
                    Select Manufacturer
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {vehiclesData.map(v => (
                      <button
                        key={v.make}
                        type="button"
                        onClick={() => {
                          setSelectedMake(v.make);
                          if (v.models?.[0]) setSelectedModel(v.models[0]);
                          setSearchQuery('');
                        }}
                        className={`p-3.5 rounded-2xl border text-xs font-black tracking-wide text-center transition-all ${
                          selectedMake === v.make
                            ? 'border-[#e58a13] bg-amber-500/10 text-[#e58a13] shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                            : 'border-white/5 bg-[#181a24] text-slate-300 hover:border-white/20'
                        }`}
                      >
                        {v.make}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Search Input */}
                <div className="mb-6 relative">
                  <input
                    id="vehicle-search-input"
                    type="text"
                    placeholder={`Search ${selectedMake} models (e.g. Activa, Pulsar, Apache, Shine, CB350)...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#181a24] border border-white/10 text-white placeholder-slate-500 text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-3.5" />
                </div>

                {/* Models Grid */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Available Models ({filteredModels.length} Found)
                    </label>
                    <span className="text-xs text-[#e58a13] font-bold">Brand: {selectedMake}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredModels.map(m => {
                      const isSelected = selectedModel?.id === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedModel(m)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#e58a13] bg-amber-500/10 text-white shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40'
                              : 'border-white/5 bg-[#181a24] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-base text-white">{m.name}</span>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/5 text-[#e58a13] border border-white/5">
                              {m.category}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-white/5 font-medium">
                            <span className="flex items-center gap-1"><Wrench className="w-3.5 h-3.5 text-amber-400" /> {m.engine}</span>
                            <span className="flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-amber-400" /> {m.defaultOilQty}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Next Action */}
            <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => {
                  if (isCustomVehicle) {
                    if (!customMake || !customModel) {
                      alert('Please provide your bike brand and model.');
                      return;
                    }
                  } else if (!selectedModel) {
                    alert('Please select a bike model to proceed.');
                    return;
                  }
                  setStep(2);
                }}
                className="btn-amber-glow px-8 py-3.5 rounded-2xl text-sm font-black flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Service Package</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SERVICE PACKAGE SELECTION */}
        {step === 2 && (
          <div className="bg-[#12141c] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-[#e58a13]" />
                  Step 2: Choose Service Package
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Selected Bike: <strong className="text-[#e58a13]">{isCustomVehicle ? `${customMake} ${customModel}` : `${selectedMake} ${selectedModel?.name}`}</strong>
                </p>
              </div>

              <span className="text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                Fixed Pricing · No Upselling
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
              {packagesData.map(pkg => {
                const isSelected = selectedPkg?.id === pkg.id;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`relative p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#e58a13] bg-amber-500/10 ring-2 ring-amber-500/40 shadow-2xl shadow-amber-500/20'
                        : 'border-white/5 bg-[#181a24] hover:border-white/20'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-black uppercase px-3 py-0.5 rounded-full shadow-lg">
                        Recommended
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#e58a13] bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                          {pkg.serviceType === 'heavy_workshop' ? 'Workshop Repair' : 'Doorstep Service'}
                        </span>
                        <div className="text-right">
                          <span className="text-3xl font-black text-white">₹{pkg.price}</span>
                          <span className="text-[10px] text-slate-400 block font-bold">+ GST</span>
                        </div>
                      </div>

                      <h3 className="font-black text-xl text-white">{pkg.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 mb-6 leading-relaxed">{pkg.tagline}</p>

                      <div className="border-t border-white/5 pt-4 space-y-2.5 mb-6">
                        {pkg.features.slice(0, 5).map((feat, idx) => (
                          <div key={idx} className="flex items-start text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5 text-amber-400" /> ~{pkg.estimatedMinutes} mins</span>
                      <span className="font-bold text-[#e58a13]">{pkg.idealFor}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between">
              <button 
                onClick={() => setStep(1)} 
                className="btn-outline-garage px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> <span>Back</span>
              </button>
              <button 
                onClick={() => setStep(3)} 
                className="btn-amber-glow px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2"
              >
                <span>Continue to Engine Oil</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ENGINE OIL SELECTION */}
        {step === 3 && (
          <div className="bg-[#12141c] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Droplet className="w-6 h-6 text-[#e58a13]" />
                  Step 3: Engine Oil Brand Upgrade
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Genuine barcode-scanned oil canister unsealed right in front of your eyes.
                </p>
              </div>

              <span className="text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                Anti-Counterfeit Barcode Checked
              </span>
            </div>

            <div className="space-y-4 my-6">
              {oilOptionsData.map(oil => {
                const isSelected = selectedOil?.id === oil.id;
                return (
                  <div
                    key={oil.id}
                    onClick={() => setSelectedOil(oil)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected 
                        ? 'border-[#e58a13] bg-amber-500/10 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10' 
                        : 'border-white/5 bg-[#181a24] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                        oil.priceDifference === 0 ? 'bg-white/5 text-slate-300' : 'bg-amber-500 text-slate-950 shadow-md'
                      }`}>
                        <Fuel className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-black text-base text-white">{oil.brand}</h4>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/5 text-[#e58a13] border border-white/5">
                            {oil.badge}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-amber-300 mt-0.5">{oil.spec}</p>
                        <p className="text-xs text-slate-400 mt-1">{oil.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-white">
                        {oil.priceDifference === 0 ? 'Included in Base' : `+ ₹${oil.priceDifference}`}
                      </div>
                      <span className="text-[10px] text-slate-500 block font-medium">Difference vs Base Oil</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between">
              <button onClick={() => setStep(2)} className="btn-outline-garage px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> <span>Back</span>
              </button>
              <button onClick={() => setStep(4)} className="btn-amber-glow px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2">
                <span>Continue to Schedule</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SCHEDULE & LOCATION */}
        {step === 4 && (
          <div className="bg-[#12141c] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-[#e58a13]" />
              Step 4: Doorstep Location & Schedule
            </h2>
            <p className="text-xs text-slate-400 mb-8">
              Choose your preferred date, convenient time slot, and delivery address.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Service Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#181a24] border border-white/10 font-bold text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Preferred Time Slot</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      '08:30 AM - 10:00 AM',
                      '10:00 AM - 11:30 AM',
                      '01:00 PM - 02:30 PM',
                      '03:00 PM - 04:30 PM'
                    ].map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                          timeSlot === slot 
                            ? 'border-[#e58a13] bg-amber-500/10 text-[#e58a13]' 
                            : 'border-white/5 bg-[#181a24] text-slate-400 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-5">
                  <h4 className="font-extrabold text-sm text-white">Contact Information</h4>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#181a24] border border-white/10 text-white placeholder-slate-600 text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#181a24] border border-white/10 text-white placeholder-slate-600 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-slate-400">Doorstep Service Address</label>
                <textarea
                  rows={3}
                  placeholder="Flat/House No., Street Name, Apartment, Society..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#181a24] border border-white/10 text-white placeholder-slate-600 text-sm focus:border-amber-400 focus:outline-none"
                />

                <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#181a24] p-4 text-white">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold flex items-center text-amber-400">
                      <MapPin className="w-4 h-4 mr-1 text-amber-400" /> GPS Service Dispatch Hub
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{locationCoords.lat}, {locationCoords.lng}</span>
                  </div>
                  <div className="h-32 rounded-xl bg-[#0e1015] flex flex-col items-center justify-center border border-white/5 text-center p-4">
                    <MapPin className="w-7 h-7 text-[#e58a13] animate-bounce mb-1" />
                    <p className="text-xs text-slate-300 font-bold">Koramangala / Indiranagar Tech Hub</p>
                    <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">● Active Mechanics on Patrol</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between">
              <button onClick={() => setStep(3)} className="btn-outline-garage px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> <span>Back</span>
              </button>
              <button onClick={() => setStep(5)} className="btn-amber-glow px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2">
                <span>Review Order Summary</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PRICING BREAKDOWN & PAYMENT TRIGGER */}
        {step === 5 && (
          <div className="bg-[#12141c] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-[#e58a13]" />
              Step 5: Upfront Pricing & Checkout
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Zero hidden costs. 100% digital transparent billing backed by verified parts.
            </p>

            <div className="bg-[#181a24] border border-white/10 rounded-2xl p-6 my-6 space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-slate-400">Vehicle</span>
                <span className="font-extrabold text-white">
                  {isCustomVehicle ? `${customMake} ${customModel}` : `${selectedMake} ${selectedModel?.name}`}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-slate-400">Service Package</span>
                <span className="font-extrabold text-[#e58a13]">{selectedPkg?.name} (₹{basePrice})</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-slate-400">Engine Oil</span>
                <span className="font-extrabold text-white">{selectedOil?.brand} (+₹{oilUpgradeCost})</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-slate-400">Scheduled Slot</span>
                <span className="font-bold text-white">{bookingDate} | {timeSlot}</span>
              </div>

              <div className="pt-2 space-y-2 text-xs text-slate-400">
                <div className="flex justify-between"><span>Base Subtotal:</span> <span className="text-white font-mono">₹{basePrice}</span></div>
                <div className="flex justify-between"><span>Oil Upgrade:</span> <span className="text-white font-mono">+ ₹{oilUpgradeCost}</span></div>
                <div className="flex justify-between"><span>GST (18%):</span> <span className="text-white font-mono">+ ₹{gstAmount}</span></div>
                <div className="flex justify-between text-lg font-black text-white border-t border-white/10 pt-3 mt-3">
                  <span>Total Amount:</span> <span className="text-[#e58a13] font-mono">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(4)} className="btn-outline-garage px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> <span>Back</span>
              </button>
              <button
                onClick={() => setShowRazorpay(true)}
                className="btn-amber-glow px-8 py-3.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-xl shadow-amber-500/20"
              >
                <span>Pay & Confirm Booking (₹{totalPrice})</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: CONFIRMATION & LIVE TRACKING */}
        {step === 6 && createdBooking && (
          <div className="max-w-3xl mx-auto bg-[#12141c] rounded-3xl border border-amber-500/30 p-8 sm:p-12 shadow-2xl text-center">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
              <CheckCircle className="w-12 h-12 stroke-[2.5]" />
            </div>
            <h2 className="text-3xl font-black text-white">Booking Confirmed! #{createdBooking.id}</h2>
            <p className="text-sm text-slate-300 mt-2 mb-8">
              Service Handover OTP: <strong className="font-mono text-[#e58a13] text-lg px-2 py-0.5 bg-amber-500/10 rounded-lg border border-amber-500/30">{createdBooking.otp}</strong>
            </p>

            {createdBooking.mechanic && (
              <div className="bg-[#181a24] border border-white/10 rounded-2xl p-6 mb-8 text-left">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[#e58a13] font-bold uppercase flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#e58a13]" /> Assigned Verified Mechanic
                  </span>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 rounded-full font-bold">
                    {createdBooking.mechanic.kycStatus} KYC
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={createdBooking.mechanic.avatar} alt={createdBooking.mechanic.name} className="w-14 h-14 rounded-full object-cover border-2 border-amber-500" />
                    <div>
                      <h4 className="font-black text-lg text-white">{createdBooking.mechanic.name}</h4>
                      <span className="text-xs text-slate-400">★ {createdBooking.mechanic.rating} Rating • {createdBooking.mechanic.jobsCompleted} Jobs</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowLiveTracking(true)}
                    className="btn-amber-glow px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5"
                  >
                    <Navigation className="w-4 h-4 stroke-[2.5]" />
                    <span>Live Tracking</span>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(1)}
              className="btn-outline-garage px-8 py-3.5 rounded-xl text-xs font-bold"
            >
              Book Another Service
            </button>
          </div>
        )}

      </section>

      {/* Razorpay Modal */}
      <RazorpayModal
        isOpen={showRazorpay}
        onClose={() => setShowRazorpay(false)}
        amount={totalPrice}
        onSuccess={handlePaymentSuccess}
      />

      {/* Live Mechanic Tracking Modal */}
      {createdBooking && (
        <LiveTrackingModal
          isOpen={showLiveTracking}
          onClose={() => setShowLiveTracking(false)}
          mechanic={createdBooking.mechanic}
          bookingId={createdBooking.id}
        />
      )}

    </div>
  );
}
