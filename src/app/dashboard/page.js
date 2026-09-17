'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  Clock,
  CheckCircle2,
  DollarSign,
  User,
  ShoppingBag,
  ExternalLink,
  Shield,
  Edit2,
  Save,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading, authFetch, updateProfile, isAdmin } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'listings' | 'profile'
  const [orders, setOrders] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Profile edit state
  const [profileName, setProfileName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileImage(user.image || '');

      // Fetch my orders
      authFetch('/api/orders/my')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrders(data.orders || []);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingOrders(false));

      // Fetch my tea listings (Sell Details)
      setLoadingListings(true);
      authFetch('/api/products/seller/my')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMyListings(data.products || []);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingListings(false));

      // Fetch my stats
      authFetch('/api/users/stats/my')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStats(data.stats);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMsg('');

    const res = await updateProfile({ name: profileName, image: profileImage });
    setUpdatingProfile(false);
    if (res.success) {
      setProfileMsg('Profile updated successfully! ✨');
      setTimeout(() => setProfileMsg(''), 4000);
    } else {
      setProfileMsg(res.message || 'Failed to update profile');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      Pending: 'bg-amber-100 text-amber-800 border-amber-200',
      Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      Processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return map[status] || 'bg-neutral-100 text-neutral-800';
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/60 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-orange-100 flex items-center justify-center font-black text-2xl text-orange-600 shrink-0 border-2 border-orange-200">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900">{user.name}</h1>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-extrabold uppercase tracking-wide">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">{user.email}</p>
            </div>
          </div>

            <Link
              href="/sell"
              className="px-4 py-2.5 rounded-xl btn-gradient text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Sell Tea</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sm hover:bg-orange-700 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}

            <div className="flex rounded-xl bg-neutral-100 p-1 border border-neutral-200">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'listings'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <span>My Listings</span>
                {myListings.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] flex items-center justify-center font-bold">
                    {myListings.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Profile
              </button>
            </div>
          </div>
        </div>

        {/* 4 Metrics / Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-neutral-400 block">
                Total Orders
              </span>
              <span className="text-xl sm:text-2xl font-black text-neutral-900">
                {stats.totalOrders}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-neutral-400 block">Pending</span>
              <span className="text-xl sm:text-2xl font-black text-neutral-900">
                {stats.pendingOrders}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-neutral-400 block">
                Completed
              </span>
              <span className="text-xl sm:text-2xl font-black text-neutral-900">
                {stats.completedOrders}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-neutral-400 block">
                Total Spent
              </span>
              <span className="text-xl sm:text-2xl font-black text-neutral-900">
                ৳{stats.totalSpent}
              </span>
            </div>
          </div>
        </div>

        {/* Tab 1: My Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-900">Recent Tea Orders</h2>
              <span className="text-xs text-neutral-500 font-medium">{orders.length} orders found</span>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center text-xs text-neutral-400">Loading your orders...</div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
                <p className="text-sm font-bold text-neutral-800">You have no previous orders.</p>
                <Link
                  href="/products"
                  className="px-5 py-2.5 rounded-xl btn-gradient text-xs font-semibold inline-block"
                >
                  Browse Tea Catalog
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 px-3">Order ID</th>
                      <th className="pb-3 px-3">Date</th>
                      <th className="pb-3 px-3">Items</th>
                      <th className="pb-3 px-3">Total Amount</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-4 px-3 font-mono font-bold text-neutral-800">
                          #{ord._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-4 px-3 text-neutral-500">
                          {new Date(ord.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-3">
                          <span className="font-semibold text-neutral-800">
                            {ord.products?.length} {ord.products?.length === 1 ? 'item' : 'items'}
                          </span>
                        </td>
                        <td className="py-4 px-3 font-extrabold text-neutral-900">
                          ৳{ord.totalAmount}
                        </td>
                        <td className="py-4 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(
                              ord.status
                            )}`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-100 hover:text-orange-600 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

        {/* Tab 2: My Tea Listings (Sell Details) */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">My Tea Listings</h2>
                <p className="text-xs text-neutral-500">
                  Tea products you have listed and saved with your verified seller profile.
                </p>
              </div>
              <Link
                href="/sell"
                className="px-4 py-2 rounded-xl btn-gradient text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit New Tea</span>
              </Link>
            </div>

            {loadingListings ? (
              <div className="py-12 text-center text-xs text-neutral-400">Loading your tea listings...</div>
            ) : myListings.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-800">No teas listed yet</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    Have an authentic tea blend to share? Submit your Sell Details and list it directly in our store!
                  </p>
                </div>
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl btn-gradient text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Selling Tea</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {myListings.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-orange-200 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-full h-32 rounded-xl bg-white flex items-center justify-center p-3 relative border border-neutral-100">
                        <Image
                          src={item.image || '/assests/tea-1.png'}
                          alt={item.name}
                          width={90}
                          height={90}
                          className="object-contain max-h-28"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-orange-600 text-white text-[9px] font-bold uppercase">
                          {item.category}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{item.description}</p>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-neutral-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-medium">Price</span>
                        <span className="text-base font-extrabold text-neutral-900">৳{item.price}</span>
                      </div>
                      <Link
                        href={`/products/${item._id}`}
                        className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-orange-600 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs max-w-2xl space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Update Profile Information
            </h2>

            {profileMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs">
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Email (Cannot be changed)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm bg-neutral-100 text-neutral-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="py-3 px-6 rounded-xl btn-gradient text-xs font-bold shadow-sm inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{updatingProfile ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Order #{selectedOrder._id.slice(-6).toUpperCase()}
                  </h3>
                  <span className="text-xs text-neutral-400">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-neutral-400">Items Ordered</span>
                <div className="divide-y divide-neutral-100">
                  {selectedOrder.products.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-50 p-1 flex items-center justify-center shrink-0 border border-neutral-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-900">{item.name}</p>
                          <p className="text-[11px] text-neutral-400">
                            ৳{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-neutral-900">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping Address:</span>
                  <span className="font-semibold text-neutral-800 text-right">
                    {selectedOrder.address}, {selectedOrder.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Phone:</span>
                  <span className="font-semibold text-neutral-800">{selectedOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payment:</span>
                  <span className="font-semibold text-neutral-800">
                    {selectedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-black">
                  <span>Grand Total:</span>
                  <span className="text-orange-600">৳{selectedOrder.totalAmount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  Status: {selectedOrder.status}
                </span>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
