'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Grid, List, SlidersHorizontal, Loader2 } from 'lucide-react';
import TourCard from '@/components/tours/TourCard';

interface Tour {
  id: number;
  slug: string;
  main_image: string;
  destination: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  duration: number;
  price: number;
  rating: number;
  reviews: number;
  is_bestseller: boolean;
  tour_type: string;
  status: string;
}

interface Destination {
  id: number;
  slug: string;
  name_en: string;
  name_de: string;
  name_ru: string;
}

export default function ToursPage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const searchParams = useSearchParams();
  const destinationParam = searchParams.get('destination') || '';

  const [tours, setTours] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    destination: destinationParam,
    type: '',
    duration: '',
    priceRange: '',
  });
  const [sortBy, setSortBy] = useState('popularity');

  // Update filter when URL param changes
  useEffect(() => {
    if (destinationParam) {
      setFilters(prev => ({ ...prev, destination: destinationParam }));
    }
  }, [destinationParam]);

  // Fetch tours and destinations from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tours and destinations in parallel
        const [toursRes, destRes] = await Promise.all([
          fetch('/api/tours?status=active'),
          fetch('/api/destinations?status=active')
        ]);

        if (toursRes.ok) {
          const toursData = await toursRes.json();
          setTours(toursData);
        }

        if (destRes.ok) {
          const destData = await destRes.json();
          setDestinations(destData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get localized destination name
  const getDestinationName = (dest: Destination) => {
    return dest[`name_${locale}`] || dest.name_en;
  };

  // Transform tour data for TourCard component
  const transformedTours = tours.map((tour) => ({
    id: tour.id,
    slug: tour.slug,
    image: tour.main_image || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80',
    destination: tour.destination,
    title: {
      en: tour.title_en,
      de: tour.title_de || tour.title_en,
      ru: tour.title_ru || tour.title_en,
    },
    duration: tour.duration,
    price: tour.price,
    rating: tour.rating || 0,
    reviews: tour.reviews || 0,
    isBestseller: tour.is_bestseller,
    type: tour.tour_type,
  }));

  const filteredTours = transformedTours.filter((tour) => {
    // Filter by destination - check if tour destination contains the filter value
    if (filters.destination) {
      const tourDest = tour.destination?.toLowerCase() || '';
      const filterDest = filters.destination.toLowerCase();
      // Match if destination contains the filter OR filter contains the destination
      if (!tourDest.includes(filterDest) && !filterDest.includes(tourDest)) {
        return false;
      }
    }
    if (filters.type && tour.type !== filters.type) {
      return false;
    }
    return true;
  });

  const sortedTours = [...filteredTours].sort((a, b) => {
    switch (sortBy) {
      case 'priceLow':
        return a.price - b.price;
      case 'priceHigh':
        return b.price - a.price;
      case 'duration':
        return a.duration - b.duration;
      default:
        return b.reviews - a.reviews;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="bg-primary-500 py-16 md:py-24">
          <div className="container-custom text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('tours.title')}</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 size={48} className="animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero */}
      <div className="bg-primary-500 py-16 md:py-24">
        <div className="container-custom text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('tours.title')}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {locale === 'en' && 'Explore our carefully crafted tours across Central Asia'}
            {locale === 'de' && 'Entdecken Sie unsere sorgfältig gestalteten Reisen durch Zentralasien'}
            {locale === 'ru' && 'Исследуйте наши тщательно разработанные туры по Центральной Азии'}
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50"
            >
              <SlidersHorizontal size={18} />
              <span>{t('tours.filterBy')}</span>
            </button>
            <span className="text-secondary-500">
              {sortedTours.length} {locale === 'en' ? 'tours' : locale === 'de' ? 'Reisen' : 'туров'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="popularity">{t('tours.popularity')}</option>
              <option value="priceLow">{t('tours.priceLowHigh')}</option>
              <option value="priceHigh">{t('tours.priceHighLow')}</option>
              <option value="duration">{t('tours.durationShort')}</option>
            </select>

            <div className="flex border border-secondary-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white text-secondary-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white text-secondary-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('tours.destination')}
                </label>
                <select
                  value={filters.destination}
                  onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  className="w-full input-field"
                >
                  <option value="">
                    {locale === 'en' ? 'All' : locale === 'de' ? 'Alle' : 'Все'}
                  </option>
                  {destinations.map((dest) => (
                    <option key={dest.id} value={dest.slug}>
                      {getDestinationName(dest)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('navigation.tourTypes')}
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full input-field"
                >
                  <option value="">
                    {locale === 'en' ? 'All' : locale === 'de' ? 'Alle' : 'Все'}
                  </option>
                  <option value="cultural">{t('navigation.cultural')}</option>
                  <option value="adventure">{t('navigation.adventure')}</option>
                  <option value="historical">{t('navigation.historical')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('tours.duration')}
                </label>
                <select
                  value={filters.duration}
                  onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                  className="w-full input-field"
                >
                  <option value="">
                    {locale === 'en' ? 'Any' : locale === 'de' ? 'Beliebig' : 'Любая'}
                  </option>
                  <option value="short">1-7 {t('common.days')}</option>
                  <option value="medium">8-14 {t('common.days')}</option>
                  <option value="long">15+ {t('common.days')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('tours.priceRange')}
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full input-field"
                >
                  <option value="">
                    {locale === 'en' ? 'Any' : locale === 'de' ? 'Beliebig' : 'Любой'}
                  </option>
                  <option value="budget">€0 - €1000</option>
                  <option value="mid">€1000 - €2000</option>
                  <option value="premium">€2000+</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tours Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
          }`}
        >
          {sortedTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {sortedTours.length === 0 && (
          <div className="text-center py-16">
            <p className="text-secondary-500 text-lg">
              {locale === 'en' && 'No tours found. Create your first tour in the admin panel!'}
              {locale === 'de' && 'Keine Reisen gefunden. Erstellen Sie Ihre erste Reise im Admin-Panel!'}
              {locale === 'ru' && 'Туры не найдены. Создайте свой первый тур в админ-панели!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
