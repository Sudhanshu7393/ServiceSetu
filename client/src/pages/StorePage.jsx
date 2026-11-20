import React, { useState } from 'react';
import { ShoppingBag, Star, ShieldCheck, X, Plus, Minus, Trash2, CreditCard, CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';

export default function StorePage() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const products = [
    { id: 'p1', name: 'Motul 7100 4T 10W-40 Synthetic Engine Oil 1L', category: 'Engine Oils', price: 920, originalPrice: 1050, rating: 4.9, image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400', badge: 'Bestseller' },
    { id: 'p2', name: 'Castrol POWER1 ULTIMATE 10W-30 Full Synthetic 1L', category: 'Engine Oils', price: 780, originalPrice: 890, rating: 4.8, image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400', badge: 'Popular' },
    { id: 'p3', name: 'Waterless Eco-Wash & Polish Microfiber Kit', category: 'Maintenance', price: 349, originalPrice: 499, rating: 4.7, image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400', badge: 'Eco-Friendly' },
    { id: 'p4', name: 'Drive Chain Lube & Cleaner Spray Combo', category: 'Maintenance', price: 499, originalPrice: 650, rating: 4.9, image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400', badge: 'Mechanic Favorite' },
    { id: 'p5', name: 'NGK Spark Plug CR7HSA (Universal 4-Stroke)', category: 'Spare Parts', price: 189, originalPrice: 250, rating: 4.8, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', badge: 'OEM Quality' },
    { id: 'p6', name: 'Honda Activa Air Filter Element (Genuine)', category: 'Spare Parts', price: 299, originalPrice: 399, rating: 4.7, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', badge: 'Genuine Part' },
    { id: 'p7', name: 'Multipurpose WD-40 Spray 450ml', category: 'Maintenance', price: 449, originalPrice: 550, rating: 4.6, image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400', badge: 'Must Have' },
    { id: 'p8', name: 'Tyre Puncture Repair Kit (Portable)', category: 'Spare Parts', price: 299, originalPrice: 399, rating: 4.5, image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400', badge: 'Emergency Kit' },
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
        name: 'ServiceSetu Store',
        description: `${cartCount} items purchase`,
        handler: () => { setOrderPlaced(true); setShowCart(false); setCart([]); },
        theme: { color: '#0d9488' }
      };
      new window.Razorpay(options).open();
    } else {
      // Simulate success for now
      setOrderPlaced(true);
      setShowCart(false);
      setCart([]);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-12 shadow-lg">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Order Placed! 🎉</h2>
          <p className="text-slate-500 mb-6">Your genuine parts & oils will be delivered within 2-3 business days.</p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-600 mb-8">
            <div className="flex items-center gap-2"><Package className="w-4 h-4 text-teal-600" /><span>Packed & Verified</span></div>
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-teal-600" /><span>Free Delivery</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-600" /><span>100% Genuine</span></div>
          </div>
          <button onClick={() => setOrderPlaced(false)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-2xl transition-all">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Your Cart</h2>
                <p className="text-xs text-slate-400">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">Your cart is empty</p>
                  <p className="text-slate-300 text-sm mt-1">Add items from the store</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">{item.name}</p>
                      <p className="text-teal-600 font-extrabold text-sm mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-red-100 rounded-lg transition-all">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                      <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-2 py-1">
                        <button onClick={() => updateQty(item.id, -1)} className="text-slate-500 hover:text-teal-600 transition-all">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-slate-900 w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="text-slate-500 hover:text-teal-600 transition-all">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-white space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span><span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? 'text-teal-600 font-bold' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                  </div>
                  {delivery > 0 && <p className="text-xs text-slate-400">Add ₹{1000 - cartTotal} more for free delivery</p>}
                  <div className="flex justify-between font-extrabold text-slate-900 text-base pt-2 border-t border-slate-100">
                    <span>Total</span><span>₹{grandTotal}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-200"
                >
                  <CreditCard className="w-5 h-5" />
                  Checkout — ₹{grandTotal}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 100% Genuine Parts · Secure Payment
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 border border-teal-800 px-3 py-1 rounded-full inline-block mb-2">
            ServiceSetu Genuine Store
          </span>
          <h1 className="text-2xl font-extrabold">Engine Oils, Parts & Accessories</h1>
          <p className="text-xs text-slate-300 mt-1">Delivered to your door or installed during service. 100% genuine products.</p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="mt-4 sm:mt-0 relative flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white border-teal-600 shadow'
                : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(prod => {
          const inCart = cart.find(i => i.id === prod.id);
          return (
            <div key={prod.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="relative">
                <img src={prod.image} alt={prod.name} className="w-full h-48 object-cover" />
                <span className="absolute top-3 left-3 bg-slate-950 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow">
                  {prod.badge}
                </span>
                <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">
                  {Math.round((1 - prod.price / prod.originalPrice) * 100)}% OFF
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
                  {inCart ? (
                    <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-3 py-1.5">
                      <button onClick={() => updateQty(prod.id, -1)} className="text-teal-600 hover:text-teal-800 transition-all">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-extrabold text-teal-700">{inCart.qty}</span>
                      <button onClick={() => addToCart(prod)} className="text-teal-600 hover:text-teal-800 transition-all">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(prod)}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
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
      <div className="mt-10 grid grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, text: '100% Genuine Products', sub: 'Verified with barcode scan' },
          { icon: Truck, text: 'Free Delivery ₹999+', sub: '2-3 business days' },
          { icon: CheckCircle, text: 'Mechanic Installation', sub: 'Available with service booking' },
        ].map(({ icon: Icon, text, sub }) => (
          <div key={text} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
            <Icon className="w-6 h-6 text-teal-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">{text}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
