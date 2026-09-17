'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, ShoppingBag, Eye, SlidersHorizontal, RefreshCw, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const categories = [
  'All',
  'Green Tea',
  'Black Tea',
  'Milk Tea',
  'Lemon Tea',
  'Herbal Tea',
  'Masala Tea',
  'Premium Tea',
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleProductAction = (product) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products`);
      return;
    }
    addToCart(product);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (search) {
        params.append('search', search);
      }
      if (sort) {
        params.append('sort', sort);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-orange-600 font-bold">
            Curated Botanical Harvests
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Explore All Tea Varieties
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Hand-picked leaves from pristine mountain terraces, sealed fresh for unmatched aroma.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-neutral-200/70 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by tea name or notes (e.g. matcha, lemon, jasmine)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            </form>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-neutral-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full md:w-auto px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 bg-white focus:outline-none focus:border-orange-500"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-xs text-neutral-500 font-medium">Brewing freshly harvested teas...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto space-y-3 border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto text-orange-600">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">No tea products found</h3>
            <p className="text-xs text-neutral-500">
              Try adjusting your search query or selecting a different category filter.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl btn-gradient text-xs font-semibold mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-2xl p-5 border border-neutral-200/70 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="w-full h-52 relative flex items-center justify-center p-3 rounded-xl bg-neutral-50 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={product.image || '/assests/tea-1.png'}
                    alt={product.name}
                    width={160}
                    height={190}
                    className="object-contain max-h-48 drop-shadow-md"
                  />
                  {product.featured && (
                    <span className="absolute top-2.5 left-2.5 bg-orange-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs">
                      Featured
                    </span>
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Only {product.stock} left
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Out of stock
                    </span>
                  )}
                </div>

                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 font-semibold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-base font-bold text-neutral-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-1">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Price & Actions */}
                <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-neutral-400 block font-medium">Price</span>
                    <span className="text-lg font-extrabold text-neutral-900">
                      ৳{product.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleProductAction(product)}
                      disabled={product.stock === 0}
                      className="px-3 py-2 rounded-xl btn-gradient text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isAuthenticated ? 'Add to Cart' : 'Login to Purchase'}
                    >
                      {isAuthenticated ? (
                        <ShoppingBag className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}
                      <span>{isAuthenticated ? 'Add' : 'Buy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
