'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Check,
  Shield,
  Star,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading, authFetch } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'users'
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Products
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Green Tea',
    image: '/assests/tea-1.png',
    rating: 5.0,
    stock: 20,
    featured: false,
  });

  // Orders
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Users
  const [users, setUsers] = useState([]);

  // Toast / alert message
  const [message, setMessage] = useState('');

  const flashMsg = (txt) => {
    setMessage(txt);
    setTimeout(() => setMessage(''), 3500);
  };

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/login?redirect=/admin');
    }
  }, [authLoading, user, isAdmin, router]);

  // Load Admin Stats & Data
  const loadAdminData = async () => {
    try {
      setLoadingStats(true);
      const [statsRes, productsRes, ordersRes, usersRes] = await Promise.all([
        authFetch('/api/users/stats/admin'),
        authFetch('/api/products'),
        authFetch('/api/orders'),
        authFetch('/api/users'),
      ]);

      const statsData = await statsRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (productsData.success) setProducts(productsData.products);
      if (ordersData.success) setOrders(ordersData.orders);
      if (usersData.success) setUsers(usersData.users);
    } catch (e) {
      console.error('Failed to load admin resources', e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // Handle Product Create / Edit
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'Green Tea',
      image: '/assests/tea-1.png',
      rating: 5.0,
      stock: 20,
      featured: false,
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category: prod.category,
      image: prod.image,
      rating: prod.rating,
      stock: prod.stock,
      featured: prod.featured,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PATCH' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(productForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Operation failed');
      }

      flashMsg(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      setIsProductModalOpen(false);
      loadAdminData();
    } catch (err) {
      flashMsg(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this tea product?')) return;
    try {
      const res = await authFetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        flashMsg('Product deleted successfully');
        loadAdminData();
      }
    } catch (err) {
      flashMsg('Failed to delete product');
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (prod) => {
    try {
      await authFetch(`/api/products/${prod._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ featured: !prod.featured }),
      });
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Order Status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await authFetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        flashMsg(`Order updated to ${newStatus}`);
        loadAdminData();
      }
    } catch (err) {
      flashMsg('Failed to update status');
    }
  };

  // Handle User Role update
  const handleToggleUserRole = async (u) => {
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role of ${u.name} to ${nextRole}?`)) return;
    try {
      const res = await authFetch(`/api/users/${u._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: nextRole }),
      });
      const data = await res.json();
      if (data.success) {
        flashMsg(`User role changed to ${nextRole}`);
        loadAdminData();
      }
    } catch (err) {
      flashMsg('Failed to change user role');
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders =
    orderStatusFilter === 'All'
      ? orders
      : orders.filter((o) => o.status === orderStatusFilter);

  return (
    <div className="min-h-screen bg-neutral-50/70 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-orange-600" />
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                Tea House Administration
              </h1>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Manage inventory, live customer orders, revenue analytics, and users.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="p-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Navigation Tabs */}
            <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-bold">
              {['overview', 'products', 'orders', 'users'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Flash Message */}
        {message && (
          <div className="p-4 rounded-2xl bg-neutral-900 text-white text-xs font-semibold shadow-lg animate-in fade-in flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="text-neutral-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* 5 Stats Cards (Overview) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Total Products</span>
            <p className="text-xl font-black text-neutral-900">{stats.totalProducts}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Total Orders</span>
            <p className="text-xl font-black text-neutral-900">{stats.totalOrders}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Pending Orders</span>
            <p className="text-xl font-black text-neutral-900">{stats.pendingOrders}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Total Revenue</span>
            <p className="text-xl font-black text-neutral-900">৳{stats.totalRevenue}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs col-span-2 md:col-span-1">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Total Users</span>
            <p className="text-xl font-black text-neutral-900">{stats.totalUsers}</p>
          </div>
        </div>

        {/* TAB: Overview / Recent Orders */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="text-base font-bold text-neutral-900">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-orange-600 font-bold hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-neutral-400 py-6 text-center">No orders yet.</p>
              ) : (
                <div className="divide-y divide-neutral-100 text-xs">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o._id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-neutral-900">{o.customerName}</p>
                        <p className="text-[11px] text-neutral-400">
                          #{o._id.slice(-6).toUpperCase()} • {o.products?.length} items •{' '}
                          {new Date(o.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-neutral-900 block">৳{o.totalAmount}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 font-bold">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Quick Shortcuts
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('products');
                    openNewProductModal();
                  }}
                  className="w-full py-3 px-4 rounded-xl btn-gradient text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="w-full py-3 px-4 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-orange-600" />
                  <span>Process Pending Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="w-full py-3 px-4 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4 text-neutral-500" />
                  <span>Manage Users</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Products Management */}
        {activeTab === 'products' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter products..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-orange-500"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
              </div>

              <button
                onClick={openNewProductModal}
                className="px-5 py-2.5 rounded-xl btn-gradient text-xs font-bold shadow-xs flex items-center gap-1.5 w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-2">Item</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Price</th>
                    <th className="pb-3 px-2">Stock</th>
                    <th className="pb-3 px-2">Featured</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-neutral-50 p-1 flex items-center justify-center shrink-0 border border-neutral-100">
                            <Image
                              src={p.image}
                              alt={p.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 block">{p.name}</span>
                            <span className="text-[10px] text-neutral-400">★ {p.rating}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-neutral-600 font-medium">{p.category}</td>
                      <td className="py-3 px-2 font-bold text-neutral-900">৳{p.price}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`font-semibold ${
                            p.stock > 5 ? 'text-neutral-800' : 'text-red-500'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            p.featured
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          {p.featured ? '★ Featured' : 'Standard'}
                        </button>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-900">
                All Orders ({filteredOrders.length})
              </h2>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium">Filter Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 bg-white focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">Order ID</th>
                    <th className="pb-3 px-3">Customer</th>
                    <th className="pb-3 px-3">Delivery Address</th>
                    <th className="pb-3 px-3">Items</th>
                    <th className="pb-3 px-3">Total</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-4 px-3 font-mono font-bold text-neutral-900">
                        #{ord._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-4 px-3">
                        <span className="font-bold text-neutral-900 block">{ord.customerName}</span>
                        <span className="text-[11px] text-neutral-400">{ord.phone}</span>
                      </td>
                      <td className="py-4 px-3 max-w-[200px] truncate text-neutral-600">
                        {ord.address}, {ord.city}
                      </td>
                      <td className="py-4 px-3">
                        <span className="font-semibold text-neutral-800">
                          {ord.products?.length} items
                        </span>
                      </td>
                      <td className="py-4 px-3 font-black text-neutral-900">
                        ৳{ord.totalAmount}
                      </td>
                      <td className="py-4 px-3">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-neutral-200 text-xs font-bold text-neutral-800 bg-white focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Users Management */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 pb-4 border-b border-neutral-100">
              Registered Accounts ({users.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">User</th>
                    <th className="pb-3 px-3">Email</th>
                    <th className="pb-3 px-3">Role</th>
                    <th className="pb-3 px-3">Joined Date</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-3 font-bold text-neutral-900">{u.name}</td>
                      <td className="py-3 px-3 text-neutral-600">{u.email}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            u.role === 'admin'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleToggleUserRole(u)}
                          className="px-3 py-1.5 rounded-lg border border-neutral-200 text-[11px] font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                        >
                          Toggle Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Add / Edit Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="text-base font-bold text-neutral-900">
                  {editingProduct ? 'Edit Tea Product' : 'Add New Tea Product'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Royal Jasmine Tea"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="Green Tea">Green Tea</option>
                    <option value="Black Tea">Black Tea</option>
                    <option value="Milk Tea">Milk Tea</option>
                    <option value="Lemon Tea">Lemon Tea</option>
                    <option value="Herbal Tea">Herbal Tea</option>
                    <option value="Masala Tea">Masala Tea</option>
                    <option value="Premium Tea">Premium Tea</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Price (৳) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Stock Units *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Product Image *</label>
                  <select
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-orange-500 bg-white mb-2"
                  >
                    <option value="/assests/tea-1.png">Cup 1 (Milk Tea Style)</option>
                    <option value="/assests/tea-2.png">Cup 2 (Black Tea Style)</option>
                    <option value="/assests/tea-3.png">Cup 3 (Lemon Tea Style)</option>
                    <option value="/assests/tea-4.png">Cup 4 (Green Tea Style)</option>
                  </select>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="Or custom image URL..."
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-orange-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                    placeholder="Detailed botanical notes, infusion guidelines..."
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={productForm.featured}
                    onChange={(e) =>
                      setProductForm({ ...productForm, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded-sm text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="featuredCheckbox" className="font-bold text-neutral-800">
                    Mark as Featured on Home Page
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl btn-gradient text-white font-bold shadow-xs"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
