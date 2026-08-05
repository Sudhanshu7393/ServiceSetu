import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, RefreshCw, Volume2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function CameraBarcodeScanner({ isOpen, onClose, onScanSuccess }) {
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const html5QrcodeRef = useRef(null);
  const isProcessingScanRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      isProcessingScanRef.current = false;
      return;
    }

    isProcessingScanRef.current = false;

    // Fetch available video cameras
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          const backCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        } else {
          setErrorMsg('No video camera devices detected on this system.');
        }
      })
      .catch(err => {
        setErrorMsg('Camera Permission Error: Please allow camera access in your browser settings.');
      });

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async (cameraId) => {
    setErrorMsg(null);
    try {
      if (html5QrcodeRef.current && isScanning) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode('qr-reader-viewport');
      html5QrcodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 280, height: 180 },
        aspectRatio: 1.777778
      };

      await html5QrCode.start(
        cameraId,
        config,
        async (decodedText) => {
          // LOCK: Prevent multiple triggers per scan frame
          if (isProcessingScanRef.current) return;
          isProcessingScanRef.current = true;

          const cleanBarcode = decodedText.trim().toUpperCase();

          // Stop scanner immediately
          try {
            if (html5QrcodeRef.current) {
              await html5QrcodeRef.current.stop();
              html5QrcodeRef.current.clear();
            }
          } catch (e) {
            console.error('Scanner stop error', e);
          } finally {
            setIsScanning(false);
          }

          // Play audio beep sound
          playBeep();

          // Send single scan callback
          onScanSuccess(cleanBarcode);

          // Close modal
          onClose();
        },
        (errorMessage) => {
          // Normal frame scan ignore
        }
      );
      setIsScanning(true);
    } catch (err) {
      setErrorMsg(`Failed to start camera stream: ${err.message || err}`);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrcodeRef.current && isScanning) {
      try {
        await html5QrcodeRef.current.stop();
        html5QrcodeRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      } finally {
        setIsScanning(false);
      }
    }
  };

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.log('Audio Context error', e);
    }
  };

  useEffect(() => {
    if (selectedCameraId && isOpen) {
      startScanner(selectedCameraId);
    }
  }, [selectedCameraId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Live Camera Barcode & QR Scanner</h3>
              <span className="text-[10px] text-teal-300 font-semibold">Single-Scan Lock Protected</span>
            </div>
          </div>
          <button 
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Container */}
        <div className="p-6">
          
          {errorMsg ? (
            <div className="bg-red-950/60 border border-red-800 p-6 rounded-2xl text-center text-red-200 space-y-2">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
              <h4 className="font-bold text-sm">Camera Stream Error</h4>
              <p className="text-xs text-red-300">{errorMsg}</p>
            </div>
          ) : (
            <>
              {/* HTML5 Camera Stream Box */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-teal-500/50 bg-black min-h-[260px] shadow-inner flex items-center justify-center">
                <div id="qr-reader-viewport" className="w-full h-full"></div>
                
                {/* Laser Animation Overlay */}
                <div className="absolute inset-x-8 top-1/2 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse"></div>
              </div>

              {/* Camera Switcher Controls */}
              {cameras.length > 1 && (
                <div className="mt-4 flex items-center justify-between text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-medium">Camera Source:</span>
                  <select
                    value={selectedCameraId}
                    onChange={(e) => setSelectedCameraId(e.target.value)}
                    className="bg-slate-900 text-teal-300 font-bold border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                  >
                    {cameras.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.label || `Camera ${c.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div className="mt-4 text-center text-[11px] text-slate-400 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Point camera at any physical barcode or QR code on engine oil can / spare box</span>
          </div>

        </div>

      </div>
    </div>
  );
}
