'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Check,
  X,
  Loader2,
  Save,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
} from 'lucide-react';

interface Tour {
  id: number;
  slug: string;
  title_en: string;
}

interface Review {
  id: number;
  tour_id: number | null;
  author_name: string;
  author_email: string;
  author_country: string;
  author_avatar: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  source: 'website' | 'gyg' | 'tripadvisor' | 'google';
  created_at: string;
  tours?: Tour;
}

const platformColors = {
  website: { bg: 'bg-primary-100', text: 'text-primary-700', label: 'Discovery Insight' },
  gyg: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'GetYourGuide' },
  tripadvisor: { bg: 'bg-green-100', text: 'text-green-700', label: 'TripAdvisor' },
  google: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Google' },
};

const defaultReview: Partial<Review> = {
  tour_id: null,
  author_name: '',
  author_email: '',
  author_country: '',
  author_avatar: '',
  rating: 5,
  title: '',
  comment: '',
  status: 'approved',
  source: 'website',
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchReviews();
    fetchTours();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Sharhlarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTours = async () => {
    try {
      const response = await fetch('/api/tours?status=active');
      if (response.ok) {
        const data = await response.json();
        setTours(data);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const openModal = (review?: Review, source?: 'website' | 'gyg' | 'tripadvisor' | 'google') => {
    if (review) {
      setEditingReview(review);
    } else {
      setEditingReview({ ...defaultReview, source: source || 'website' });
    }
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
    setError('');
  };

  const handleSave = async () => {
    if (!editingReview) return;

    if (!editingReview.author_name || !editingReview.comment) {
      setError('Ism va sharh kiritilishi shart');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const isNew = !editingReview.id;
      const url = isNew ? '/api/reviews' : `/api/reviews/${editingReview.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingReview),
      });

      if (response.ok) {
        await fetchReviews();
        closeModal();
      } else {
        const data = await response.json();
        setError(data.error || 'Saqlashda xatolik');
      }
    } catch (error) {
      setError('Saqlashda xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu sharhni o\'chirishni xohlaysizmi?')) return;

    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchReviews();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'all') return true;
    return review.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle size={14} />
            Tasdiqlangan
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <XCircle size={14} />
            Rad etilgan
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Clock size={14} />
            Kutilmoqda
          </span>
        );
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-secondary-300'}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Sharhlar</h1>
          <p className="text-secondary-500 mt-1">Mijozlar sharhlarini boshqaring</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Yangi Sharh
          </button>
          <button
            onClick={() => openModal(undefined, 'gyg')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} />
            GYG
          </button>
          <button
            onClick={() => openModal(undefined, 'tripadvisor')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={18} />
            TripAdvisor
          </button>
          <button
            onClick={() => openModal(undefined, 'google')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} />
            Google
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'Barchasi', count: reviews.length },
          { key: 'pending', label: 'Kutilmoqda', count: reviews.filter(r => r.status === 'pending').length },
          { key: 'approved', label: 'Tasdiqlangan', count: reviews.filter(r => r.status === 'approved').length },
          { key: 'rejected', label: 'Rad etilgan', count: reviews.filter(r => r.status === 'rejected').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === tab.key
                ? 'bg-primary-500 text-white'
                : 'bg-white text-secondary-600 hover:bg-secondary-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-secondary-500">
            Hali sharh yo'q
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                    {review.author_avatar ? (
                      <img src={review.author_avatar} alt={review.author_name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      review.author_name.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold text-secondary-800">{review.author_name}</h3>
                      {review.author_country && (
                        <span className="flex items-center gap-1 text-sm text-secondary-500">
                          <MapPin size={14} />
                          {review.author_country}
                        </span>
                      )}
                      {review.source && platformColors[review.source] && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${platformColors[review.source].bg} ${platformColors[review.source].text}`}>
                          {platformColors[review.source].label}
                        </span>
                      )}
                      {getStatusBadge(review.status)}
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      {review.tours && (
                        <span className="text-sm text-secondary-500">
                          • {review.tours.title_en}
                        </span>
                      )}
                    </div>

                    {review.title && (
                      <h4 className="font-medium text-secondary-700 mb-1">{review.title}</h4>
                    )}
                    <p className="text-secondary-600">{review.comment}</p>

                    <p className="text-sm text-secondary-400 mt-2">
                      {new Date(review.created_at).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(review.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Tasdiqlash"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => updateStatus(review.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Rad etish"
                      >
                        <X size={18} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => openModal(review)}
                    className="p-2 text-secondary-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 text-secondary-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && editingReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-secondary-800">
                  {editingReview.id ? 'Sharhni Tahrirlash' : 'Yangi Sharh'}
                </h2>
                {editingReview.source && platformColors[editingReview.source] && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${platformColors[editingReview.source].bg} ${platformColors[editingReview.source].text}`}>
                    {platformColors[editingReview.source].label}
                  </span>
                )}
              </div>
              <button onClick={closeModal} className="text-secondary-400 hover:text-secondary-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              {/* Author Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Ism *
                  </label>
                  <input
                    type="text"
                    value={editingReview.author_name || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, author_name: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingReview.author_email || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, author_email: e.target.value })}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Mamlakat
                  </label>
                  <input
                    type="text"
                    value={editingReview.author_country || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, author_country: e.target.value })}
                    className="input-field"
                    placeholder="USA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Tur
                  </label>
                  <select
                    value={editingReview.tour_id || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, tour_id: e.target.value ? parseInt(e.target.value) : null })}
                    className="input-field"
                  >
                    <option value="">Turni tanlang (ixtiyoriy)</option>
                    {tours.map((tour) => (
                      <option key={tour.id} value={tour.id}>{tour.title_en}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Reyting *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditingReview({ ...editingReview, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={32}
                        className={star <= (editingReview.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-secondary-300'}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-secondary-600">{editingReview.rating}/5</span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Sarlavha
                </label>
                <input
                  type="text"
                  value={editingReview.title || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, title: e.target.value })}
                  className="input-field"
                  placeholder="Amazing experience!"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Sharh *
                </label>
                <textarea
                  value={editingReview.comment || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  className="input-field min-h-[120px]"
                  placeholder="Write review here..."
                />
              </div>

              {/* Source & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Manba
                  </label>
                  <select
                    value={editingReview.source || 'website'}
                    onChange={(e) => setEditingReview({ ...editingReview, source: e.target.value as any })}
                    className="input-field"
                  >
                    <option value="website">Discovery Insight</option>
                    <option value="google">Google</option>
                    <option value="tripadvisor">TripAdvisor</option>
                    <option value="gyg">GetYourGuide</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Holat
                  </label>
                  <select
                    value={editingReview.status || 'pending'}
                    onChange={(e) => setEditingReview({ ...editingReview, status: e.target.value as any })}
                    className="input-field"
                  >
                    <option value="pending">Kutilmoqda</option>
                    <option value="approved">Tasdiqlangan</option>
                    <option value="rejected">Rad etilgan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Saqlash
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
