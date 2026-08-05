import React from 'react';
import { Shield, MapPin, CheckCircle2, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl text-white">Service<span className="text-teal-400">Setu</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's first proof-backed doorstep two-wheeler servicing platform. Verified mechanics, genuine oil with duplicate barcode detection, upfront pricing, and digital Service Proof Reports.
            </p>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
              <Shield className="w-4 h-4" />
              <span>Standard Operating Verification Guarantee</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Core Operating Cities</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5"><MapPin className="w-3.5 h-3.5 text-teal-400" /> <span>Bengaluru (Indiranagar, Koramangala, HSR, Whitefield)</span></li>
              <li className="flex items-center space-x-1.5"><MapPin className="w-3.5 h-3.5 text-teal-400" /> <span>Delhi NCR (Gurugram, Noida, South Delhi)</span></li>
              <li className="flex items-center space-x-1.5"><MapPin className="w-3.5 h-3.5 text-teal-400" /> <span>Mumbai (Andheri, Bandra, Thane, Navi Mumbai)</span></li>
              <li className="flex items-center space-x-1.5"><MapPin className="w-3.5 h-3.5 text-teal-400" /> <span>Hyderabad & Pune</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Verification Standards</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> <span>Product Barcode Scan & Duplicate Audit</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> <span>Before/After High-Res Inspection Photos</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> <span>Odometer Reading Verification</span></li>
              <li className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> <span>Customer OTP Handover Confirmation</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Customer Support</h4>
            <p className="text-xs text-slate-400 mb-3">Need assistance with your vehicle booking?</p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>+91 1800-SETU-BIKE (Toll Free)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>support@servicesetu.in</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
          © 2026 ServiceSetu Technologies Pvt. Ltd. All rights reserved. Built with precision for India's two-wheeler owners.
        </div>
      </div>
    </footer>
  );
}
