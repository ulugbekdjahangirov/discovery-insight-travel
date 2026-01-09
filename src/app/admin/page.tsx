'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Map,
  FileText,
  Loader2,
} from 'lucide-react';

interface Booking {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tour_date: string;
  total_price: number | null;
  status: string;
  created_at: string;
  tours: {
    id: number;
    title_en: string;
  } | null;
}

interface Tour {
  id: number;
  title_en: string;
  is_active: boolean;
}

export default function AdminDashboard() {
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    activeTours: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch bookings and tours in parallel
      const [bookingsRes, toursRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/tours'),
      ]);

      const bookingsData = await bookingsRes.json();
      const toursData = await toursRes.json();

      const bookings = Array.isArray(bookingsData) ? bookingsData : [];
      const toursList = Array.isArray(toursData) ? toursData : [];

      setRecentBookings(bookings.slice(0, 5));
      setTours(toursList);

      // Calculate stats
      const totalRevenue = bookings.reduce((sum: number, b: Booking) => sum + (b.total_price || 0), 0);
      const confirmedBookings = bookings.filter((b: Booking) => b.status === 'confirmed').length;
      const pendingBookings = bookings.filter((b: Booking) => b.status === 'pending').length;
      const activeTours = toursList.filter((t: Tour) => t.is_active !== false).length;

      setStats({
        totalBookings: bookings.length,
        confirmedBookings,
        pendingBookings,
        totalRevenue,
        activeTours,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  const statsCards = [
    {
      label: 'Jami Bronlar',
      value: stats.totalBookings.toString(),
      subtext: `${stats.pendingBookings} kutilmoqda`,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      label: 'Daromad',
      value: `€${stats.totalRevenue.toLocaleString()}`,
      subtext: 'Umumiy',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      label: 'Faol Turlar',
      value: stats.activeTours.toString(),
      subtext: `${tours.length} jami`,
      icon: Map,
      color: 'bg-purple-500',
    },
    {
      label: 'Tasdiqlangan',
      value: stats.confirmedBookings.toString(),
      subtext: 'Bronlar',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-800">Dashboard</h1>
        <p className="text-secondary-600">Xush kelibsiz! Turlaringiz holati.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-800">{stat.value}</h3>
            <p className="text-secondary-500">{stat.label}</p>
            <p className="text-xs text-secondary-400 mt-1">{stat.subtext}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-secondary-100">
            <h2 className="text-lg font-bold text-secondary-800">So'nggi Bronlar</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="animate-spin mx-auto text-primary-500" size={32} />
              <p className="mt-2 text-secondary-500">Yuklanmoqda...</p>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="p-8 text-center text-secondary-500">
              Bronlar topilmadi
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Mijoz</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Narx</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 text-sm font-medium text-primary-500">#{booking.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-secondary-800">
                            {booking.first_name} {booking.last_name}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {booking.tours?.title_en || 'Tur belgilanmagan'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-secondary-800">
                        {booking.total_price ? `€${booking.total_price.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status === 'pending' && 'Kutilmoqda'}
                          {booking.status === 'confirmed' && 'Tasdiqlangan'}
                          {booking.status === 'cancelled' && 'Bekor qilingan'}
                          {booking.status === 'completed' && 'Yakunlangan'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="p-4 border-t border-secondary-100">
            <Link href="/admin/bookings" className="text-primary-500 text-sm font-medium hover:text-primary-600">
              Barcha bronlarni ko'rish →
            </Link>
          </div>
        </div>

        {/* Popular Tours */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-secondary-100">
            <h2 className="text-lg font-bold text-secondary-800">Turlar</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="animate-spin mx-auto text-primary-500" size={32} />
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {tours.slice(0, 5).map((tour, idx) => (
                  <div key={tour.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-500 font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-secondary-800">{tour.title_en}</p>
                        <p className="text-sm text-secondary-500">
                          {tour.is_active !== false ? (
                            <span className="text-green-500">Faol</span>
                          ) : (
                            <span className="text-red-500">Nofaol</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="p-4 border-t border-secondary-100">
            <Link href="/admin/tours" className="text-primary-500 text-sm font-medium hover:text-primary-600">
              Turlarni boshqarish →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/tours/new"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Map className="text-primary-500" size={20} />
          </div>
          <span className="font-medium text-secondary-800">Yangi Tur</span>
        </Link>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="text-purple-500" size={20} />
          </div>
          <span className="font-medium text-secondary-800">Yangi Blog</span>
        </Link>
        <Link
          href="/admin/bookings"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Calendar className="text-green-500" size={20} />
          </div>
          <span className="font-medium text-secondary-800">Bronlar</span>
        </Link>
        <Link
          href="/admin/reviews"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Users className="text-orange-500" size={20} />
          </div>
          <span className="font-medium text-secondary-800">Sharhlar</span>
        </Link>
      </div>
    </div>
  );
}
