import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  CheckCircle, 
  Package, 
  Truck, 
  ArrowRight,
  Bike,
  Sparkles,
  Tag
} from 'lucide-react';

export default function StorePage() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const products = [
    { id: 'p1', name: 'Motul 7100 4T 10W-40 Synthetic Engine Oil 1L', category: 'Engine Oils', price: 920, originalPrice: 1050, rating: 4.9, image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=80', badge: 'Bestseller' },
    { id: 'p2', name: 'Castrol POWER1 ULTIMATE 10W-30 Full Synthetic 1L', category: 'Engine Oils', price: 780, originalPrice: 890, rating: 4.8, image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=80', badge: 'Popular' },
    { id: 'p3', name: 'Waterless Eco-Wash & Polish Microfiber Kit', category: 'Maintenance', price: 349, originalPrice: 499, rating: 4.7, image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500&auto=format&fit=crop&q=80', badge: 'Eco-Friendly' },
    { id: 'p4', name: 'Drive Chain Lube & Cleaner Spray Combo', category: 'Maintenance', price: 499, originalPrice: 650, rating: 4.9, image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80', badge: 'Mechanic Favorite' },
    { id: 'p5', name: 'NGK Spark Plug CR7HSA (Universal 4-Stroke)', category: 'Spare Parts', price: 189, originalPrice: 250, rating: 4.8, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=80', badge: 'OEM Quality' },
    { id: 'p6', name: 'Honda Activa Air Filter Element (Genuine)', category: 'Spare Parts', price: 299, originalPrice: 399, rating: 4.7, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&auto=format&fit=crop&q=80', badge: 'Genuine Part' },
    { id: 'p7', name: 'Multipurpose WD-40 Maintenance Spray 450ml', category: 'Maintenance', price: 449, originalPrice: 550, rating: 4.6, image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&auto=format&fit=crop&q=80', badge: 'Must Have' },
    { id: 'p8', name: 'Tubeless Tyre Puncture Repair Kit (Heavy Duty)', category: 'Spare Parts', price: 299, originalPrice: 399, rating: 4.5, image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=500&auto=format&fit=crop&q=80', badge: 'Emergency Kit' },
  ];

  const categories = ['All', 'Engine Oils', 'Maintenance', 'Spare Parts'];
  const filteredProducts = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const delivery = cartTotal > 999 ? 0 : 49;
  const grandTotal = cartTotal + delivery;

  const handleCheckout = () => {
    if (typeof window.Razorpay !== 'undefined') {
      const options = {
        key: 'rzp_test_placeholder',
        amount: grandTotal * 100,
        currency: 'INR',
        name: 'ServiceSetu Parts Store',
        description: `${cartCount} items purchase`,
        handler: () => { setOrderPlaced(true); setShowCart(false); setCart([]); },
        theme: { color: '#f59e0b' }
      };
      new window.Razorpay(options).open();
    } else {
      setOrderPlaced(true);
      setShowCart(false);
      setCart([]);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="bg-[#12141c] rounded-3xl border border-amber-500/40 p-12 shadow-2xl">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-amber-400 stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Order Confirmed! 🎉</h2>
          <p className="text-slate-400 mb-8 text-sm">
            Your 100% genuine motorcycle consumables will be delivered to your doorstep within 2 business days or installed during your next service.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-300 mb-8 border-y border-white/5 py-4">
            <div className="flex items-center gap-2"><Package className="w-4 h-4 text-amber-400" /><span>Barcode Verified</span></div>
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-amber-400" /><span>Free Fast Shipping</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-400" /><span>OEM Authentic</span></div>
          </div>
          <button 
            onClick={() => setOrderPlaced(false)} 
            className="btn-amber-glow font-black px-8 py-3.5 rounded-2xl text-sm"
          >
            Continue Shopping Parts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cart Drawer Modal */}
        {showCart && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCart(false)} />
            <div className="relative w-full max-w-md bg-[#12141c] text-white h-full shadow-2xl flex flex-col border-l border-white/10 z-10">
              
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-black text-white">Your Cart</h2>
                  <p className="text-xs text-amber-400 font-bold">{cartCount} items selected</p>
                </div>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">Your cart is empty</p>
                    <p className="text-slate-500 text-xs mt-1">Select genuine parts and consumables from the catalog</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 bg-[#181a24] border border-white/5 rounded-2xl p-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-white/10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white line-clamp-2 leading-snug">{item.name}</p>
                        <p className="text-amber-400 font-black text-sm mt-1">₹{item.price}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-2 bg-[#0e1015] rounded-xl border border-white/10 px-2 py-1">
                          <button onClick={() => updateQty(item.id, -1)} className="text-slate-400 hover:text-amber-400 transition-all">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="text-slate-400 hover:text-amber-400 transition-all">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer Checkout */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-[#0e1015] space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span><span className="text-white font-mono">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Doorstep Delivery</span>
                      <span className={delivery === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                        {delivery === 0 ? 'FREE' : `₹${delivery}`}
                      </span>
                    </div>
                    {delivery > 0 && (
                      <p className="text-[11px] text-amber-400">Add ₹{1000 - cartTotal} more for FREE shipping</p>
                    )}
                    <div className="flex justify-between font-black text-white text-base pt-2 border-t border-white/10">
                      <span>Total Amount:</span><span className="text-amber-400 font-mono">₹{grandTotal}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-amber-glow font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20"
                  >
                    <CreditCard className="w-5 h-5 stroke-[2.5]" />
                    <span>Proceed to Checkout — ₹{grandTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> 100% Genuine Certified · Secure Razorpay
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Store Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 bg-[#12141c] text-white p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full inline-block mb-3">
              ServiceSetu Genuine Spare Parts & Lubricants
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Genuine Consumables & High-Grade Parts
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Authentic lubricants, OEM air filters, performance spark plugs, and emergency breakdown kits.
            </p>
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="mt-6 sm:mt-0 relative flex items-center space-x-2 btn-amber-glow px-6 py-3.5 rounded-2xl text-xs font-black shadow-lg"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>View Cart ({cartCount})</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2.5 mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                  : 'bg-[#12141c] text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid matching Dark Garage Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(prod => {
            const inCart = cart.find(i => i.id === prod.id);

            return (
              <div 
                key={prod.id} 
                className="bg-[#12141c] rounded-3xl border border-white/10 overflow-hidden shadow-lg flex flex-col justify-between hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden bg-[#181a24]">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-amber-500/30 shadow">
                    {prod.badge}
                  </span>
                  <span className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                    {Math.round((1 - prod.price / prod.originalPrice) * 100)}% OFF
                  </span>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">{prod.category}</span>
                    <h3 className="font-extrabold text-white text-sm mt-1 leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors">
                      {prod.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-amber-400 mt-2 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{prod.rating}</span>
                      <span className="text-slate-500 text-[11px] font-normal ml-1">• Verified Review</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-white font-mono">₹{prod.price}</span>
                      <span className="text-xs text-slate-500 line-through ml-1.5">₹{prod.originalPrice}</span>
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-2.5 py-1">
                        <button onClick={() => updateQty(prod.id, -1)} className="text-amber-400 hover:text-white transition-all">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-amber-300">{inCart.qty}</span>
                        <button onClick={() => addToCart(prod)} className="text-amber-400 hover:text-white transition-all">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(prod)}
                        className="btn-amber-glow text-xs font-black px-4 py-2 rounded-xl transition-all shadow-sm"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, text: '100% Genuine Verified', sub: 'Tamper-evident barcode seals' },
            { icon: Truck, text: 'Free Delivery ₹999+', sub: 'Fast shipping across operating cities' },
            { icon: CheckCircle, text: 'Installed at Doorstep', sub: 'Mechanic can install during your service' },
          ].map(({ icon: Icon, text, sub }) => (
            <div key={text} className="bg-[#12141c] rounded-2xl p-5 text-center border border-white/5">
              <Icon className="w-7 h-7 text-amber-400 mx-auto mb-2" />
              <p className="text-sm font-black text-white">{text}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
