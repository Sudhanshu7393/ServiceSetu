import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, ArrowRight, Bike, Zap, PhoneCall, Sparkles } from 'lucide-react';

export default function AmcPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState('Gold Protection');

  const plans = [
    {
      id: 'amc-silver',
      name: 'Silver Seva AMC',
      price: 999,
      duration: '1 Year (12 Months)',
      services: '3 Complete Doorstep Servicings',
      popular: false,
      features: [
        '3 Doorstep Periodic Standard Services',
        'Engine oil change included in all 3 visits',
        'Zero visit / convenience fee forever',
        'Free chain lube, brake tuning & wash',
        '10% flat discount on all spare parts & oils',
        'Digital maintenance proof logbook'
      ]
    },
    {
      id: 'amc-gold',
      name: 'Gold Protection AMC',
      price: 1499,
      duration: '1 Year (12 Months)',
      popular: true,
      services: '4 Doorstep Servicings + 2 Roadside SOS',
      features: [
        '4 Comprehensive Doorstep Servicings',
        'Full synthetic Motul / Castrol oil upgrades included',
        '2 Free Emergency Breakdown SOS Dispatches',
        'Free air filter & spark plug replacements',
        '15% discount on all spare parts & store products',
        'Priority booking window during festival seasons'
      ]
    },
    {
      id: 'amc-elite',
      name: 'Elite Royal & EV Club',
      price: 2199,
      duration: '1 Year (12 Months)',
      popular: false,
      services: '6 Servicings + Unlimited SOS + EV Ready',
      features: [
        '6 Comprehensive Doorstep Servicings',
        'Electric Vehicle (EV) battery & motor checks included',
        'Unlimited Roadside Breakdown SOS Assistance',
        'Free synthetic brake fluid & cable overhaul',
        '20% VIP discount on all store items',
        'Dedicated Senior Master Mechanic assigned'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-[#12141c] text-white p-8 sm:p-14 rounded-3xl text-center border border-white/10 shadow-2xl mb-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5 mb-4">
              <Award className="w-4 h-4 text-amber-400" />
              Annual Maintenance Subscription (AMC)
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Hassle-Free Annual Two-Wheeler Care
            </h1>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Subscribe to ServiceSetu AMC for fixed-price year-round servicing, zero visit charges, free synthetic oil, and 24/7 emergency breakdown protection.
            </p>
          </div>
        </div>

        {subscribed ? (
          <div className="bg-[#12141c] p-10 sm:p-14 rounded-3xl border border-amber-500/40 text-center max-w-xl mx-auto shadow-2xl">
            <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
              <Award className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-3xl font-black text-white">{selectedPlanName} Active! 🎉</h2>
            <p className="text-xs text-slate-400 mt-2 mb-8 leading-relaxed">
              Your subscription is now securely linked to your registered phone number. Your first doorstep service voucher is active and ready to use.
            </p>
            <button
              onClick={() => setSubscribed(false)}
              className="btn-amber-glow font-black text-xs px-8 py-3.5 rounded-xl"
            >
              Manage AMC Subscription
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`bg-[#12141c] rounded-3xl border p-8 shadow-xl flex flex-col justify-between relative transition-all duration-300 ${
                  plan.popular 
                    ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105 shadow-2xl shadow-amber-500/20' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-black uppercase px-3.5 py-1 rounded-full shadow-lg">
                    Best Value Plan
                  </span>
                )}

                <div>
                  <h3 className="font-black text-xl text-white">{plan.name}</h3>
                  <p className="text-xs font-bold text-amber-400 mt-1">{plan.duration}</p>

                  <div className="mt-5 mb-8">
                    <span className="text-4xl font-black text-white font-mono">₹{plan.price}</span>
                    <span className="text-xs text-slate-500 block mt-1 font-medium">All-Inclusive Annual Price</span>
                  </div>

                  <div className="space-y-3.5 border-t border-white/10 pt-6 mb-8 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2.5 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlanName(plan.name);
                    setSubscribed(true);
                  }}
                  className={`w-full py-4 rounded-2xl transition-all text-xs font-black flex items-center justify-center space-x-2 cursor-pointer ${
                    plan.popular
                      ? 'btn-amber-glow shadow-xl shadow-amber-500/20'
                      : 'btn-outline-garage'
                  }`}
                >
                  <span>Subscribe to {plan.name}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
