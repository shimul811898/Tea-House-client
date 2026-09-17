'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, ShieldCheck, CreditCard, Banknote, Smartphone, ArrowLeft, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { user, isAuthenticated, loading: authLoading, authFetch } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Dhaka',
    paymentMethod: 'Cash on Delivery',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const deliveryFee = cart.length > 0 ? 60 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty. Please add tea products first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        products: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        paymentMethod: formData.paymentMethod,
        totalAmount: grandTotal,
      };

      const res = await authFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Success celebration!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      setOrderPlaced(data.order);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Order Confirmed view
  if (orderPlaced) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full text-center space-y-6 bg-neutral-50 p-8 sm:p-10 rounded-3xl border border-neutral-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold text-orange-600 tracking-wider">
              Order Confirmed
            </span>
            <h1 className="text-2xl font-black text-neutral-900 mt-1">Thank You For Your Order!</h1>
            <p className="text-xs text-neutral-500 mt-2">
              Order ID:{' '}
              <strong className="text-neutral-900 font-mono">{orderPlaced._id}</strong>
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Recipient:</span>
              <span className="font-semibold text-neutral-900">{orderPlaced.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Delivery Address:</span>
              <span className="font-semibold text-neutral-900">
                {orderPlaced.address}, {orderPlaced.city}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment:</span>
              <span className="font-semibold text-neutral-900">{orderPlaced.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-neutral-100 font-bold text-sm">
              <span>Total Amount:</span>
              <span className="text-orange-600">৳{orderPlaced.totalAmount}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full py-3.5 rounded-xl btn-gradient text-xs font-bold shadow-md block"
            >
              Track in My Dashboard
            </Link>
            <Link
              href="/products"
              className="w-full py-3.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 block transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/60 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-orange-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Checkout & Delivery
          </h1>
        </div>

        {!isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <p className="text-xs text-amber-800">
              Please sign in to place your order and track delivery status in real-time.
            </p>
            <Link
              href="/login?redirect=/checkout"
              className="px-4 py-2 rounded-xl btn-gradient text-xs font-bold shrink-0"
            >
              Sign In Now
            </Link>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customer Info & Shipping */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="tanvir@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Street Address / House / Flat *
              </label>
              <textarea
                name="address"
                required
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="House 12, Road 4, Sector 7, Uttara"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">City / Region *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 bg-white"
              >
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet (Tea Gardens)</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Barisal">Barisal</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-4 border-t border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Select Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote },
                  { id: 'bKash / Nagad', label: 'bKash / Nagad', icon: Smartphone },
                  { id: 'Card', label: 'Credit/Debit Card', icon: CreditCard },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = formData.paymentMethod === pm.id;
                  return (
                    <button
                      type="button"
                      key={pm.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-orange-600' : 'text-neutral-500'}`} />
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-orange-500 bg-orange-500' : 'border-neutral-300'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-neutral-800">{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Order Review */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Order Review ({cart.length} items)
            </h2>

            <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 p-1.5 flex items-center justify-center shrink-0 border border-neutral-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">{item.name}</h4>
                      <p className="text-[11px] text-neutral-400">
                        ৳{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-neutral-900">
                    ৳{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs pt-3 border-t border-neutral-100 text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-neutral-900">৳{deliveryFee}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-neutral-100 text-base font-black text-neutral-900">
                <span>Grand Total</span>
                <span className="text-orange-600">৳{grandTotal}</span>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full py-4 rounded-xl btn-gradient font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Confirm & Place Order (৳{grandTotal})</span>
                )}
              </button>
            ) : (
              <Link
                href="/login?redirect=/checkout"
                className="w-full py-4 rounded-xl btn-gradient font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-center"
              >
                <Lock className="w-4 h-4" />
                <span>Sign in to Complete Order (৳{grandTotal})</span>
              </Link>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe and secure 256-bit encrypted transaction</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
