import React, { useState, useEffect, useRef } from 'react';
import { 
  fetchMechanicJobs, 
  updateBookingStatus, 
  addProductUsed, 
  removeProductUsed, 
  verifyOtpAndComplete,
  updateMechanicGpsLocation
} from '../services/api';
import CameraBarcodeScanner from '../components/CameraBarcodeScanner';
import { 
  UserCheck, 
  MapPin, 
  Clock, 
  CheckSquare, 
  Camera, 
  Barcode, 
  ShieldAlert, 
  CheckCircle, 
  Phone,
  FileCheck,
  Gauge,
  Trash2,
  Radio
} from 'lucide-react';

export default function MechanicDashboard({ mechanicId = 'mech-101' }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  // Inspection Form Inputs
  const [odometer, setOdometer] = useState('15,200 km');
  const [fuelLevel, setFuelLevel] = useState('50% (Half Tank)');
  const [batteryVoltage, setBatteryVoltage] = useState('12.6 V (Healthy)');
  const [frontTyrePressure, setFrontTyrePressure] = useState('28 psi');
  const [rearTyrePressure, setRearTyrePressure] = useState('36 psi');
  const [brakePadLife, setBrakePadLife] = useState('70% Remaining');
  const [scratchNotes, setScratchNotes] = useState('Minor scratch on exhaust guard stem.');

  // Barcode & OTP Inputs
  const [productName, setProductName] = useState('Motul 7100 4T 1L Synthetic Oil');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Real Device Geolocation State
  const [isGpsBroadcasting, setIsGpsBroadcasting] = useState(false);
  const [currentGpsCoords, setCurrentGpsCoords] = useState(null);
  const gpsWatchIdRef = useRef(null);

  // Camera Scanner Modal State
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const isSubmittingScanRef = useRef(false);

  // Status Alerts
  const [duplicateAlert, setDuplicateAlert] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await fetchMechanicJobs(mechanicId);
      setJobs(res.jobs || []);
      if (res.jobs?.length > 0 && !selectedJob) {
        setSelectedJob(res.jobs[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    return () => {
      stopGpsBroadcast();
    };
  }, [mechanicId]);

  const toggleGpsBroadcast = () => {
    if (isGpsBroadcasting) {
      stopGpsBroadcast();
    } else {
      startGpsBroadcast();
    }
  };

  const startGpsBroadcast = () => {
    if (!navigator.geolocation) {
      alert('Geolocation API is not supported by your browser.');
      return;
    }

    setIsGpsBroadcasting(true);
    setStatusMessage('🟢 Live GPS Location Broadcast Enabled');

    gpsWatchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude, speed, accuracy } = pos.coords;
        setCurrentGpsCoords({ lat: latitude, lng: longitude, speed, accuracy });

        try {
          await updateMechanicGpsLocation(mechanicId, {
            lat: latitude,
            lng: longitude,
            speed,
            accuracy
          });
        } catch (err) {
          console.error('GPS send error', err);
        }
      },
      (err) => {
        setCurrentGpsCoords({ lat: 12.9716, lng: 77.5946, speed: 25, accuracy: 5 });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000
      }
    );
  };

  const stopGpsBroadcast = () => {
    if (gpsWatchIdRef.current !== null) {
      navigator.geolocation.clearWatch(gpsWatchIdRef.current);
      gpsWatchIdRef.current = null;
    }
    setIsGpsBroadcasting(false);
    setStatusMessage('🔴 Live GPS Broadcast Stopped');
  };

  const handleUpdateStatus = async (newStatus, extraData = {}) => {
    if (!selectedJob) return;
    try {
      const updatePayload = {
        status: newStatus,
        inspectionDetails: {
          odometer,
          fuelLevel,
          batteryVoltage,
          frontTyrePressure,
          rearTyrePressure,
          brakePadLife,
          scratchNotes
        },
        ...extraData
      };
      
      const res = await updateBookingStatus(selectedJob.id, updatePayload);
      setSelectedJob(res.booking);
      setStatusMessage(`Status Updated: ${newStatus}`);
      loadJobs();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleAddProduct = async (e) => {
    if (e) e.preventDefault();
    if (!selectedJob || !barcodeInput) return;
    setDuplicateAlert(null);
    setStatusMessage(null);
    try {
      const res = await addProductUsed(selectedJob.id, {
        name: productName,
        barcode: barcodeInput
      });
      setStatusMessage(`Product [${barcodeInput}] verified & added to Service Proof Report.`);
      setSelectedJob(prev => ({ ...prev, usedProducts: res.usedProducts }));
      setBarcodeInput('');
    } catch (err) {
      if (err.message.includes('SECURITY ALERT') || err.message.includes('DUPLICATE')) {
        setDuplicateAlert(err.message);
      } else {
        alert(err.message);
      }
    }
  };

  const handleCameraScanSuccess = async (scannedBarcode) => {
    if (isSubmittingScanRef.current) return;
    isSubmittingScanRef.current = true;

    setBarcodeInput(scannedBarcode);
    setDuplicateAlert(null);

    if (selectedJob) {
      const alreadyExists = (selectedJob.usedProducts || []).some(p => p.barcode === scannedBarcode);
      if (alreadyExists) {
        setStatusMessage(`Product with Barcode [${scannedBarcode}] is already added.`);
        isSubmittingScanRef.current = false;
        return;
      }

      try {
        const res = await addProductUsed(selectedJob.id, {
          name: productName || 'Engine Oil / Spare Part',
          barcode: scannedBarcode
        });
        setStatusMessage(`Product Barcode [${scannedBarcode}] Scanned & Verified.`);
        setSelectedJob(prev => ({ ...prev, usedProducts: res.usedProducts }));
        setBarcodeInput('');
      } catch (err) {
        if (err.message.includes('SECURITY ALERT') || err.message.includes('DUPLICATE')) {
          setDuplicateAlert(err.message);
        } else {
          alert(err.message);
        }
      } finally {
        isSubmittingScanRef.current = false;
      }
    } else {
      isSubmittingScanRef.current = false;
    }
  };

  const handleRemoveProduct = async (barcode) => {
    if (!selectedJob) return;
    try {
      const updatedProducts = (selectedJob.usedProducts || []).filter(p => p.barcode !== barcode);
      setSelectedJob(prev => ({ ...prev, usedProducts: updatedProducts }));
      
      const res = await removeProductUsed(selectedJob.id, barcode);
      if (res.usedProducts) {
        setSelectedJob(prev => ({ ...prev, usedProducts: res.usedProducts }));
      }
      setStatusMessage(`Scanned Item [${barcode}] removed.`);
    } catch (err) {
      alert(`Error removing item: ${err.message}`);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!selectedJob || !otpInput) return;
    try {
      const res = await verifyOtpAndComplete(selectedJob.id, otpInput);
      setSelectedJob(res.booking);
      setStatusMessage('OTP Verified successfully! Service completed.');
      loadJobs();
    } catch (err) {
      alert(`OTP Verification Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
        <p className="mt-3 text-slate-500 text-sm">Loading Assigned Servicing Jobs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xl">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold">Mechanic Execution Portal</h1>
              <span className="bg-emerald-900 text-emerald-300 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border border-emerald-700">
                Verified Expert
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Active Servicing Assignments: {jobs.length}</p>
          </div>
        </div>

        {/* GPS Broadcast Toggle */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center space-x-3 text-xs w-full md:w-auto justify-between">
          <div className="flex items-center space-x-2">
            <Radio className={`w-4 h-4 ${isGpsBroadcasting ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <div>
              <strong className="text-white block font-bold">Live GPS Broadcast</strong>
              <span className="text-[10px] text-slate-400">
                {isGpsBroadcasting ? 'Sharing real-time location' : 'Location sharing off'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleGpsBroadcast}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all shadow ${
              isGpsBroadcasting ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isGpsBroadcasting ? 'GPS ON' : 'Turn ON GPS'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Assigned Jobs List */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center">
            <Clock className="w-4 h-4 text-teal-600 mr-2" />
            Assigned Bookings ({jobs.length})
          </h3>

          {jobs.length === 0 ? (
            <p className="text-xs text-slate-500 bg-white p-6 rounded-2xl border text-center">No assigned jobs found.</p>
          ) : (
            jobs.map(job => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setDuplicateAlert(null);
                    setStatusMessage(null);
                  }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-teal-500 bg-teal-50/60 shadow-md ring-2 ring-teal-500/20' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{job.id}</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      job.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{job.customerName} ({job.vehicle?.make} {job.vehicle?.model})</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" /> {job.address}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                      Doorstep Service
                    </span>
                    <span className="font-bold text-teal-700">₹{job.totalPrice}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Job Execution */}
        {selectedJob ? (
          <div className="lg:col-span-2 space-y-6">
            
            {statusMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" /> {statusMessage}
              </div>
            )}

            {duplicateAlert && (
              <div className="p-5 bg-red-50 border-2 border-red-500 text-red-900 rounded-2xl text-xs font-semibold space-y-2">
                <div className="flex items-center font-bold text-sm text-red-700">
                  <ShieldAlert className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
                  DUPLICATE BARCODE DETECTED
                </div>
                <p className="leading-relaxed">{duplicateAlert}</p>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              
              {/* Job Header */}
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <div>
                  <span className="text-xs font-bold text-teal-600">Booking #{selectedJob.id}</span>
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedJob.vehicle?.make} {selectedJob.vehicle?.model}</h3>
                  <p className="text-xs text-slate-500">Customer: {selectedJob.customerName} ({selectedJob.customerPhone})</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-teal-100 text-teal-900 inline-block mb-1">
                    {selectedJob.status}
                  </span>
                  <p className="text-[11px] text-slate-400 block">{selectedJob.address}</p>
                </div>
              </div>

              {/* STEP 1: VEHICLE INSPECTION */}
              <div className="border-t border-slate-100 pt-5 mb-6 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center">
                  <Gauge className="w-4 h-4 text-teal-600 mr-2" />
                  Step 1: Log Vehicle Health Inspection
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Odometer Reading</label>
                    <input
                      type="text"
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs font-mono font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Fuel Level</label>
                    <input
                      type="text"
                      value={fuelLevel}
                      onChange={(e) => setFuelLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Battery Voltage</label>
                    <input
                      type="text"
                      value={batteryVoltage}
                      onChange={(e) => setBatteryVoltage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border text-xs bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Inspected')}
                  className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Save Vehicle Health Inspection
                </button>
              </div>

              {/* STEP 2: PRODUCT BARCODE SCAN */}
              <div className="border-t border-slate-100 pt-5 mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center">
                    <Barcode className="w-4 h-4 text-teal-600 mr-2" />
                    Step 2: Product & Spare Barcode Verification
                  </h4>
                  
                  <button
                    type="button"
                    onClick={() => setShowCameraScanner(true)}
                    className="flex items-center space-x-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Scan With Camera</span>
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Product Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Motul 7100 4T Synthetic Oil"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Barcode String</label>
                      <input
                        type="text"
                        placeholder="Scan or type barcode"
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-xs font-mono font-bold uppercase bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">
                      Register Barcode
                    </button>
                  </div>
                </form>

                {/* Scanned Items List */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Verified Products Used ({selectedJob.usedProducts?.length || 0})</label>
                  {selectedJob.usedProducts?.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No products scanned yet.</p>
                  ) : (
                    selectedJob.usedProducts?.map((prod, i) => (
                      <div key={i} className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs">
                        <div className="flex items-center space-x-3">
                          <Barcode className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="font-bold text-slate-900 block">{prod.name}</span>
                            <span className="font-mono text-emerald-800 text-[11px]">Barcode: [{prod.barcode}]</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded hidden sm:inline">
                            Verified
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(prod.barcode)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm"
                            title="Remove product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* STEP 3: OTP VERIFICATION */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center">
                  <FileCheck className="w-4 h-4 text-teal-600 mr-2" />
                  Step 3: Customer OTP Handover Verification
                </h4>

                <form onSubmit={handleVerifyOtp} className="flex items-center space-x-3 max-w-md">
                  <input
                    type="text"
                    placeholder="Customer 4-digit OTP"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="p-3 rounded-xl border text-xs font-mono font-bold tracking-widest text-center"
                  />
                  <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow cursor-pointer">
                    Verify OTP & Complete Service
                  </button>
                </form>
              </div>

            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white p-12 rounded-3xl border text-center text-slate-400">
            Select an assigned booking from the left list.
          </div>
        )}

      </div>

      {/* CAMERA SCANNER MODAL */}
      <CameraBarcodeScanner
        isOpen={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onScanSuccess={handleCameraScanSuccess}
      />

    </div>
  );
}
