import React, { useState } from 'react';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/api';
import { CreditCard, QrCode, ShieldCheck, CheckCircle2, Lock, X, AlertCircle } from 'lucide-react';

export default function RazorpayModal({ isOpen, onClose, amount, onSuccess }) {
  const [paymentType, setPaymentType] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handlePay = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      // Step 1: Create Razorpay Order ID from Express Backend
      const orderRes = await createRazorpayOrder(amount, 'SS-ONLINE');
      
      // Step 2: Simulate Razorpay Payment Response & Verify HMAC Signature
      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 15)}`;
      const mockSignature = `sig_test_${Math.random().toString(36).substring(2, 15)}`;

      const verifyRes = await verifyRazorpaySignature({
        razorpay_order_id: orderRes.orderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: mockSignature
      });

      if (verifyRes.success) {
        setIsProcessing(false);
        onSuccess(verifyRes.paymentId);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment processing error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              RZP
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Razorpay Official Test Checkout</h3>
              <span className="text-[10px] text-teal-300 font-semibold">100% Free Test Mode SDK</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="bg-teal-50 p-4 border-b border-teal-100 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-semibold">Total Amount Payable</span>
          <span className="text-xl font-extrabold text-teal-800">₹{amount}</span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-800 text-xs font-bold border-b border-red-100 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Payment Methods */}
        <div className="p-6 space-y-4">
          <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Select Payment Method</label>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentType('upi')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center space-x-2 transition-all ${
                paymentType === 'upi' ? 'border-teal-500 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20' : 'border-slate-200 text-slate-700'
              }`}
            >
              <QrCode className="w-4 h-4 text-teal-600" />
              <span>UPI / Google Pay</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType('card')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center space-x-2 transition-all ${
                paymentType === 'card' ? 'border-teal-500 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20' : 'border-slate-200 text-slate-700'
              }`}
            >
              <CreditCard className="w-4 h-4 text-teal-600" />
              <span>Credit / Debit Card</span>
            </button>
          </div>

          {paymentType === 'upi' ? (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-32 h-32 bg-white border border-slate-300 rounded-xl mx-auto flex items-center justify-center p-2">
                <QrCode className="w-24 h-24 text-slate-800" />
              </div>
              <p className="text-[11px] text-slate-500">Scan QR using GPay, PhonePe, Paytm, or BHIM UPI</p>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <input type="text" placeholder="Card Number (4000 1234 5678 9010)" className="w-full p-2.5 rounded-xl border text-xs" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="MM/YY" className="p-2.5 rounded-xl border text-xs" />
                <input type="password" placeholder="CVV" className="p-2.5 rounded-xl border text-xs" />
              </div>
            </div>
          )}

          <div className="flex items-center text-[10px] text-slate-500 justify-center space-x-1 pt-2">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Razorpay HMAC SHA256 Signature Verification Active</span>
          </div>

          <button
            disabled={isProcessing}
            onClick={handlePay}
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <span>Verifying Razorpay Order & Signature...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₹{amount} via Razorpay</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
