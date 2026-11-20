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
  Gauge,
  Sliders,
  Shield,
  Star,
  Wrench,
  Fuel,
  Cpu
} from 'lucide-react';

export default function BookingPage({ onBookingCreated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Data
  const [vehiclesData, setVehiclesData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [oilOptionsData, setOilOptionsData] = useState([]);

  // Active Category Toggle in Showcase
  const [packageFilter, setPackageFilter] = useState('popular'); // 'popular' or 'recent'

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

  // 4 Core Doorstep Services matching Reference Image 1 (MotoFix Garage)
  const ourServicesList = [
    {
      id: 'general',
      title: 'General Bike Service',
      desc: 'Routine maintenance with oil change & inspection.',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'tuneup',
      title: 'Engine Tune-Up',
      desc: 'Improve bike performance, mileage & smoothness.',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'washing',
      title: 'Bike Washing & Detailing',
      desc: 'Shine & protect with premium foam wash + polish.',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'brake',
      title: 'Brake & Clutch Repair',
      desc: 'Smooth and responsive control on every ride.',
      image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // Reference UI Signature Package Models
  const signatureModels = [
    {
      id: 'pkg-standard',
      name: 'STORM GT-R',
      subtitle: 'Complete General Service',
      engine: '110cc - 200cc',
      speed: '32-Pt Check',
      power: 'Motul 7100',
      price: '₹799',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
      desc: 'Engine oil flush, spark plug clean, air filter service, brake tuning & foam wash.'
    },
    {
      id: 'pkg-performance',
      name: 'PHANTOM X',
      subtitle: 'Comprehensive Pro Tune',
      engine: '200cc - 500cc',
      speed: '48-Pt Dyno',
      power: 'Castrol Edge',
      price: '₹1,299',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80',
      desc: 'Full throttle body clean, valve clearance adjustment, brake fluid flush & drivetrain lube.'
    },
    {
      id: 'pkg-heavy',
      name: 'VIPER RS',
      subtitle: 'Workshop Restoration & Spa',
      engine: 'All CC / Heavy',
      speed: 'Full Overhaul',
      power: 'Synthetic Oil',
      price: '₹2,199',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
      desc: 'Pickup & drop, complete clutch overhaul, chain sprocket replacement, deep detailing.'
    }
  ];

  // Rider Reviews matching Reference Section
  const riderReviews = [
    {
      quote: "The Storm GT-R service exceeded all my expectations. The mechanic scanned the Motul oil barcode in front of me and WhatsApped the full video proof. Mind-blowing!",
      author: "Alex Thompson",
      city: "Koramangala, Bengaluru",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    },
    {
      quote: "The best blend of technology and craftsmanship. The live GPS tracking and digital health report card gives total peace of mind for my Continental GT 650.",
      author: "Sarah Chen",
      city: "Indiranagar, Bengaluru",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    {
      quote: "Best two-wheeler service I've ever used. Fixed upfront price, zero upselling, and a genuine 7-day guarantee. Never visiting local corner shops again.",
      author: "Marcus Rodriguez",
      city: "HSR Layout, Bengaluru",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
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

  const handleSelectSignaturePackage = (model) => {
    if (packagesData.length > 0) {
      const match = packagesData.find(p => p.id === model.id) || packagesData[0];
      setSelectedPkg(match);
    }
    scrollToBooking();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060709] flex items-center justify-center text-center py-28">
        <div>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent shadow-lg shadow-orange-500/20"></div>
          <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Powering Up ServiceSetu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-red-950/40 border border-red-500/40 rounded-3xl text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-xl font-black text-white">Connection Error</h3>
        <p className="text-sm text-red-300 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060709] text-slate-100 selection:bg-orange-500 selection:text-slate-950">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION - EXACT REPLICA OF THE REFERENCE IMAGE (MOTO DESIGN)      */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-24 text-center bg-[#060709]">
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          
          {/* Main Dramatic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            This is What the <br className="hidden sm:inline" />
            <span className="text-copper-glow">Future Sounds</span> Like.
          </h1>

          {/* Clean Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-normal tracking-wide">
            Unleash power, style, and innovation in one machine.
          </p>

          {/* Centered Dual Pill Buttons */}
          <div className="pt-2 flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={scrollToBooking}
              className="btn-copper-pill px-8 py-3.5 rounded-full text-xs font-black tracking-wide cursor-pointer"
            >
              Explore Models
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('signature-packages-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-glass-pill px-8 py-3.5 rounded-full text-xs font-bold tracking-wide cursor-pointer"
            >
              Learn More
            </button>
          </div>

        </div>

        {/* Centerstage Hero Motorcycle with Cinematic Horizontal Horizon Light Beam */}
        <div className="relative mt-8 max-w-4xl mx-auto px-4 flex flex-col items-center">
          
          {/* Horizontal Ambient Horizon Light Glow (Exact from Reference) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-36 horizon-glow-line pointer-events-none" />
          
          {/* Subtle Warm Horizon Floor Line */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent pointer-events-none" />

          {/* The Hero Motorcycle */}
          <div className="relative z-10 w-full max-w-2xl transition-transform hover:scale-105 duration-700 drop-shadow-[0_30px_35px_rgba(0,0,0,0.95)]">
            <img 
              src="/images/hero-bike.png" 
              alt="Custom Performance Machine" 
              className="w-full h-auto object-contain mx-auto"
              onError={(e) => {
                e.target.src = "/images/hero-bike-alt.png";
              }}
            />
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. OUR SERVICES (Exact 4 Cards Grid from Reference Image 1)               */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#08090d] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-orange-500 mb-1">
                <Bike className="w-4 h-4 text-orange-400" />
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">Our Services</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Best Bike Repair & Maintenance Services
              </h2>
            </div>

            {/* Navigation Arrows matching Image 1 */}
            <div className="flex items-center gap-2">
              <button 
                onClick={scrollToBooking}
                className="w-8 h-8 rounded-md bg-orange-500 text-slate-950 flex items-center justify-center font-bold hover:bg-orange-400 transition-colors shadow-sm cursor-pointer"
                title="Previous"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={scrollToBooking}
                className="w-8 h-8 rounded-md bg-white text-slate-950 flex items-center justify-center font-bold hover:bg-slate-200 transition-colors shadow-sm cursor-pointer"
                title="Next"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ourServicesList.map(srv => (
              <div 
                key={srv.id}
                onClick={scrollToBooking}
                className="group relative h-72 rounded-2xl overflow-hidden border border-white/10 cursor-pointer shadow-lg hover:border-orange-500/50 transition-all duration-300"
              >
                <img 
                  src={srv.image} 
                  alt={srv.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                  <h3 className="text-sm font-black text-white group-hover:text-orange-400 transition-colors leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed font-normal">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LATEST MODELS / SIGNATURE PACKAGES (Cards Grid from Reference Image 3)  */}
      {/* ========================================================================= */}
      <section id="signature-packages-section" className="py-20 bg-[#0a0c10] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Toggle Filter Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                Latest Models
              </h2>
              <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
                Engineered with cutting-edge essentials, ultra-precise control, and bold design to lead revolutions in doorstep maintenance.
              </p>
            </div>

            {/* Toggle Switch matching Reference UI */}
            <div className="flex items-center bg-[#12141a] p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                onClick={() => setPackageFilter('popular')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  packageFilter === 'popular' 
                    ? 'bg-transparent text-slate-300' 
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                Popular Items
              </button>
              <button
                onClick={() => setPackageFilter('recent')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  packageFilter === 'recent' 
                    ? 'btn-copper-pill text-slate-950 font-black shadow-md' 
                    : 'btn-copper-pill text-slate-950 font-black shadow-md'
                }`}
              >
                Recent Items
              </button>
            </div>
          </div>

          {/* 3 Column Signature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureModels.map(model => (
              <div
                key={model.id}
                className="bg-[#12141a] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-orange-500/40 transition-all duration-300 group shadow-xl"
              >
                {/* Photo Studio Card Header */}
                <div className="h-56 bg-[#181a22] overflow-hidden relative flex items-center justify-center p-4">
                  <img 
                    src={model.image} 
                    alt={model.name} 
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 brightness-95" 
                  />
                </div>

                {/* Card Specs & Details Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">{model.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{model.subtitle}</p>

                    {/* 2x2 Tech Specs Grid (Exact from Reference Image) */}
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/5 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">ENGINE CC</span>
                        <strong className="text-white font-extrabold">{model.engine}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">DIAGNOSTIC</span>
                        <strong className="text-white font-extrabold">{model.speed}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">GENUINE OIL</span>
                        <strong className="text-orange-400 font-extrabold">{model.power}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">PRICE</span>
                        <strong className="text-white font-black font-mono text-sm">{model.price}</strong>
                      </div>
                    </div>
                  </div>

                  {/* View Details Action Button */}
                  <button
                    onClick={() => handleSelectSignaturePackage(model)}
                    className="w-full btn-copper-pill text-xs font-black py-3.5 rounded-xl text-center shadow-md cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ABOUT US / THE SERVICESETU MOVEMENT (Exact Layout from Reference)       */}
      {/* ========================================================================= */}
      <section id="about-section" className="py-24 bg-[#060709] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Photo */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-w-md w-full">
                <img 
                  src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=700&auto=format&fit=crop&q=80" 
                  alt="Crafted Two-Wheeler Machine" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-white">About Us</span>
              
              <p className="text-slate-300 text-sm leading-relaxed">
                We're not a factory. We're a movement of master mechanics, speed freaks, and technical visionaries. Born from the tarmac and shaped by obsession, our doorstep protocols treat every motorcycle as a high-precision machine.
              </p>

              <div>
                <h4 className="text-orange-500 font-black text-sm uppercase tracking-wider mb-2">
                  Why We Ride?
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Because mediocrity isn't an option. Because power should be truthful. Because the road deserves more than just roadside guesswork. We bring certified technicians, tamper-evident barcode verified oils, and digital proof straight to your driveway.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-6">
                <div>
                  <strong className="text-2xl font-black text-white font-mono block">10,000+</strong>
                  <span className="text-slate-500 text-xs font-medium">Bikes Serviced</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div>
                  <strong className="text-2xl font-black text-orange-400 font-mono block">100%</strong>
                  <span className="text-slate-500 text-xs font-medium">Genuine Guarantee</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div>
                  <strong className="text-2xl font-black text-emerald-400 font-mono block">7-Day</strong>
                  <span className="text-slate-500 text-xs font-medium">Free Redo</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PERFORMANCE FEATURES (4 Minimal Icons from Reference)                   */}
      {/* ========================================================================= */}
      <section id="features-section" className="py-20 bg-[#0a0c10] border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-14">
            Performance Features
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                <Gauge className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-white">Raw Power</h4>
              <p className="text-xs text-slate-400">100% Barcode Genuine Motul & Castrol Synthetic Oils</p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-white">Custom Build</h4>
              <p className="text-xs text-slate-400">32-Point Master Multi-System Inspection Audit</p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-white">Perfect Control</h4>
              <p className="text-xs text-slate-400">Zero Hidden Costs, Fixed Upfront Digital Pricing</p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-white">Future Ready</h4>
              <p className="text-xs text-slate-400">7-Day Free Redo & Electric Vehicle (EV) Maintenance</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. RIDER REVIEWS (Exact Testimonial Grid from Reference)                   */}
      {/* ========================================================================= */}
      <section id="reviews-section" className="py-20 bg-[#060709] border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-14">
            Rider Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {riderReviews.map((rev, idx) => (
              <div 
                key={idx} 
                className="bg-[#12141a] rounded-2xl border border-white/5 p-8 text-left space-y-4 hover:border-orange-500/30 transition-colors shadow-lg"
              >
                <div className="flex items-center space-x-1 text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-orange-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.quote}"
                </p>

                <div className="flex items-center space-x-3 pt-3 border-t border-white/5">
                  <img src={rev.avatar} alt={rev.author} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                  <div>
                    <h5 className="font-extrabold text-xs text-white leading-tight">{rev.author}</h5>
                    <span className="text-[10px] text-slate-500">{rev.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BANNER: "BE THE FIRST TO RIDE" (Exact CTA from Reference Image)        */}
      {/* ========================================================================= */}
      <section className="py-28 relative text-center overflow-hidden border-t border-white/5">
        {/* Dark Vignette Hero Image Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1400&auto=format&fit=crop&q=80" 
            alt="Motorcycle on open highway" 
            className="w-full h-full object-cover brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-[#060709]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Be the First to Experience
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
            Doorstep Services Starting at ₹499
          </p>

          <div className="pt-4 flex flex-col items-center gap-3">
            <button
              onClick={scrollToBooking}
              className="btn-copper-pill px-10 py-3.5 rounded-full text-xs font-black tracking-widest uppercase shadow-xl cursor-pointer"
            >
              Order Now
            </button>
            <a 
              href="tel:1-800-SETU-BIKE" 
              className="text-xs text-slate-400 hover:text-white underline underline-offset-4 font-medium"
            >
              Call 24/7 Helpline: 1-800-SETU-BIKE
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. THE INTERACTIVE BOOKING WORKFLOW (5-Step Master Wizard)                */}
      {/* ========================================================================= */}
      <section id="booking-flow-section" className="py-20 bg-[#0a0c10] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Doorstep Service Wizard
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Configure Your Doorstep Visit
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select vehicle model, service package, engine oil, and convenient arrival time.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          {step < 6 && (
            <div className="mb-10">
              <div className="flex items-center justify-between max-w-3xl mx-auto bg-[#12141a] border border-white/10 p-3 rounded-full shadow-xl">
                {[
                  { num: 1, title: 'Vehicle' },
                  { num: 2, title: 'Package' },
                  { num: 3, title: 'Oil Brand' },
                  { num: 4, title: 'Schedule' },
                  { num: 5, title: 'Checkout' }
                ].map(s => (
                  <div 
                    key={s.num}
                    onClick={() => { if (step > s.num) setStep(s.num); }}
                    className={`flex items-center space-x-2 cursor-pointer transition-colors ${
                      step >= s.num ? 'text-orange-400 font-extrabold' : 'text-slate-500 font-medium'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      step === s.num 
                        ? 'bg-orange-500 text-slate-950 ring-4 ring-orange-500/20 shadow-md' 
                        : step > s.num 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-white/5 text-slate-500'
                    }`}>
                      {step > s.num ? <CheckCircle className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <span className="text-xs hidden md:inline">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: VEHICLE SELECTION */}
          {step === 1 && (
            <div className="bg-[#12141a] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2.5">
                    <Bike className="w-5 h-5 text-orange-400" />
                    Step 1: Select Your Vehicle
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Choose your motorcycle or scooter brand or enter custom specs.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCustomVehicle(!isCustomVehicle)}
                  className="btn-glass-pill text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
                  <span>{isCustomVehicle ? 'Catalog View' : 'Custom Vehicle'}</span>
                </button>
              </div>

              {isCustomVehicle ? (
                <div className="bg-[#181a24] border border-orange-500/30 p-6 rounded-2xl space-y-4">
                  <h4 className="font-bold text-sm text-white">Enter Bike / Scooter Details Manually</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Make / Brand</label>
                      <input
                        type="text"
                        placeholder="e.g. Royal Enfield, Jawa, KTM, Aprilia..."
                        value={customMake}
                        onChange={(e) => setCustomMake(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-[#0c0e12] border border-white/10 text-white text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Model Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Hunter 350, Continental GT, Duke 390..."
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-[#0c0e12] border border-white/10 text-white text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Brand Tabs */}
                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Select Brand</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                      {vehiclesData.map(v => (
                        <button
                          key={v.make}
                          type="button"
                          onClick={() => {
                            setSelectedMake(v.make);
                            if (v.models?.[0]) setSelectedModel(v.models[0]);
                            setSearchQuery('');
                          }}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                            selectedMake === v.make
                              ? 'border-orange-500 bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/40'
                              : 'border-white/5 bg-[#181a24] text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {v.make}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="mb-6 relative">
                    <input
                      id="vehicle-search-input"
                      type="text"
                      placeholder={`Search ${selectedMake} models (e.g. Activa, Pulsar, Apache, Shine)...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#181a24] border border-white/10 text-white placeholder-slate-500 text-xs focus:border-orange-500 focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-orange-400 absolute left-3.5 top-3.5" />
                  </div>

                  {/* Models Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredModels.map(m => {
                      const isSelected = selectedModel?.id === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedModel(m)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500/10 text-white ring-1 ring-orange-500/40'
                              : 'border-white/5 bg-[#181a24] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-sm text-white">{m.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-orange-400">
                              {m.category}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-white/5">
                            <span>{m.engine}</span>
                            <span>{m.defaultOilQty}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => {
                    if (isCustomVehicle) {
                      if (!customMake || !customModel) {
                        alert('Please provide brand and model.');
                        return;
                      }
                    } else if (!selectedModel) {
                      alert('Please select a model.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="btn-copper-pill px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SERVICE PACKAGE SELECTION */}
          {step === 2 && (
            <div className="bg-[#12141a] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-orange-400" />
                    Step 2: Choose Service Package
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Selected Bike: <strong className="text-orange-400">{isCustomVehicle ? `${customMake} ${customModel}` : `${selectedMake} ${selectedModel?.name}`}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                {packagesData.map(pkg => {
                  const isSelected = selectedPkg?.id === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkg(pkg)}
                      className={`relative p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/40 shadow-xl'
                          : 'border-white/5 bg-[#181a24] hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                            {pkg.serviceType === 'heavy_workshop' ? 'Workshop' : 'Doorstep'}
                          </span>
                          <span className="text-2xl font-black text-white">₹{pkg.price}</span>
                        </div>

                        <h4 className="font-black text-lg text-white">{pkg.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 mb-4">{pkg.tagline}</p>

                        <div className="border-t border-white/5 pt-3 space-y-2 mb-4">
                          {pkg.features.slice(0, 5).map((feat, idx) => (
                            <div key={idx} className="flex items-start text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-orange-400" /> ~{pkg.estimatedMinutes}m</span>
                        <span className="font-bold text-orange-400">{pkg.idealFor}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
                <button onClick={() => setStep(1)} className="btn-glass-pill px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                </button>
                <button onClick={() => setStep(3)} className="btn-copper-pill px-7 py-2.5 rounded-xl text-xs font-black flex items-center gap-2">
                  <span>Continue to Oil</span> <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ENGINE OIL UPGRADE */}
          {step === 3 && (
            <div className="bg-[#12141a] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
              <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2.5">
                <Droplet className="w-5 h-5 text-orange-400" />
                Step 3: Engine Oil Brand Upgrade
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Unsealed in front of you with real-time barcode authenticity verification.
              </p>

              <div className="space-y-3 my-6">
                {oilOptionsData.map(oil => {
                  const isSelected = selectedOil?.id === oil.id;
                  return (
                    <div
                      key={oil.id}
                      onClick={() => setSelectedOil(oil)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500/40' 
                          : 'border-white/5 bg-[#181a24] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                          oil.priceDifference === 0 ? 'bg-white/5 text-slate-300' : 'bg-orange-500 text-slate-950 shadow'
                        }`}>
                          <Fuel className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-extrabold text-sm text-white">{oil.brand}</h5>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-orange-400">{oil.badge}</span>
                          </div>
                          <p className="text-xs text-orange-300">{oil.spec}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{oil.description}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-white">
                          {oil.priceDifference === 0 ? 'Included' : `+ ₹${oil.priceDifference}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
                <button onClick={() => setStep(2)} className="btn-glass-pill px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                </button>
                <button onClick={() => setStep(4)} className="btn-copper-pill px-7 py-2.5 rounded-xl text-xs font-black flex items-center gap-2">
                  <span>Continue to Schedule</span> <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SCHEDULE & LOCATION */}
          {step === 4 && (
            <div className="bg-[#12141a] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
              <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-orange-400" />
                Step 4: Doorstep Schedule & Address
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Service Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#181a24] border border-white/10 font-bold text-white text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Preferred Time Slot</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['08:30 AM - 10:00 AM', '10:00 AM - 11:30 AM', '01:00 PM - 02:30 PM', '03:00 PM - 04:30 PM'].map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                            timeSlot === slot ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-white/5 bg-[#181a24] text-slate-400'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#181a24] border border-white/10 text-white text-xs focus:border-orange-500 focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#181a24] border border-white/10 text-white text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-400">Doorstep Delivery Address</label>
                  <textarea
                    rows={3}
                    placeholder="House/Flat No., Street, Landmark..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#181a24] border border-white/10 text-white text-xs focus:border-orange-500 focus:outline-none"
                  />

                  <div className="border border-white/10 rounded-xl bg-[#181a24] p-3 text-white">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold flex items-center text-orange-400">
                        <MapPin className="w-3.5 h-3.5 mr-1" /> GPS Service Hub
                      </span>
                      <span className="text-slate-400 text-[10px]">{locationCoords.lat}, {locationCoords.lng}</span>
                    </div>
                    <div className="h-28 rounded-lg bg-[#0c0e12] flex flex-col items-center justify-center text-center p-3">
                      <MapPin className="w-6 h-6 text-orange-400 animate-bounce mb-1" />
                      <p className="text-xs text-slate-300 font-bold">Bengaluru Central Hub</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
                <button onClick={() => setStep(3)} className="btn-glass-pill px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                </button>
                <button onClick={() => setStep(5)} className="btn-copper-pill px-7 py-2.5 rounded-xl text-xs font-black flex items-center gap-2">
                  <span>Review Summary</span> <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: PRICING BREAKDOWN & PAYMENT TRIGGER */}
          {step === 5 && (
            <div className="bg-[#12141a] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto">
              <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-orange-400" />
                Step 5: Upfront Pricing & Checkout
              </h3>

              <div className="bg-[#181a24] border border-white/10 rounded-2xl p-5 my-6 space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="font-bold text-white">
                    {isCustomVehicle ? `${customMake} ${customModel}` : `${selectedMake} ${selectedModel?.name}`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Package:</span>
                  <span className="font-bold text-orange-400">{selectedPkg?.name} (₹{basePrice})</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Engine Oil:</span>
                  <span className="font-bold text-white">{selectedOil?.brand} (+₹{oilUpgradeCost})</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Schedule:</span>
                  <span className="font-bold text-white">{bookingDate} | {timeSlot}</span>
                </div>

                <div className="pt-2 space-y-1 text-slate-400">
                  <div className="flex justify-between"><span>Base:</span> <span className="text-white">₹{basePrice}</span></div>
                  <div className="flex justify-between"><span>Oil Upgrade:</span> <span className="text-white">+ ₹{oilUpgradeCost}</span></div>
                  <div className="flex justify-between"><span>GST (18%):</span> <span className="text-white">+ ₹{gstAmount}</span></div>
                  <div className="flex justify-between text-base font-black text-white border-t border-white/10 pt-2 mt-2">
                    <span>Total Amount:</span> <span className="text-orange-400 font-mono">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(4)} className="btn-glass-pill px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                </button>
                <button
                  onClick={() => setShowRazorpay(true)}
                  className="btn-copper-pill px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg"
                >
                  <span>Pay & Confirm (₹{totalPrice})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMATION & LIVE TRACKING */}
          {step === 6 && createdBooking && (
            <div className="max-w-2xl mx-auto bg-[#12141a] rounded-3xl border border-orange-500/30 p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white">Booking Confirmed! #{createdBooking.id}</h3>
              <p className="text-xs text-slate-400 mt-1 mb-6">
                Service OTP: <strong className="font-mono text-orange-400 text-sm px-2 py-0.5 bg-orange-500/10 rounded-md">{createdBooking.otp}</strong>
              </p>

              {createdBooking.mechanic && (
                <div className="bg-[#181a24] border border-white/10 rounded-2xl p-5 mb-6 text-left">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-orange-400 font-bold uppercase flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> Assigned Mechanic
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                      {createdBooking.mechanic.kycStatus} KYC
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={createdBooking.mechanic.avatar} alt={createdBooking.mechanic.name} className="w-12 h-12 rounded-full object-cover border border-orange-500" />
                      <div>
                        <h4 className="font-black text-sm text-white">{createdBooking.mechanic.name}</h4>
                        <span className="text-xs text-slate-400">★ {createdBooking.mechanic.rating} Rating</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowLiveTracking(true)}
                      className="btn-copper-pill px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Live Tracking</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(1)}
                className="btn-glass-pill px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                Book Another Service
              </button>
            </div>
          )}

        </div>
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
