import React, { useState } from 'react';
import { ShoppingBag, Star, CheckCircle, ShieldCheck } from 'lucide-react';

export default function StorePage() {
  const [cartCount, setCartCount] = useState(0);

  const products = [
    {
      id: 'p1',
      name: 'Motul 7100 4T 10W-40 100% Synthetic Engine Oil 1L',
      category: 'Engine Oils',
      price: 920,
      originalPrice: 1050,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400',
      badge: 'Bestseller'
    },
    {
      id: 'p2',
      name: 'Castrol POWER1 ULTIMATE 10W-30 Full Synthetic 1L',
      category: 'Engine Oils',
      price: 780,
      originalPrice: 890,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400',
      badge: 'Popular'
    },
    {
      id: 'p3',
      name: 'Waterless Eco-Wash & Polish Microfiber Kit',
      category: 'Maintenance',
      price: 349,
      originalPrice: 499,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400',
      badge: 'Doorstep Essential'
    },
    {
      id: 'p4',
      name: 'High-Viscosity Drive Chain Lube & Cleaner Spray Combo',
      category: 'Maintenance',
      price: 499,
      originalPrice: 650,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400',
      badge: 'Mechanic Favorite'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 border border-teal-800 px-3 py-1 rounded-full inline-block mb-2">
            ServiceSetu Accessories & Oils
          </span>
          <h1 className="text-2xl font-extrabold">Genuine Consumables & Accessories Store</h1>
          <p className="text-xs text-slate-300 mt-1">Directly delivered or installed by your doorstep mechanic during service.</p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow">
          <ShoppingBag className="w-4 h-4" />
          <span>Cart Items ({cartCount})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(prod => (
          <div key={prod.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="relative">
              <img src={prod.image} alt={prod.name} className="w-full h-48 object-cover" />
              <span className="absolute top-3 left-3 bg-slate-950 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow">
                {prod.badge}
              </span>
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">{prod.category}</span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1 leading-snug">{prod.name}</h3>
                <div className="flex items-center space-x-1 text-xs text-amber-500 mt-2 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{prod.rating}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-slate-900">₹{prod.price}</span>
                  <span className="text-xs text-slate-400 line-through ml-1.5">₹{prod.originalPrice}</span>
                </div>

                <button
                  onClick={() => setCartCount(cartCount + 1)}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
