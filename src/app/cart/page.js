'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const deliveryFee = cart.length > 0 ? 60 : 0;
  const grandTotal = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white space-y-4">
        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Your Shopping Cart is Empty</h1>
        <p className="text-sm text-neutral-500 max-w-sm">
          Looks like you haven&apos;t added any artisanal teas to your cart yet.
        </p>
        <Link
          href="/products"
          className="mt-2 px-6 py-3 rounded-xl btn-gradient text-xs font-bold shadow-md inline-flex items-center gap-2"
        >
          <span>Explore Teas</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/60 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-neutral-500 mt-1">{totalItems} tea items in your bag</p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-bold text-neutral-400 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
            <div className="divide-y divide-neutral-100">
              {cart.map((item) => (
                <div key={item._id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Product Image and Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-neutral-50 p-2 border border-neutral-100 flex items-center justify-center shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="object-contain max-h-16"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-neutral-900">{item.name}</h3>
                      <p className="text-xs text-neutral-400 mt-0.5">Unit: ৳{item.price}</p>
                    </div>
                  </div>

                  {/* Right: Quantity controls, total, and trash */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-neutral-600 hover:text-orange-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-neutral-600 hover:text-orange-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-extrabold text-neutral-900">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Delivery (Standard Inside BD)</span>
                <span className="font-semibold text-neutral-900">৳{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tax / VAT</span>
                <span className="font-semibold text-neutral-900">৳0</span>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-between text-base">
                <span className="font-bold text-neutral-900">Total Amount</span>
                <span className="font-extrabold text-xl text-orange-600">৳{grandTotal}</span>
              </div>
            </div>

            <Link
              href={isAuthenticated ? '/checkout' : '/login?redirect=/checkout'}
              className="w-full py-4 rounded-xl btn-gradient font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
            >
              {!isAuthenticated && <Lock className="w-4 h-4" />}
              <span>{isAuthenticated ? 'Proceed to Checkout' : 'Login to Purchase'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[11px] text-center text-neutral-400">
              Safe & Encrypted Checkout with Instant Order Confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
