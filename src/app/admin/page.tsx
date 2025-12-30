'use client';

import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Map,
  FileText,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Bookings',
    value: '1,284',
    change: '+12.5%',
    trend: 'up',
    icon: Calendar,
    color: 'bg-blue-500',
  },
  {
    label: 'Revenue',
    value: '€89,420',
    change: '+8.2%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    label: 'Active Tours',
    value: '24',
    change: '+2',
    trend: 'up',
    icon: Map,
    color: 'bg-purple-500',
  },
  {
    label: 'Total Users',
    value: '3,847',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'bg-orange-500',
  },
];

const recentBookings = [
  { id: 'BK001', customer: 'John Smith', tour: 'Classic Uzbekistan', date: '2024-12-28', amount: '€1,299', status: 'confirmed' },
  { id: 'BK002', customer: 'Maria Garcia', tour: 'Silk Road Adventure', date: '2024-12-27', amount: '€2,499', status: 'pending' },
  { id: 'BK003', customer: 'Hans Mueller', tour: 'Samarkand Explorer', date: '2024-12-26', amount: '€799', status: 'confirmed' },
  { id: 'BK004', customer: 'Elena Petrova', tour: 'Kazakhstan Nomad', date: '2024-12-25', amount: '€1,899', status: 'confirmed' },
  { id: 'BK005', customer: 'James Wilson', tour: 'Classic Uzbekistan', date: '2024-12-24', amount: '€2,598', status: 'cancelled' },
];

const popularTours = [
  { name: 'Classic Uzbekistan Tour', bookings: 156, revenue: '€202,644' },
  { name: 'Silk Road Adventure', bookings: 89, revenue: '€222,411' },
  { name: 'Samarkand & Bukhara', bookings: 124, revenue: '€99,076' },
  { name: 'Kazakhstan Nomad', bookings: 67, revenue: '€127,233' },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-800">Dashboard</h1>
        <p className="text-secondary-600">Welcome back! Here's what's happening with your tours.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span
                className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-800">{stat.value}</h3>
            <p className="text-secondary-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-secondary-100">
            <h2 className="text-lg font-bold text-secondary-800">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 text-sm font-medium text-secondary-800">{booking.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-secondary-800">{booking.customer}</p>
                        <p className="text-xs text-secondary-500">{booking.tour}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-800">{booking.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-secondary-100">
            <a href="/admin/bookings" className="text-primary-500 text-sm font-medium hover:text-primary-600">
              View all bookings →
            </a>
          </div>
        </div>

        {/* Popular Tours */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-secondary-100">
            <h2 className="text-lg font-bold text-secondary-800">Popular Tours</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {popularTours.map((tour, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-500 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-secondary-800">{tour.name}</p>
                      <p className="text-sm text-secondary-500">{tour.bookings} bookings</p>
                    </div>
                  </div>
                  <span className="font-semibold text-secondary-800">{tour.revenue}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-secondary-100">
            <a href="/admin/tours" className="text-primary-500 text-sm font-medium hover:text-primary-600">
              Manage tours →
            </a>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="/admin/tours/new"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Map className="text-primary-500" size={20} />
          </div>
          <span className="font-medium text-secondary-800">Add New Tour</span>
        </a>
        <a
          href="/admin/blog/new"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="text-purple-500" size={20} />
          </div>
          <span className="font-medium text-secondary-800">Write Blog Post</span>
        </a>
        <a
          href="/admin/bookings"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Calendar className="text-green-500" size={20} />
          </div>
          <span className="font-medium text-secondary-800">View Bookings</span>
        </a>
        <a
          href="/admin/users"
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Users className="text-orange-500" size={20} />
          </div>
          <span className="font-medium text-secondary-800">Manage Users</span>
        </a>
      </div>
    </div>
  );
}
