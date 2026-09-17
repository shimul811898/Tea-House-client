'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const newsArticles = [
  {
    id: 1,
    image: '/assests/news-1.png',
    date: 'Feb 05, 2027',
    title: 'Collecting 8 points for discount',
    description: 'There are many variations of passages of Lorem Ipsum available.',
    slug: 'collecting-points-discount',
  },
  {
    id: 2,
    image: '/assests/news-2.png',
    date: 'Feb 05, 2027',
    title: 'Collecting 8 points for discount',
    description: 'There are many variations of passages of Lorem Ipsum available.',
    slug: 'premium-harvest-ceremony',
  },
  {
    id: 3,
    image: '/assests/news-3.png',
    date: 'Feb 05, 2027',
    title: 'Collecting 8 points for discount',
    description: 'There are many variations of passages of Lorem Ipsum available.',
    slug: 'botanical-brewing-techniques',
  },
];

export default function NewsSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            News & Events
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            There are many variations of passages of Lorem Ipsum available, but the majority have
            suffered alteration in some form, by injected humour, or randomised words which
            don&apos;t look even slightly believable.
          </p>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <div
              key={article.id}
              className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col p-4 hover:border-orange-100"
            >
              {/* Image Container */}
              <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden mb-4 bg-neutral-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Date */}
              <span className="text-xs text-neutral-400 font-medium mb-2">{article.date}</span>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-2 group-hover:text-orange-600 transition-colors">
                {article.title}
              </h3>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
                {article.description}
              </p>

              {/* Read More Link */}
              <div className="mt-auto pt-2">
                <Link
                  href="/news"
                  className="text-xs font-bold text-neutral-900 hover:text-orange-600 transition-colors inline-block"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
