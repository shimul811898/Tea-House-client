'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#FFEFEA] text-neutral-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar: Logo & Get Started CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-14 border-b border-[#F7DDD6]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image
                src="/assests/cup.png"
                alt="Tea House Logo"
                width={38}
                height={38}
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-black text-neutral-900 tracking-tight">Tea House</span>
          </Link>

          {/* Action CTA */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-neutral-700">Ready to get started?</span>
            <Link
              href="/products"
              className="px-6 py-3 rounded-xl btn-gradient text-xs sm:text-sm font-bold shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* 4 Column Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Col 1: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-neutral-900 mb-4 tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <Link href="/" className="hover:text-orange-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-orange-600 transition-colors">
                  Our Products
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-orange-600 transition-colors">
                  News & Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Our Service */}
          <div>
            <h4 className="text-sm font-bold text-neutral-900 mb-4 tracking-wide">Our Service</h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>Tea Processing</li>
              <li>Tea Tasting</li>
              <li>Botanical Sourcing</li>
              <li>Global Shipping</li>
            </ul>
          </div>

          {/* Col 3: Help */}
          <div>
            <h4 className="text-sm font-bold text-neutral-900 mb-4 tracking-wide">Help</h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <Link href="/about" className="hover:text-orange-600 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-orange-600 transition-colors">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Subscription */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 tracking-wide">
              Subscribe to our newsletter
            </h4>

            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-transparent border-b border-neutral-400/80 py-2.5 pr-12 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-orange-600"
              />
              <button
                type="submit"
                className="absolute right-0 w-8 h-8 rounded-full btn-gradient flex items-center justify-center text-white shadow-sm"
                title="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {subscribed && (
              <p className="text-xs text-green-700 font-medium">Thank you for subscribing! 🍵</p>
            )}

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2 text-neutral-600">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-orange-600 transition-colors text-xs font-bold"
              >
                f
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-orange-600 transition-colors text-xs font-bold"
              >
                𝕏
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-orange-600 transition-colors text-xs font-bold"
              >
                📷
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-[#F7DDD6] text-center">
          <p className="text-[11px] text-neutral-500">
            &copy; {new Date().getFullYear()} Tea House. All rights reserved. Made with passion for authentic tea.
          </p>
        </div>
      </div>
    </footer>
  );
}
