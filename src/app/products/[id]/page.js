'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Clock,
  Plus,
  Minus,
  Lock,
  User,
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

export default function ProductDetailPage({ params }) {
  const [productId, setProductId] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    Promise.resolve(params).then((p) => {
      setProductId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProduct(data.product);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Tea Not Found</h2>
        <p className="text-xs text-neutral-500">
          The tea product you are looking for does not exist or has been discontinued.
        </p>
        <Link href="/products" className="px-5 py-2.5 rounded-xl btn-gradient text-xs font-semibold">
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Strictly block purchase action if not logged in
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product._id}`);
      return;
    }
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product._id}`);
      return;
    }
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-white py-8 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb / Back button */}
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </Link>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Product Large Image Box */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-square bg-[#F8F8F8] rounded-3xl p-8 flex items-center justify-center border border-neutral-100 shadow-xs">
              <Image
                src={product.image || '/assests/tea-1.png'}
                alt={product.name}
                width={380}
                height={450}
                priority
                className="object-contain max-h-[400px] drop-shadow-xl select-none"
              />
              {product.featured && (
                <span className="absolute top-6 left-6 bg-orange-600 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                  Featured Master Blend
                </span>
              )}
            </div>
          </div>

          {/* Right: Product Attributes & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs uppercase tracking-widest font-extrabold text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-block">
                  {product.category}
                </span>
                {product.sellerName && (
                  <span className="text-[11px] text-neutral-500 font-medium bg-neutral-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <User className="w-3 h-3 text-neutral-400" />
                    Listed by: <strong className="text-neutral-700">{product.sellerName}</strong>
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-neutral-400 font-normal ml-1">(50+ verified reviews)</span>
                </div>

                <span className="text-neutral-300">|</span>

                <div className="text-xs font-semibold">
                  {product.stock > 0 ? (
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="pt-2">
              <span className="text-xs text-neutral-400 block font-medium">Price per pack</span>
              <span className="text-3xl sm:text-4xl font-black text-neutral-900">
                ৳{product.price}
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-b border-neutral-100 py-4">
              <h3 className="text-xs uppercase font-bold text-neutral-400 mb-2 tracking-wider">
                About this tea
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 block">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-neutral-700 hover:text-orange-600 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    disabled={quantity >= (product.stock || 10)}
                    className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-neutral-700 hover:text-orange-600 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-xs text-neutral-400">
                  Total: <strong className="text-neutral-900">৳{product.price * quantity}</strong>
                </span>
              </div>
            </div>

            {/* Login Notice for Unauthenticated Users */}
            {!isAuthenticated && (
              <div className="bg-orange-50/80 border border-orange-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-orange-900">
                  <Lock className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>
                    You must be <strong>logged in</strong> to purchase this product.
                  </span>
                </div>
                <Link
                  href={`/login?redirect=/products/${product._id}`}
                  className="px-4 py-2 rounded-xl btn-gradient text-xs font-bold text-center shrink-0 shadow-xs"
                >
                  Log In to Purchase
                </Link>
              </div>
            )}

            {/* CTA Buttons: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="py-3.5 px-6 rounded-xl border-2 border-orange-500 text-orange-600 font-bold text-sm hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="py-3.5 px-6 rounded-xl btn-gradient font-bold text-sm shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {!isAuthenticated && <Lock className="w-4 h-4" />}
                <span>{isAuthenticated ? 'Buy Now' : 'Sign In to Buy'}</span>
              </button>
            </div>

            {/* Quality & Shipping Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-100 text-neutral-600">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-neutral-50">
                <Truck className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-[11px] font-bold text-neutral-800">Fast Delivery</span>
                <span className="text-[10px] text-neutral-400">Across Bangladesh</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-neutral-50">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="text-[11px] font-bold text-neutral-800">100% Organic</span>
                <span className="text-[10px] text-neutral-400">Pesticide Free</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-neutral-50">
                <Clock className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-[11px] font-bold text-neutral-800">Freshly Packed</span>
                <span className="text-[10px] text-neutral-400">Peak Harvest Aroma</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
