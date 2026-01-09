'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Loader2,
  RefreshCw,
  Eye,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SavedTourStats {
  tour: {
    id: number;
    slug: string;
    title_en: string;
    title_de: string;
    title_ru: string;
    main_image: string;
    destination: string;
  };
  count: number;
  saves: {
    id: number;
    session_id: string;
    ip_address: string;
    created_at: string;
  }[];
}

interface StatsData {
  total_saves: number;
  tours: SavedTourStats[];
}

export default function AdminSavedToursPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTour, setExpandedTour] = useState<number | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/saved-tours?stats=true');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Ma\'lumotlarni yuklashda xatolik');
      }
    } catch (err) {
      setError('Server xatosi');
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (tourId: number) => {
    setExpandedTour(expandedTour === tourId ? null : tourId);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={48} className="animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800 flex items-center gap-3">
            <Heart className="text-red-500" size={28} />
            Saqlangan Turlar
          </h1>
          <p className="text-secondary-500 mt-1">
            Foydalanuvchilar tomonidan sevimlilarga qo'shilgan turlar
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-100 hover:bg-secondary-200 rounded-lg transition-colors"
        >
          <RefreshCw size={18} />
          Yangilash
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="text-red-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Jami Saqlashlar</p>
              <p className="text-2xl font-bold text-secondary-800">{stats?.total_saves || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Turlar Soni</p>
              <p className="text-2xl font-bold text-secondary-800">{stats?.tours?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-secondary-500">O'rtacha Saqlash</p>
              <p className="text-2xl font-bold text-secondary-800">
                {stats?.tours?.length ? (stats.total_saves / stats.tours.length).toFixed(1) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tours List */}
      {stats?.tours && stats.tours.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
          <div className="p-4 border-b border-secondary-100">
            <h2 className="font-semibold text-secondary-800">Eng Ko'p Saqlangan Turlar</h2>
          </div>

          <div className="divide-y divide-secondary-100">
            {stats.tours.map((item, index) => (
              <div key={item.tour?.id || index} className="p-4">
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => item.tour && toggleExpand(item.tour.id)}
                >
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-200 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-secondary-100 text-secondary-600'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Image */}
                  <img
                    src={item.tour?.main_image || 'https://via.placeholder.com/60'}
                    alt={item.tour?.title_en || 'Tour'}
                    className="w-16 h-12 object-cover rounded-lg"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-secondary-800 truncate">
                      {item.tour?.title_en || 'Noma\'lum tur'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-secondary-500">
                      <MapPin size={14} />
                      <span>{item.tour?.destination || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Count */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-1 rounded-full">
                      <Heart size={16} className="fill-red-500" />
                      <span className="font-semibold">{item.count}</span>
                    </div>
                    {item.tour && (
                      expandedTour === item.tour.id ? (
                        <ChevronUp size={20} className="text-secondary-400" />
                      ) : (
                        <ChevronDown size={20} className="text-secondary-400" />
                      )
                    )}
                  </div>

                  {/* Actions */}
                  <Link
                    href={`/en/tours/${item.tour?.slug}`}
                    target="_blank"
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye size={18} className="text-secondary-500" />
                  </Link>
                </div>

                {/* Expanded Details */}
                {item.tour && expandedTour === item.tour.id && (
                  <div className="mt-4 ml-12 bg-secondary-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-secondary-700 mb-3 flex items-center gap-2">
                      <Calendar size={16} />
                      Saqlash Tarixi
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {item.saves.map((save) => (
                        <div
                          key={save.id}
                          className="flex items-center justify-between text-sm bg-white p-2 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-secondary-400">#{save.id}</span>
                            <span className="text-secondary-600">
                              IP: {save.ip_address || 'N/A'}
                            </span>
                          </div>
                          <span className="text-secondary-500">
                            {formatDate(save.created_at)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-secondary-100">
          <Heart size={48} className="mx-auto text-secondary-300 mb-4" />
          <p className="text-secondary-500">Hali hech qanday tur saqlanmagan</p>
        </div>
      )}
    </div>
  );
}
