'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Eye, CheckCircle, XCircle, Clock, Trash2, X, Calendar, Users, MapPin, DollarSign, Mail, Phone, Globe } from 'lucide-react';

interface Booking {
  id: number;
  tour_id: number | null;
  tour_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  pickup_location: string;
  tour_date: string;
  start_time: string;
  end_date: string;
  tour_type: string;
  adults: number;
  children: number;
  total_price: number | null;
  currency: string;
  special_requests: string;
  how_did_you_hear: string;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  tours: {
    id: number;
    slug: string;
    title_en: string;
    title_ru: string;
    title_de: string;
  } | null;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      const response = await fetch(`/api/bookings?${params.toString()}`);
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchBookings();
        if (selectedBooking?.id === id) {
          setSelectedBooking({ ...selectedBooking, status });
        }
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Haqiqatan ham bu bronni o\'chirmoqchimisiz?')) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchBookings();
        setShowModal(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const fullName = `${booking.first_name} ${booking.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toString().includes(searchQuery);
    return matchesSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'unpaid':
        return 'bg-orange-100 text-orange-700';
      case 'refunded':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Bronlar</h1>
          <p className="text-secondary-600">Mijozlar bronlarini boshqaring</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 w-fit">
          <Download size={20} />
          <span>CSV Export</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-secondary-500 text-sm">Jami Bronlar</p>
          <p className="text-2xl font-bold text-secondary-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-secondary-500 text-sm flex items-center gap-1">
            <CheckCircle size={14} className="text-green-500" /> Tasdiqlangan
          </p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-secondary-500 text-sm flex items-center gap-1">
            <Clock size={14} className="text-yellow-500" /> Kutilmoqda
          </p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-secondary-500 text-sm flex items-center gap-1">
            <XCircle size={14} className="text-red-500" /> Bekor qilingan
          </p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-secondary-500 text-sm flex items-center gap-1">
            <CheckCircle size={14} className="text-blue-500" /> Yakunlangan
          </p>
          <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <input
              type="text"
              placeholder="Mijoz ismi yoki email bo'yicha qidirish..."
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
            <option value="all">Barcha Status</option>
            <option value="pending">Kutilmoqda</option>
            <option value="confirmed">Tasdiqlangan</option>
            <option value="cancelled">Bekor qilingan</option>
            <option value="completed">Yakunlangan</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-2 text-secondary-500">Yuklanmoqda...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Tur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Sana / Vaqt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Sayohatchilar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Narx</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 font-medium text-primary-500">#{booking.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-secondary-800">
                          {booking.first_name} {booking.last_name}
                        </p>
                        <p className="text-sm text-secondary-500">{booking.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary-600">
                      {booking.tours?.title_en || 'Belgilanmagan'}
                    </td>
                    <td className="px-6 py-4 text-secondary-600">
                      {formatDate(booking.tour_date)}
                      {booking.start_time && <span className="text-primary-500 ml-1">{booking.start_time}</span>}
                    </td>
                    <td className="px-6 py-4 text-secondary-600">
                      {booking.adults} katta{booking.children > 0 ? `, ${booking.children} bola` : ''}
                    </td>
                    <td className="px-6 py-4 font-medium text-secondary-800">
                      {booking.total_price ? `$${booking.total_price.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status === 'pending' && 'Kutilmoqda'}
                        {booking.status === 'confirmed' && 'Tasdiqlangan'}
                        {booking.status === 'cancelled' && 'Bekor qilingan'}
                        {booking.status === 'completed' && 'Yakunlangan'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowModal(true);
                          }}
                          className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg"
                          title="Ko'rish"
                        >
                          <Eye size={18} />
                        </button>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                              title="Tasdiqlash"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              title="Bekor qilish"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="O'chirish"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-secondary-100 flex items-center justify-between">
          <span className="text-sm text-secondary-500">
            {filteredBookings.length} ta brondan {filteredBookings.length} tasi ko'rsatilmoqda
          </span>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-secondary-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-secondary-800">
                Bron #{selectedBooking.id}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedBooking(null);
                }}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status === 'pending' && 'Kutilmoqda'}
                  {selectedBooking.status === 'confirmed' && 'Tasdiqlangan'}
                  {selectedBooking.status === 'cancelled' && 'Bekor qilingan'}
                  {selectedBooking.status === 'completed' && 'Yakunlangan'}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPaymentStatusColor(selectedBooking.payment_status)}`}>
                  {selectedBooking.payment_status === 'paid' && 'To\'langan'}
                  {selectedBooking.payment_status === 'unpaid' && 'To\'lanmagan'}
                  {selectedBooking.payment_status === 'refunded' && 'Qaytarilgan'}
                </span>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-secondary-100 text-secondary-700">
                  {selectedBooking.tour_type === 'private' ? 'Shaxsiy' : 'Guruh'}
                </span>
              </div>

              {/* Customer Info */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="font-semibold text-secondary-800 mb-3">Mijoz ma'lumotlari</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-secondary-400" />
                    <span>{selectedBooking.first_name} {selectedBooking.last_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-secondary-400" />
                    <span>{selectedBooking.email}</span>
                  </div>
                  {selectedBooking.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-secondary-400" />
                      <span>{selectedBooking.phone}</span>
                    </div>
                  )}
                  {selectedBooking.country && (
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-secondary-400" />
                      <span>{selectedBooking.country}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tour Info */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="font-semibold text-secondary-800 mb-3">Tur ma'lumotlari</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-secondary-400" />
                    <span>{selectedBooking.tours?.title_en || 'Belgilanmagan'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-secondary-400" />
                    <span>
                      {formatDate(selectedBooking.tour_date)}
                      {selectedBooking.start_time && <span className="text-primary-500 ml-1">{selectedBooking.start_time}</span>}
                      {selectedBooking.end_date && <span className="text-secondary-400 ml-2">- {formatDate(selectedBooking.end_date)}</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-secondary-400" />
                    <span>{selectedBooking.adults} katta, {selectedBooking.children} bola</span>
                  </div>
                  {selectedBooking.total_price && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-secondary-400" />
                      <span className="font-semibold">${selectedBooking.total_price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                {selectedBooking.pickup_location && (
                  <div className="mt-3 pt-3 border-t border-secondary-200">
                    <p className="text-sm text-secondary-500 mb-1">Olib ketish joyi:</p>
                    <p className="text-secondary-700">{selectedBooking.pickup_location}</p>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              {selectedBooking.special_requests && (
                <div className="bg-secondary-50 rounded-lg p-4">
                  <h3 className="font-semibold text-secondary-800 mb-2">Maxsus so'rovlar</h3>
                  <p className="text-secondary-600">{selectedBooking.special_requests}</p>
                </div>
              )}

              {/* Dates */}
              <div className="text-sm text-secondary-500">
                <p>Yaratilgan: {formatDate(selectedBooking.created_at)}</p>
                <p>Yangilangan: {formatDate(selectedBooking.updated_at)}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-secondary-100">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                      className="btn-primary flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Tasdiqlash
                    </button>
                    <button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                      <XCircle size={18} />
                      Bekor qilish
                    </button>
                  </>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                    className="btn-primary flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Yakunlash
                  </button>
                )}
                <button
                  onClick={() => deleteBooking(selectedBooking.id)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
