'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

const bookings = [
  { id: 'BK001', customer: 'John Smith', email: 'john@example.com', tour: 'Classic Uzbekistan', date: '2024-12-28', travelers: 2, amount: 2598, status: 'confirmed' },
  { id: 'BK002', customer: 'Maria Garcia', email: 'maria@example.com', tour: 'Silk Road Adventure', date: '2024-12-27', travelers: 4, amount: 9996, status: 'pending' },
  { id: 'BK003', customer: 'Hans Mueller', email: 'hans@example.de', tour: 'Samarkand Explorer', date: '2024-12-26', travelers: 2, amount: 1598, status: 'confirmed' },
  { id: 'BK004', customer: 'Elena Petrova', email: 'elena@example.ru', tour: 'Kazakhstan Nomad', date: '2024-12-25', travelers: 3, amount: 5697, status: 'confirmed' },
  { id: 'BK005', customer: 'James Wilson', email: 'james@example.com', tour: 'Classic Uzbekistan', date: '2024-12-24', travelers: 2, amount: 2598, status: 'cancelled' },
  { id: 'BK006', customer: 'Anna Schmidt', email: 'anna@example.de', tour: 'Pamir Highway', date: '2024-12-23', travelers: 1, amount: 1599, status: 'confirmed' },
  { id: 'BK007', customer: 'Michael Brown', email: 'michael@example.com', tour: 'Complete Central Asia', date: '2024-12-22', travelers: 2, amount: 7998, status: 'pending' },
  { id: 'BK008', customer: 'Sophie Martin', email: 'sophie@example.fr', tour: 'Uzbekistan Photo Tour', date: '2024-12-21', travelers: 1, amount: 1199, status: 'confirmed' },
];

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Bookings</h1>
          <p className="text-secondary-600">Manage customer bookings</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 w-fit">
          <Download size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-secondary-500 text-sm">Total Bookings</p>
          <p className="text-2xl font-bold text-secondary-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-secondary-500 text-sm flex items-center gap-1">
            <CheckCircle size={14} className="text-green-500" /> Confirmed
          </p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-secondary-500 text-sm flex items-center gap-1">
            <Clock size={14} className="text-yellow-500" /> Pending
          </p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-secondary-500 text-sm flex items-center gap-1">
            <XCircle size={14} className="text-red-500" /> Cancelled
          </p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <input
              type="text"
              placeholder="Search by customer or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Tour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Travelers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 font-medium text-primary-500">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-secondary-800">{booking.customer}</p>
                      <p className="text-sm text-secondary-500">{booking.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary-600">{booking.tour}</td>
                  <td className="px-6 py-4 text-secondary-600">{booking.date}</td>
                  <td className="px-6 py-4 text-secondary-600">{booking.travelers}</td>
                  <td className="px-6 py-4 font-medium text-secondary-800">€{booking.amount.toLocaleString()}</td>
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
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg">
                        <Eye size={18} />
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg">
                            <CheckCircle size={18} />
                          </button>
                          <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-secondary-100 flex items-center justify-between">
          <span className="text-sm text-secondary-500">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary-500 text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
