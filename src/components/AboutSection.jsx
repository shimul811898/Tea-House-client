'use client';

import React from 'react';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: 2x2 Asymmetric Tiles */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 max-w-[480px] mx-auto lg:max-w-none">
              {/* Tile 1: Soft Pink Pastel */}
              <div className="h-44 sm:h-52 bg-[#FCECE8] rounded-2xl"></div>

              {/* Tile 2: Fresh 1 Yellow Tea Cup */}
              <div className="h-56 sm:h-64 bg-[#FFF8EE] rounded-2xl flex items-center justify-center p-4 -mt-8 relative shadow-sm">
                <Image
                  src="/assests/fresh-1.png"
                  alt="Fresh Presented Tea"
                  width={190}
                  height={240}
                  className="object-contain max-h-56 drop-shadow-md"
                />
              </div>

              {/* Tile 3: Fresh 2 Matcha Green Tea Cup */}
              <div className="h-56 sm:h-64 bg-[#EDF8F2] rounded-2xl flex items-center justify-center p-4 -mt-4 relative shadow-sm">
                <Image
                  src="/assests/fresh-2.png"
                  alt="Fresh Green Tea Cup"
                  width={190}
                  height={240}
                  className="object-contain max-h-56 drop-shadow-md"
                />
              </div>

              {/* Tile 4: Soft Grey Accent */}
              <div className="h-44 sm:h-52 bg-[#EFEFEF] rounded-2xl"></div>
            </div>
          </div>

          {/* Right: Text and Features */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.2]">
              Great Tea, Freshly <br className="hidden sm:inline" />
              Presented
            </h2>

            <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-xl">
              The meaning of gong fu cha is delicate tea ritual. Gongfu tea ceremony is a
              Chinese traditional tea brewing and drinking ceremony that emphasizes
              precision, mindfulness, and the enjoyment of the tea&apos;s subtle flavors. It
              originated during the Song dynasty and was further refined during the Ming and
              Qing dynasties.
            </p>

            <div className="pt-2 space-y-6">
              {/* Feature 1: Unique Taste */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-900">Unique Taste</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-lg">
                  A unique and different style from other tea types, with rich aroma and
                  delightful aftertaste.
                </p>
              </div>

              {/* Feature 2: Premium Quality */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-900">Premium Quality</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-lg">
                  Selected first grade hand-picked tea leaves deliver a pleasant taste every time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
