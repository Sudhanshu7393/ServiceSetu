import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AmcPage() {
  const [subscribed, setSubscribed] = useState(false);

  const plans = [
    {
      id: 'amc-basic',
      name: 'Silver AMC Plan',
      price: 1499,
      duration: '1 Year (12 Months)',
      services: '3 Complete Doorstep Servicings',
      features: [
        '3 Doorstep Standard Services included',
        'Free OEM Engine oil in all 3 visits',
        'Zero convenience / visit fee',
        'Free chain lube & adjustments',
        '10% discount on spare parts & accessories',
        'Digital vehicle maintenance logbook'
      ]
    },
    {
      id: 'amc-gold',
      name: 'Gold Protection AMC Plan',
      price: 2499,
      duration: '1 Year (12 Months)',
      popular: true,
      services: '4 Comprehensive Doorstep Servicings + 2 Roadside SOS',
      features: [
        '4 Comprehensive Doorstep Servicings',
        'Full synthetic Motul / Castrol oil upgrades included',
        '2 Free Emergency Breakdown SOS mechanic dispatches',
        'Free air filter & spark plug replacements',
        '15% discount on all workshop repairs',
        'Dedicated senior mechanic assigned'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="gradient-bg text-white p-8 sm:p-12 rounded-3xl text-center shadow-xl mb-12 relative overflow-hidden">
        <span className="bg-teal-500/20 text-teal-300 text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-teal-400/30 inline-block mb-3">
          Annual Maintenance Subscription (AMC)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Hassle-Free Annual Two-Wheeler Care
        </h1>
        <p className="mt-2 text-slate-300 text-sm max-w-2xl mx-auto">
          Subscribe to ServiceSetu AMC for fixed-price year-round servicing, zero visit charges, free synthetic oil, and emergency breakdown protection.
        </p>
      </div>

      {subscribed ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-xl mx-auto shadow-lg">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">AMC Subscription Active!</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">Your Gold Protection AMC Plan is now linked to your registered phone number. Your first service voucher is ready to claim.</p>
          <button
            onClick={() => setSubscribed(false)}
            className="bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl"
          >
            Manage AMC Subscription
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl border p-8 shadow-sm flex flex-col justify-between relative ${
                plan.popular ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md' : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 right-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow">
                  Best Value Plan
                </span>
              )}

              <div>
                <h3 className="font-extrabold text-xl text-slate-900">{plan.name}</h3>
                <p className="text-xs font-semibold text-teal-700 mt-1">{plan.duration}</p>

                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">₹{plan.price}</span>
                  <span className="text-xs text-slate-400 block mt-0.5">Annual All-Inclusive Price</span>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4 mb-6 text-xs text-slate-600">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSubscribed(true)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow text-sm flex items-center justify-center space-x-2"
              >
                <span>Subscribe to {plan.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
