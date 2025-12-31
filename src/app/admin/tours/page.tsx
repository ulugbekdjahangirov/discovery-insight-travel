'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, Eye, X, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

interface Tour {
  id: number;
  slug: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  description_en: string;
  destination: string;
  duration: number;
  price: number;
  status: 'active' | 'inactive' | 'draft';
  tour_type: string;
  group_size: string;
  is_bestseller: boolean;
  rating: number;
  reviews: number;
  main_image: string;
  created_at: string;
}

export default function AdminToursPage() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch tours from API
  const fetchTours = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/tours');
      if (!response.ok) throw new Error('Failed to fetch tours');
      const data = await response.json();
      setTours(data);
    } catch (err) {
      setError('Turlarni yuklashda xatolik. Supabase sozlamalarini tekshiring.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.title_en?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tour.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTours = filteredTours.slice(startIndex, startIndex + itemsPerPage);

  // View tour details
  const handleView = (tour: Tour) => {
    setSelectedTour(tour);
    setShowViewModal(true);
  };

  // Edit tour
  const handleEdit = (tour: Tour) => {
    router.push(`/admin/tours/${tour.id}/edit`);
  };

  // Delete tour
  const handleDeleteClick = (tour: Tour) => {
    setTourToDelete(tour);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!tourToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tours/${tourToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setTours((prev) => prev.filter((t) => t.id !== tourToDelete.id));
      setShowDeleteModal(false);
      setTourToDelete(null);
    } catch (error) {
      console.error('Failed to delete tour:', error);
      setError('Turni o\'chirishda xatolik');
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Tours</h1>
          <p className="text-secondary-600">Manage your tour packages</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchTours}
            className="flex items-center gap-2 px-4 py-2 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <Link
            href="/admin/tours/new"
            className="btn-primary flex items-center gap-2 w-fit"
          >
            <Plus size={20} />
            <span>Add New Tour</span>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <input
              type="text"
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {paginatedTours.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-secondary-500">
                    {tours.length === 0 ? (
                      <div>
                        <p className="mb-2">Hozircha turlar yo&apos;q</p>
                        <Link href="/admin/tours/new" className="text-primary-500 hover:underline">
                          Yangi tur qo&apos;shish
                        </Link>
                      </div>
                    ) : (
                      'No tours found matching your search'
                    )}
                  </td>
                </tr>
              ) : (
                paginatedTours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tour.main_image && (
                          <img
                            src={tour.main_image}
                            alt={tour.title_en}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <span className="font-medium text-secondary-800">{tour.title_en}</span>
                          {tour.is_bestseller && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                              Bestseller
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary-600">{tour.destination}</td>
                    <td className="px-6 py-4 text-secondary-600">{tour.duration} days</td>
                    <td className="px-6 py-4 text-secondary-800 font-medium">€{tour.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-secondary-600">
                      {tour.rating > 0 ? `${tour.rating}★ (${tour.reviews})` : '-'}
                    </td>
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
                        <button
                          onClick={() => handleView(tour)}
                          className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(tour)}
                          className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Tour"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tour)}
                          className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Tour"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTours.length > 0 && (
          <div className="px-6 py-4 border-t border-secondary-100 flex items-center justify-between">
            <span className="text-sm text-secondary-500">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTours.length)} of {filteredTours.length} tours
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border border-secondary-200 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'text-secondary-300 cursor-not-allowed'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-primary-500 text-white'
                      : 'border border-secondary-200 text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 border border-secondary-200 rounded-lg transition-colors ${
                  currentPage === totalPages || totalPages === 0
                    ? 'text-secondary-300 cursor-not-allowed'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedTour && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-secondary-100">
              <h2 className="text-xl font-semibold text-secondary-800">Tour Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-secondary-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedTour.main_image && (
                <img
                  src={selectedTour.main_image}
                  alt={selectedTour.title_en}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-secondary-500">Tour Name (EN)</label>
                  <p className="font-medium text-secondary-800">{selectedTour.title_en}</p>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Status</label>
                  <p>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedTour.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : selectedTour.status === 'inactive'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {selectedTour.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Destination</label>
                  <p className="font-medium text-secondary-800">{selectedTour.destination}</p>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Duration</label>
                  <p className="font-medium text-secondary-800">{selectedTour.duration} days</p>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Price</label>
                  <p className="font-medium text-secondary-800">€{selectedTour.price?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Rating</label>
                  <p className="font-medium text-secondary-800">
                    {selectedTour.rating > 0 ? `${selectedTour.rating}★ (${selectedTour.reviews} reviews)` : 'No ratings yet'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Type</label>
                  <p className="font-medium text-secondary-800 capitalize">{selectedTour.tour_type}</p>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Group Size</label>
                  <p className="font-medium text-secondary-800">{selectedTour.group_size} people</p>
                </div>
              </div>
              {selectedTour.description_en && (
                <div>
                  <label className="text-sm text-secondary-500">Description</label>
                  <p className="font-medium text-secondary-800">{selectedTour.description_en}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-secondary-500">URL Slug</label>
                <p className="font-medium text-primary-500">/tours/{selectedTour.slug}</p>
              </div>
              <div>
                <label className="text-sm text-secondary-500">Created</label>
                <p className="font-medium text-secondary-800">
                  {new Date(selectedTour.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-secondary-100">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedTour);
                }}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Edit Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && tourToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-secondary-800 text-center mb-2">
                Delete Tour
              </h2>
              <p className="text-secondary-600 text-center mb-6">
                Are you sure you want to delete <span className="font-medium">&quot;{tourToDelete.title_en}&quot;</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTourToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
