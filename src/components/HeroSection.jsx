'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient pt-8 pb-16 lg:pt-14 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8 z-10 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
              It&apos;s good <br />
              tea time at The <br />
              <span className="text-neutral-900">Tea House</span>
            </h1>

            <p className="text-neutral-500 text-sm sm:text-base max-w-md leading-relaxed">
              Tea and Botanical Solutions Supplier Give Optimum Satisfaction To Your Taste Buds.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl btn-gradient font-medium text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all"
              >
                <span>Explore More</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Right Visual (Dual Cups + Floating Rating Card) */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] lg:max-w-[560px]">
              {/* Main Banner Image */}
              <div className="relative w-full aspect-[4/3] sm:aspect-square flex items-center justify-center">
                <Image
                  src="/assests/banner.png"
                  alt="Tea House Premium Teas"
                  width={560}
                  height={520}
                  priority
                  className="object-contain drop-shadow-2xl select-none"
                />
              </div>

              {/* Floating Trustpilot Rating Card */}
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-5 py-3.5 flex items-center gap-3 border border-orange-50/80 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-extrabold text-neutral-900 leading-none">
                      5.00
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-medium">Trustpilot Ratings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
