import React from 'react';
import { ShieldCheck, MapPin, CheckCircle2, Phone, Mail, Bike, Award, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#08090b] text-slate-400 border-t border-white/10 text-sm mt-20 relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Bike className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-black text-2xl text-white tracking-tight">
                Service<span className="text-amber-400">Setu</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier proof-backed doorstep two-wheeler service. Certified mechanics, 100% genuine barcode-verified parts, live video proof, and 7-day satisfaction warranty.
            </p>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl inline-flex">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>7-Day Free Redo Guarantee</span>
            </div>
          </div>

          {/* Operating Cities */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              Operating Cities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="hover:text-amber-400 transition-colors cursor-pointer">Bengaluru (Koramangala, Indiranagar, HSR, Whitefield)</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">Delhi NCR (Gurugram, Noida, South Delhi)</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">Mumbai (Andheri, Bandra, Thane, Navi Mumbai)</li>
              <li className="hover:text-amber-400 transition-colors cursor-pointer">Pune & Hyderabad (Expansion Active)</li>
            </ul>
          </div>

          {/* Trust Standards */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Trust Standards
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Barcode Scanned Genuine Engine Oils</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Before & After Digital Proof Cards</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Odometer & Battery Voltage Health Audit</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Customer OTP Handover Verification</span>
              </li>
            </ul>
          </div>

          {/* Customer Helpline */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              24/7 Support Desk
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Need instant breakdown help or service guidance?
            </p>
            <div className="space-y-3 text-xs">
              <a 
                href="tel:1800-SETU-BIKE" 
                className="flex items-center space-x-3 bg-white/5 border border-white/10 hover:border-amber-500/40 p-3 rounded-2xl transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">Toll-Free Helpline</span>
                  <strong className="text-white font-bold group-hover:text-amber-400">+91 1800-SETU-BIKE</strong>
                </div>
              </a>

              <a 
                href="mailto:support@servicesetu.in" 
                className="flex items-center space-x-3 bg-white/5 border border-white/10 hover:border-amber-500/40 p-3 rounded-2xl transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">Official Email</span>
                  <strong className="text-white font-bold group-hover:text-amber-400">support@servicesetu.in</strong>
                </div>
              </a>
            </div>
          </div>

        </div>

        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ServiceSetu Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Warranty Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
