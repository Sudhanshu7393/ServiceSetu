import React, { useState } from 'react';
import { Bike, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-[#040507] text-slate-400 border-t border-white/5 text-sm pt-20 pb-12 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-orange-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/5">
          
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-slate-950 font-black">
                <Bike className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                Service<span className="text-orange-500">Setu</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Crafting the future of two-wheeler servicing with precision doorstep mechanics, anti-counterfeit barcode audits, and uncompromising customer transparency.
            </p>
          </div>

          {/* Column 2: Navigation (2 cols) */}
          <div className="md:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#signature-packages-section" className="hover:text-white transition-colors">Service Models</a></li>
              <li><a href="#about-section" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#features-section" className="hover:text-white transition-colors">Performance Standards</a></li>
              <li><a href="#reviews-section" className="hover:text-white transition-colors">Rider Reviews</a></li>
            </ul>
          </div>

          {/* Column 3: Contact (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                <span>support@servicesetu.in</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                <span>1-800-SETU-BIKE (Toll Free)</span>
              </li>
              <li className="flex items-start space-x-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>Koramangala 4th Block, Bengaluru, KA 560034</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Newsletter</h4>
            <p className="text-xs text-slate-400 mb-4">
              Stay updated with our latest offers, genuine parts drops & maintenance alerts.
            </p>

            {subscribed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12141a] border border-white/10 text-white placeholder-slate-600 text-xs focus:border-orange-500 focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  className="w-full btn-copper-pill text-xs font-black py-2.5 rounded-xl"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ServiceSetu Inc. Built for precision two-wheeler care.</p>
          <div className="flex items-center space-x-6 text-slate-400 text-xs">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Warranty Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
