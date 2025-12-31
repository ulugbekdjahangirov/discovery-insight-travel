'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Loader2,
  MapPin,
  Star,
  X,
} from 'lucide-react';

interface Destination {
  id: number;
  slug: string;
  name_en: string;
  name_de: string;
  name_ru: string;
  description_en: string;
  image: string;
  country: string;
  region: string;
  status: string;
  featured: boolean;
  tours_count: number;
  created_at: string;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [destinationToDelete, setDestinationToDelete] = useState<Destination | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch destinations from API
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/destinations');
      if (response.ok) {
        const data = await response.json();
        setDestinations(data);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!destinationToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/destinations/${destinationToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDestinations(destinations.filter((d) => d.id !== destinationToDelete.id));
        setShowDeleteModal(false);
        setDestinationToDelete(null);
      } else {
        alert('Failed to delete destination');
      }
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Failed to delete destination');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDestinations = destinations.filter((destination) =>
    destination.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Destinations</h1>
          <p className="text-secondary-600">Manage travel destinations</p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="flex items-center justify-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={20} />
          <span>Add Destination</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={40} className="animate-spin text-primary-500" />
        </div>
      ) : filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={destination.image || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80'}
                  alt={destination.name_en}
                  className="w-full h-full object-cover"
                />
                {destination.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <Star size={12} />
                    Featured
                  </div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadge(destination.status)}`}>
                  {destination.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-secondary-800 text-lg">
                      {destination.name_en}
                    </h3>
                    <p className="text-secondary-500 text-sm flex items-center gap-1">
                      <MapPin size={14} />
                      {destination.country || 'Central Asia'}
                    </p>
                  </div>
                </div>

                {destination.description_en && (
                  <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
                    {destination.description_en}
                  </p>
                )}

                <div className="text-sm text-secondary-500 mb-4">
                  {destination.tours_count || 0} tours available
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDestination(destination)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <Link
                    href={`/admin/destinations/${destination.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      setDestinationToDelete(destination);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center justify-center px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <MapPin size={48} className="mx-auto text-secondary-300 mb-4" />
          <h3 className="text-lg font-medium text-secondary-800 mb-2">No destinations yet</h3>
          <p className="text-secondary-500 mb-4">
            Get started by adding your first destination
          </p>
          <Link
            href="/admin/destinations/new"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
          >
            <Plus size={20} />
            Add Destination
          </Link>
        </div>
      )}

      {/* View Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-64">
              <img
                src={selectedDestination.image || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80'}
                alt={selectedDestination.name_en}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-secondary-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                {selectedDestination.featured && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </span>
                )}
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(selectedDestination.status)}`}>
                  {selectedDestination.status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-secondary-800 mb-2">
                {selectedDestination.name_en}
              </h2>
              <p className="text-secondary-500 flex items-center gap-1 mb-4">
                <MapPin size={16} />
                {selectedDestination.country || 'Central Asia'}
                {selectedDestination.region && ` - ${selectedDestination.region}`}
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-secondary-800 mb-1">Description (English)</h3>
                  <p className="text-secondary-600">{selectedDestination.description_en || 'No description'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <span className="text-secondary-500 text-sm">Tours</span>
                    <p className="font-medium">{selectedDestination.tours_count || 0} available</p>
                  </div>
                  <div>
                    <span className="text-secondary-500 text-sm">Slug</span>
                    <p className="font-medium">{selectedDestination.slug}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Link
                  href={`/admin/destinations/${selectedDestination.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  <Edit size={18} />
                  Edit Destination
                </Link>
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && destinationToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Delete Destination
            </h3>
            <p className="text-secondary-600 mb-6">
              Are you sure you want to delete "{destinationToDelete.name_en}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDestinationToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
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
