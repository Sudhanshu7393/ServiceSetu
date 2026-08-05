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
  HelpCircle
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

  // Filter models based on live search query
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
        make: customMake || 'Custom Two-Wheeler',
        model: customModel || 'Custom Model',
        engine: 'Standard Engine'
      } : {
        make: selectedMake,
        model: selectedModel?.name || 'Two-Wheeler',
        engine: selectedModel?.engine || 'N/A'
      };

      const payload = {
        customerName,
        customerPhone,
        vehicle: vehiclePayload,
        packageId: selectedPkg.id,
        oilOptionId: selectedOil.id,
        date: bookingDate,
        timeSlot,
        address,
        pincode,
        locationCoords,
        paymentMethod: 'Razorpay UPI'
      };

      const result = await createBooking(payload);
      setCreatedBooking(result.booking);
      if (onBookingCreated) onBookingCreated(result.booking);
      setStep(6);
    } catch (err) {
      alert(`Booking Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="mt-4 text-slate-600 font-medium">Loading ServiceSetu booking portal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-red-900">Backend Connection Error</h3>
        <p className="text-sm text-red-700 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="gradient-bg rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            100% Digital Service Proof Guaranteed
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Book Doorstep Two-Wheeler Servicing
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Verified mechanic visits your home or office. Upfront fixed pricing with real barcode product verification — no hidden charges.
          </p>
        </div>
      </div>

      {/* HOW SERVICESETU WORKS (EASY VISUAL GUIDE FOR CUSTOMERS) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 shadow-sm">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-700 mb-4 flex items-center">
          <HelpCircle className="w-4 h-4 mr-1 text-teal-600" />
          How ServiceSetu Doorstep Servicing Works in 4 Simple Steps
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
            <div className="text-xs">
              <strong className="text-slate-900 block font-bold">Book Online & Select Oil</strong>
              <span className="text-slate-500">Pick bike model, package & upfront oil brand.</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
            <div className="text-xs">
              <strong className="text-slate-900 block font-bold">Mechanic Visits Location</strong>
              <span className="text-slate-500">Verified mechanic arrives with tools & oil kit.</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
            <div className="text-xs">
              <strong className="text-slate-900 block font-bold">Barcode Scanned Service</strong>
              <span className="text-slate-500">Mechanic scans oil barcode & performs servicing.</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
            <div className="text-xs">
              <strong className="text-slate-900 block font-bold">OTP Handover & Report</strong>
              <span className="text-slate-500">Confirm via OTP & get digital Service Proof Report.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Progress */}
      {step < 6 && (
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            {[
              { num: 1, title: 'Vehicle' },
              { num: 2, title: 'Package' },
              { num: 3, title: 'Oil Brand' },
              { num: 4, title: 'Schedule' },
              { num: 5, title: 'Confirm' }
            ].map(s => (
              <div 
                key={s.num}
                onClick={() => { if (step > s.num) setStep(s.num); }}
                className={`flex items-center space-x-2 cursor-pointer ${step >= s.num ? 'text-teal-600 font-bold' : 'text-slate-400 font-medium'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                  step === s.num 
                    ? 'bg-teal-600 text-white ring-4 ring-teal-100' 
                    : step > s.num 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-xs sm:text-sm hidden md:inline">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: VEHICLE SELECTION (WITH LIVE SEARCH & CUSTOM ENTER OPTION) */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center">
            <Bike className="w-5 h-5 text-teal-600 mr-2" />
            Step 1: Select Your Two-Wheeler
          </h2>
          <p className="text-xs text-slate-500 mb-6">Choose your motorcycle or scooter manufacturer or search directly.</p>

          {/* Toggle between standard catalog and custom entry */}
          <div className="flex items-center justify-between mb-6 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 ml-2">Cannot find your bike model in list?</span>
            <button
              type="button"
              onClick={() => setIsCustomVehicle(!isCustomVehicle)}
              className="flex items-center space-x-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-600 text-white shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isCustomVehicle ? 'Choose from Catalog' : 'Enter Custom Bike / Model'}</span>
            </button>
          </div>

          {isCustomVehicle ? (
            <div className="bg-teal-50/50 border border-teal-200 p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Enter Your Bike / Scooter Details Manually</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Make / Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jawa, Aprilia, BMW, Vespa, Custom Bike..."
                    value={customMake}
                    onChange={(e) => setCustomMake(e.target.value)}
                    className="w-full p-3 rounded-xl border text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Model Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Roadster 350, SR160, G310 GS..."
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    className="w-full p-3 rounded-xl border text-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Brand Tabs */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select Brand</label>
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
                          ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-sm ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                      }`}
                    >
                      {v.make}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Search Input */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder={`Search ${selectedMake} models (e.g. Activa, Pulsar, Hunter, Apache...)...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>

              {/* Models Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Model ({selectedMake} - {filteredModels.length} Models)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredModels.map(m => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModel(m)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedModel?.id === m.id
                          ? 'border-teal-500 bg-teal-50 text-slate-900 shadow-md ring-2 ring-teal-500/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-slate-900">{m.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {m.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                        <span>Engine: {m.engine}</span>
                        <span>Oil: {m.defaultOilQty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => {
                if (isCustomVehicle) {
                  if (!customMake || !customModel) {
                    alert('Please enter your custom bike brand and model.');
                    return;
                  }
                } else if (!selectedModel) {
                  alert('Please select your vehicle model.');
                  return;
                }
                setStep(2);
              }}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md"
            >
              <span>Continue to Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SERVICE PACKAGE SELECTION */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Sparkles className="w-5 h-5 text-teal-600 mr-2" />
              Step 2: Choose Service Package
            </h2>
            <span className="text-xs text-slate-500">
              Selected: <strong>{isCustomVehicle ? `${customMake} ${customModel}` : `${selectedMake} ${selectedModel?.name}`}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
            {packagesData.map(pkg => {
              const isSelected = selectedPkg?.id === pkg.id;
              const isHeavy = pkg.serviceType === 'heavy_workshop';
              const isDiagnosis = pkg.serviceType === 'unclear_diagnosis';

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`relative p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/30 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 right-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[11px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        isHeavy ? 'bg-amber-100 text-amber-800' : isDiagnosis ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isHeavy ? 'Pickup & Workshop Flow' : isDiagnosis ? 'Diagnosis Visit Flow' : 'Doorstep Service'}
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-slate-900">₹{pkg.price}</span>
                        <span className="text-[11px] text-slate-400 block">+ GST</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-lg text-slate-900 mt-2">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">{pkg.tagline}</p>

                    <div className="border-t border-slate-100 pt-3 space-y-2 mb-4">
                      {pkg.features.slice(0, 5).map((feat, idx) => (
                        <div key={idx} className="flex items-start text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> ~{pkg.estimatedMinutes} mins</span>
                    <span className="font-medium text-teal-700">{pkg.idealFor}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(1)} className="flex items-center space-x-2 text-slate-600 font-bold px-5 py-2.5 rounded-xl border">
              <ArrowLeft className="w-4 h-4" /> <span>Back</span>
            </button>
            <button onClick={() => setStep(3)} className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md">
              <span>Continue to Oil Selection</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: OIL BRAND UPGRADE */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Droplet className="w-5 h-5 text-teal-600 mr-2" />
              Step 3: Engine Oil Brand Upgrade
            </h2>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
              Upfront Transparent Pricing
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
                    isSelected ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/30 shadow-sm' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      oil.priceDifference === 0 ? 'bg-slate-100 text-slate-700' : 'bg-teal-600 text-white shadow-md'
                    }`}>
                      <Droplet className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-base text-slate-900">{oil.brand}</h4>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">{oil.badge}</span>
                      </div>
                      <p className="text-xs font-semibold text-teal-800 mt-0.5">{oil.spec}</p>
                      <p className="text-xs text-slate-500 mt-1">{oil.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-slate-900">
                      {oil.priceDifference === 0 ? 'Included' : `+ ₹${oil.priceDifference}`}
                    </div>
                    <span className="text-[11px] text-slate-400 block">Diff vs Base OEM</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(2)} className="flex items-center space-x-2 text-slate-600 font-bold px-5 py-2.5 rounded-xl border">
              <ArrowLeft className="w-4 h-4" /> <span>Back</span>
            </button>
            <button onClick={() => setStep(4)} className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md">
              <span>Continue to Schedule</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SCHEDULE & LOCATION */}
      {step === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center">
            <Calendar className="w-5 h-5 text-teal-600 mr-2" />
            Step 4: Doorstep Location & Schedule
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-6">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Service Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-3 rounded-xl border font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Preferred Time Slot</label>
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
                      className={`p-3 rounded-xl text-xs font-bold border ${
                        timeSlot === slot ? 'border-teal-500 bg-teal-50 text-teal-900' : 'border-slate-200 bg-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-bold text-sm text-slate-900">Customer Details</h4>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 rounded-xl border text-sm"
                />
                <input
                  type="tel"
                  placeholder="Mobile Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase text-slate-500">Doorstep Service Address</label>
              <textarea
                rows={3}
                placeholder="Flat/House No., Street Name, Apartment..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 rounded-xl border text-sm"
              />

              <div className="border rounded-2xl overflow-hidden bg-slate-900 p-4 text-white">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold flex items-center"><MapPin className="w-3.5 h-3.5 text-teal-400 mr-1" /> GPS Pinched Location</span>
                  <span className="text-teal-300 text-[11px]">{locationCoords.lat}, {locationCoords.lng}</span>
                </div>
                <div className="h-32 rounded-xl bg-slate-800 flex flex-col items-center justify-center border border-slate-700 text-center p-4">
                  <MapPin className="w-6 h-6 text-teal-400 animate-bounce mb-1" />
                  <p className="text-xs text-slate-300">Indiranagar / Koramangala Hub Pinched</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(3)} className="flex items-center space-x-2 text-slate-600 font-bold px-5 py-2.5 rounded-xl border">
              <ArrowLeft className="w-4 h-4" /> <span>Back</span>
            </button>
            <button onClick={() => setStep(5)} className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md">
              <span>Review Order Summary</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PRICING BREAKDOWN & PAYMENT TRIGGER */}
      {step === 5 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center">
            <FileCheck className="w-5 h-5 text-teal-600 mr-2" />
            Step 5: Upfront Pricing & Checkout
          </h2>

          <div className="bg-slate-50 border rounded-2xl p-5 my-6 space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-600">Vehicle</span>
              <span className="font-bold text-slate-900">
                {isCustomVehicle ? `${customMake} ${customModel}` : `${selectedMake} ${selectedModel?.name}`}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-600">Service Package</span>
              <span className="font-bold text-slate-900">{selectedPkg?.name} (₹{basePrice})</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-600">Engine Oil</span>
              <span className="font-bold text-slate-900">{selectedOil?.brand} (+₹{oilUpgradeCost})</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-600">Schedule</span>
              <span className="font-bold text-slate-900">{bookingDate} | {timeSlot}</span>
            </div>

            <div className="pt-2 space-y-1 text-xs text-slate-600">
              <div className="flex justify-between"><span>Base Subtotal:</span> <span>₹{basePrice}</span></div>
              <div className="flex justify-between"><span>Oil Upgrade:</span> <span>+ ₹{oilUpgradeCost}</span></div>
              <div className="flex justify-between"><span>GST (18%):</span> <span>+ ₹{gstAmount}</span></div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 border-t pt-2 mt-2">
                <span>Total Amount Payable:</span> <span className="text-teal-700">₹{totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(4)} className="flex items-center space-x-2 text-slate-600 font-bold px-5 py-2.5 rounded-xl border">
              <ArrowLeft className="w-4 h-4" /> <span>Back</span>
            </button>
            <button
              onClick={() => setShowRazorpay(true)}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-lg text-base flex items-center space-x-2"
            >
              <span>Pay & Confirm Booking (₹{totalPrice})</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: CONFIRMATION & LIVE TRACKING */}
      {step === 6 && createdBooking && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Booking Confirmed! #{createdBooking.id}</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">Service OTP <strong className="font-mono text-teal-700 text-sm">{createdBooking.otp}</strong> sent to {createdBooking.customerPhone}.</p>

          {createdBooking.mechanic && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 mb-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-teal-400 font-bold uppercase flex items-center">
                  <UserCheck className="w-4 h-4 mr-1" /> Assigned Verified Mechanic
                </span>
                <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                  {createdBooking.mechanic.kycStatus} KYC
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={createdBooking.mechanic.avatar} alt={createdBooking.mechanic.name} className="w-14 h-14 rounded-full object-cover border-2 border-teal-500" />
                  <div>
                    <h4 className="font-extrabold text-lg text-white">{createdBooking.mechanic.name}</h4>
                    <span className="text-xs text-slate-300">★ {createdBooking.mechanic.rating} Rating • {createdBooking.mechanic.jobsCompleted} Jobs</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowLiveTracking(true)}
                  className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl transition-all shadow text-xs"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Live Tracking</span>
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setStep(1)}
            className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-sm"
          >
            Book Another Service
          </button>
        </div>
      )}

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
