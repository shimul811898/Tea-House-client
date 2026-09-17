'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star, Eye, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function FeaturedProducts({ products = [] }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAction = (product) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/');
      return;
    }
    addToCart(product);
  };

  // Fallback if backend hasn't loaded yet
  const displayProducts =
    products.length > 0
      ? products.slice(0, 4)
      : [
          {
            _id: '1',
            name: 'Milk Tea',
            description: 'Creamer could be replaced by fresh milk',
            price: 220,
            rating: 4.9,
            image: '/assests/tea-1.png',
            category: 'Milk Tea',
          },
          {
            _id: '2',
            name: 'Black Tea',
            description: 'Creamer could be replaced by fresh milk',
            price: 250,
            rating: 4.8,
            image: '/assests/tea-2.png',
            category: 'Black Tea',
          },
          {
            _id: '3',
            name: 'Lemon Tea',
            description: 'Creamer could be replaced by fresh milk',
            price: 240,
            rating: 4.7,
            image: '/assests/tea-3.png',
            category: 'Lemon Tea',
          },
          {
            _id: '4',
            name: 'Green Tea',
            description: 'Creamer could be replaced by fresh milk',
            price: 280,
            rating: 5.0,
            image: '/assests/tea-4.png',
            category: 'Green Tea',
          },
        ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Our Featured Products
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            There are many variations of passages of Lorem Ipsum available, but the majority have
            suffered alteration in some form, by injected humour, or randomised words which
            don&apos;t look even slightly believable.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayProducts.map((product) => (
            <div
              key={product._id}
              className="group relative bg-[#F4F4F4]/70 hover:bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 border border-transparent hover:border-orange-100"
            >
              {/* Product Image */}
              <div className="w-full h-56 relative flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={180}
                  height={220}
                  className="object-contain max-h-52 drop-shadow-md"
                />
              </div>

              {/* Product Name */}
              <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-orange-600 transition-colors">
                {product.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-neutral-500 mb-4 line-clamp-2 px-2">
                {product.description || 'Creamer could be replaced by fresh milk'}
              </p>

              {/* Price & Rating */}
              <div className="w-full pt-2 border-t border-neutral-200/60 flex items-center justify-between mt-auto">
                <div className="text-left">
                  <span className="text-xs text-neutral-400 block font-medium">Price</span>
                  <span className="text-lg font-extrabold text-neutral-900">
                    ৳{product.price}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating || 5.0}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-1">
                <Link
                  href={`/products/${product._id}`}
                  className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </Link>

                <button
                  onClick={() => handleAction(product)}
                  className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl btn-gradient text-xs font-semibold shadow-sm transition-transform active:scale-95"
                  title={isAuthenticated ? 'Add to Cart' : 'Login to Purchase'}
                >
                  {isAuthenticated ? (
                    <ShoppingBag className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  <span>{isAuthenticated ? 'Add Cart' : 'Buy'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 tracking-wide underline underline-offset-4 hover:underline-offset-8 transition-all"
          >
            Explore All Tea Varieties &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
