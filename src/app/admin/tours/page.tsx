'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';

const tours = [
  { id: 1, name: 'Classic Uzbekistan Tour', destination: 'Uzbekistan', duration: 8, price: 1299, status: 'active', bookings: 156 },
  { id: 2, name: 'Silk Road Adventure', destination: 'Central Asia', duration: 14, price: 2499, status: 'active', bookings: 89 },
  { id: 3, name: 'Samarkand & Bukhara Explorer', destination: 'Uzbekistan', duration: 5, price: 799, status: 'active', bookings: 124 },
  { id: 4, name: 'Kazakhstan Nomad Experience', destination: 'Kazakhstan', duration: 10, price: 1899, status: 'active', bookings: 67 },
  { id: 5, name: 'Kyrgyzstan Mountain Trek', destination: 'Kyrgyzstan', duration: 12, price: 1699, status: 'draft', bookings: 0 },
  { id: 6, name: 'Pamir Highway Journey', destination: 'Tajikistan', duration: 9, price: 1599, status: 'active', bookings: 38 },
  { id: 7, name: 'Uzbekistan Photo Tour', destination: 'Uzbekistan', duration: 7, price: 1199, status: 'inactive', bookings: 52 },
  { id: 8, name: 'Complete Central Asia', destination: 'Central Asia', duration: 21, price: 3999, status: 'active', bookings: 29 },
];

export default function AdminToursPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tour.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Tours</h1>
          <p className="text-secondary-600">Manage your tour packages</p>
        </div>
        <Link
          href="/admin/tours/new"
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          <span>Add New Tour</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <input
              type="text"
              placeholder="Search tours..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Tour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredTours.map((tour) => (
                <tr key={tour.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-secondary-800">{tour.name}</span>
                  </td>
                  <td className="px-6 py-4 text-secondary-600">{tour.destination}</td>
                  <td className="px-6 py-4 text-secondary-600">{tour.duration} days</td>
                  <td className="px-6 py-4 text-secondary-800 font-medium">€{tour.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-secondary-600">{tour.bookings}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tour.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : tour.status === 'inactive'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {tour.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
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
            Showing {filteredTours.length} of {tours.length} tours
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary-500 text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50">
              2
            </button>
            <button className="px-3 py-1 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
