'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  DollarSign,
  Package,
  Plus,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  Upload,
} from 'lucide-react';

const CATEGORIES = [
  'Green Tea',
  'Black Tea',
  'Milk Tea',
  'Lemon Tea',
  'Herbal Tea',
  'Masala Tea',
  'Premium Tea',
];

const PRESET_IMAGES = [
  { name: 'Artisanal Green Tea', url: '/assests/tea-1.png' },
  { name: 'Robust Black Tea', url: '/assests/tea-2.png' },
  { name: 'Fresh Lemon Blend', url: '/assests/tea-3.png' },
  { name: 'Organic Herbal Infusion', url: '/assests/tea-4.png' },
];

export default function SellTeaPage() {
  const { user, isAuthenticated, loading: authLoading, authFetch } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Green Tea',
    price: '',
    stock: '15',
    description: '',
    image: '/assests/tea-1.png',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successProduct, setSuccessProduct] = useState(null);

  // Requirement: sell details cannot be saved/submitted without login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/sell');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Extra safeguard: redirect immediately if not authenticated
    if (!isAuthenticated) {
      router.push('/login?redirect=/sell');
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter a tea name.');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please provide a valid price greater than 0.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please write a brief description for your tea blend.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await authFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock) || 10,
          description: formData.description.trim(),
          image: formData.image,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit sell details.');
      }

      setSuccessProduct(data.product);
    } catch (err) {
      setError(err.message || 'An error occurred while listing your tea.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If unauthenticated, show protected action banner
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-neutral-50/50">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 text-center space-y-6 shadow-xl shadow-orange-500/5">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto text-orange-600">
            <Lock className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-neutral-900">Authentication Required</h2>
            <p className="text-xs text-neutral-500 mt-2">
              You must be signed in to submit and save Sell Details. Please log in or create an account to list your artisanal teas.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href="/login?redirect=/sell"
              className="w-full py-3.5 rounded-xl btn-gradient text-xs font-bold shadow-md flex items-center justify-center gap-2"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="w-full py-3 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 block transition-colors"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (successProduct) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-neutral-50/60">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl shadow-orange-500/5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold text-orange-600 tracking-wider">
              Listing Published
            </span>
            <h1 className="text-2xl font-black text-neutral-900 mt-1">Sell Details Saved!</h1>
            <p className="text-xs text-neutral-500 mt-2">
              Your tea product is now live in the store and associated with your account ({user?.email}).
            </p>
          </div>

          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Tea Name:</span>
              <span className="font-bold text-neutral-900">{successProduct.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Category:</span>
              <span className="font-semibold text-neutral-900">{successProduct.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Listed Price:</span>
              <span className="font-extrabold text-orange-600">৳{successProduct.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Seller:</span>
              <span className="font-semibold text-neutral-800">{user?.name}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href={`/products/${successProduct._id}`}
              className="w-full py-3.5 rounded-xl btn-gradient text-xs font-bold shadow-md block text-center"
            >
              View Public Product Page
            </Link>
            <button
              onClick={() => {
                setSuccessProduct(null);
                setFormData({
                  name: '',
                  category: 'Green Tea',
                  price: '',
                  stock: '15',
                  description: '',
                  image: '/assests/tea-1.png',
                });
              }}
              className="w-full py-3 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              List Another Tea
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-block mb-2">
            Artisan Marketplace
          </span>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            Submit Sell Details
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            List your authentic tea blend directly in the Tea House catalog. Linked to your account:{' '}
            <strong className="text-neutral-800">{user?.email}</strong>
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sell Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6"
        >
          {/* Tea Name */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5">
              Tea Blend Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sreemangal Organic Green Pearl"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                Price (BDT / ৳) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">
                  ৳
                </span>
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="280"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Initial Stock */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5">
              Available Stock (Packs) *
            </label>
            <input
              type="number"
              name="stock"
              required
              min="1"
              value={formData.stock}
              onChange={handleChange}
              placeholder="15"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Select or Enter Image */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-700 block">
              Choose Product Image
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, image: img.url }))}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                    formData.image === img.url
                      ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                      : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                  }`}
                >
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <Image
                      src={img.url}
                      alt={img.name}
                      width={56}
                      height={56}
                      className="object-contain max-h-14"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-700 line-clamp-1">
                    {img.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-neutral-400 block mb-1">Or custom image URL:</span>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5">
              Blend Description & Tasting Notes *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the aroma, harvest origin, flavor notes and brewing recommendations..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {/* Authenticated Seller Association Note */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3 text-xs text-neutral-600">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>
              This listing will be associated with your verified seller profile:{' '}
              <strong>{user?.name}</strong> ({user?.email}).
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl btn-gradient font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Save & Publish Sell Details</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
