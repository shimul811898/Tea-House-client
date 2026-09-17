import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NewsSection from '../../components/NewsSection';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'News & Events — Tea House Journal',
  description: 'Read the latest brewing guides, harvest announcements, and tasting workshops.',
};

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-hero-gradient py-14 lg:py-20 border-b border-orange-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">
            Stories & Tastings
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            News & Botanical Events
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto">
            Stay up to date with seasonal harvests, limited edition tea releases, and masterclass tasting workshops.
          </p>
        </div>
      </div>

      {/* Featured Lead Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-50 rounded-3xl p-6 sm:p-10 border border-neutral-200/80">
          <div className="lg:col-span-7 relative h-72 sm:h-96 rounded-2xl overflow-hidden">
            <Image
              src="/assests/news-1.png"
              alt="Spring Harvest Masterclass"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3 text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                Feb 05, 2027
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-orange-500" />
                Tea Master Lin
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 leading-snug">
              Collecting 8 points for discount on Spring First-Flush
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every year when the first mountain mists clear in early spring, the tenderest green tea
              tips are hand-picked within a 72-hour window. Join our seasonal loyalty rewards program
              to unlock exclusive early reservations.
            </p>

            <div className="pt-2">
              <Link
                href="/products"
                className="px-6 py-3 rounded-xl btn-gradient text-xs font-bold shadow-md inline-flex items-center gap-2"
              >
                <span>Reserve First Flush</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Articles Grid */}
      <NewsSection />
    </div>
  );
}
