import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AboutSection from '../../components/AboutSection';
import ClientSection from '../../components/ClientSection';
import { Leaf, Award, HeartHandshake, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'About Us — The Tea House Tradition',
  description: 'Learn about our passion for pure single-origin artisanal tea leaves and botanical infusions.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-hero-gradient py-16 lg:py-24 border-b border-orange-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">
            Our Story & Philosophy
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            Crafting Extraordinary Tea Moments Since 1998
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            From misty Himalayan valleys to pristine organic estates across Asia, we curate the
            world&apos;s most fragrant leaves directly from master cultivators.
          </p>
        </div>
      </div>

      {/* Core About Presentation */}
      <AboutSection />

      {/* Values Grid */}
      <div className="py-16 lg:py-24 bg-neutral-50/70 border-t border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase text-orange-600 tracking-wider">
              Uncompromising Standards
            </span>
            <h2 className="text-3xl font-extrabold text-neutral-900">Why Tea Lovers Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Single-Origin Leaves</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Never blended with artificial fillers or synthetic flavorings. Pure, unadulterated botanical character.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Artisan Hand-Picking</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Only the top two leaves and an unopened bud are selected during early morning first flushes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Fair Trade Direct</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                We work directly with multigenerational estate growers, ensuring ethical wages and environmental regeneration.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Nitrogen Sealed</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Double airtight nitrogen packaging preserves volatile essential oils and fresh aromas for months.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Super Clients */}
      <ClientSection />
    </div>
  );
}
