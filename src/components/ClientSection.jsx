'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ilham Yuda',
    role: 'Businessman',
    avatar: '/assests/client.png',
    text: 'I have been drinking tea for decades, and Tea House has completely transformed my morning ritual. Incredible freshness and depth of flavor.',
  },
  {
    id: 2,
    name: 'Eleanor Vance',
    role: 'Food & Beverage Critic',
    avatar: '/assests/client.png',
    text: 'The Gongfu tea selection is unparalleled. Each batch is aromatic, carefully preserved, and brews a vibrant golden infusion every single cup.',
  },
  {
    id: 3,
    name: 'Aiden Rahat',
    role: 'Software Architect',
    avatar: '/assests/client.png',
    text: 'Ordering from Tea House is seamless. The fast shipping and airtight packaging keep the loose leaves extraordinarily fragrant and crisp.',
  },
];

export default function ClientSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Gradient Box */}
        <div className="bg-super-clients rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle background circles for organic feel */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute left-1/3 -top-20 w-60 h-60 rounded-full bg-white/5 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                Meet Our Super <br className="hidden sm:inline" />
                Clients
              </h2>

              <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-lg">
                There are many variations of passages of Lorem Ipsum available, but the majority
                have suffered alteration in some form, by injected humour, or randomised words
                which don&apos;t look even slightly believable.
              </p>

              <div className="pt-2">
                <button
                  onClick={nextReview}
                  className="px-7 py-3 rounded-xl bg-white text-orange-600 font-bold text-sm shadow-md hover:bg-neutral-50 active:scale-95 transition-all"
                >
                  Show All
                </button>
              </div>
            </div>

            {/* Right Column: Stacked Testimonial Cards */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center py-6">
              {/* Background Faded Card 1 (Top) */}
              <div className="w-[90%] sm:w-[85%] bg-white/30 backdrop-blur-sm rounded-2xl p-5 text-transparent select-none scale-95 -mb-10 opacity-70 transform transition-all">
                <p className="text-xs">
                  We are very satisfied with their service and prompt tea delivery.
                </p>
                <div className="mt-2 text-xs font-semibold">Client Review</div>
              </div>

              {/* Active Foreground Card */}
              <div className="relative w-full max-w-[460px] bg-white text-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl z-20 transition-all duration-300">
                {/* Floating Avatar overlapping top-left */}
                <div className="absolute -top-7 left-6 sm:left-8 w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-lg bg-orange-100">
                  <Image
                    src={current.avatar}
                    alt={current.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Review Text */}
                <div className="pt-4 space-y-4">
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    {current.text}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{current.name}</h4>
                      <p className="text-xs text-neutral-400">{current.role}</p>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={prevReview}
                        className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-orange-600 hover:border-orange-500 transition-colors"
                        title="Previous review"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextReview}
                        className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-orange-600 hover:border-orange-500 transition-colors"
                        title="Next review"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Faded Card 2 (Bottom) */}
              <div className="w-[90%] sm:w-[85%] bg-white/30 backdrop-blur-sm rounded-2xl p-5 text-transparent select-none scale-95 -mt-8 opacity-70 transform transition-all">
                <p className="text-xs">
                  We are very satisfied with their service and prompt tea delivery.
                </p>
                <div className="mt-2 text-xs font-semibold">Client Review</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
