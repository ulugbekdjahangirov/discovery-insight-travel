'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import TourCard from '@/components/tours/TourCard';

const allTours = [
  {
    id: 1,
    slug: 'classic-uzbekistan',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80',
    destination: 'Uzbekistan',
    title: { en: 'Classic Uzbekistan Tour', de: 'Klassische Usbekistan Reise', ru: 'Классический тур по Узбекистану' },
    duration: 8,
    price: 1299,
    rating: 4.9,
    reviews: 124,
    isBestseller: true,
    type: 'cultural',
  },
  {
    id: 2,
    slug: 'silk-road-adventure',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
    destination: 'Central Asia',
    title: { en: 'Silk Road Adventure', de: 'Seidenstraße Abenteuer', ru: 'Приключение на Шелковом пути' },
    duration: 14,
    price: 2499,
    rating: 4.8,
    reviews: 89,
    isBestseller: true,
    type: 'adventure',
  },
  {
    id: 3,
    slug: 'samarkand-bukhara',
    image: 'https://images.unsplash.com/photo-1580742314666-5bf5b15c94c0?auto=format&fit=crop&w=800&q=80',
    destination: 'Uzbekistan',
    title: { en: 'Samarkand & Bukhara Explorer', de: 'Samarkand & Buchara Entdecker', ru: 'Исследование Самарканда и Бухары' },
    duration: 5,
    price: 799,
    rating: 4.7,
    reviews: 156,
    isBestseller: false,
    type: 'historical',
  },
  {
    id: 4,
    slug: 'kazakhstan-nomad',
    image: 'https://images.unsplash.com/photo-1590595906931-81120976ec5d?auto=format&fit=crop&w=800&q=80',
    destination: 'Kazakhstan',
    title: { en: 'Kazakhstan Nomad Experience', de: 'Kasachstan Nomaden Erlebnis', ru: 'Кочевой опыт Казахстана' },
    duration: 10,
    price: 1899,
    rating: 4.6,
    reviews: 67,
    isBestseller: false,
    type: 'adventure',
  },
  {
    id: 5,
    slug: 'kyrgyzstan-mountains',
    image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
    destination: 'Kyrgyzstan',
    title: { en: 'Kyrgyzstan Mountain Trek', de: 'Kirgistan Bergtrekking', ru: 'Горный поход по Кыргызстану' },
    duration: 12,
    price: 1699,
    rating: 4.8,
    reviews: 45,
    isBestseller: false,
    type: 'adventure',
  },
  {
    id: 6,
    slug: 'tajikistan-pamir',
    image: 'https://images.unsplash.com/photo-1625736300986-37847903b2e5?auto=format&fit=crop&w=800&q=80',
    destination: 'Tajikistan',
    title: { en: 'Pamir Highway Journey', de: 'Pamir Highway Reise', ru: 'Путешествие по Памирскому тракту' },
    duration: 9,
    price: 1599,
    rating: 4.9,
    reviews: 38,
    isBestseller: false,
    type: 'adventure',
  },
  {
    id: 7,
    slug: 'uzbekistan-photo-tour',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    destination: 'Uzbekistan',
    title: { en: 'Uzbekistan Photo Tour', de: 'Usbekistan Foto-Tour', ru: 'Фототур по Узбекистану' },
    duration: 7,
    price: 1199,
    rating: 4.7,
    reviews: 52,
    isBestseller: false,
    type: 'cultural',
  },
  {
    id: 8,
    slug: 'central-asia-complete',
    image: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=800&q=80',
    destination: 'Central Asia',
    title: { en: 'Complete Central Asia', de: 'Komplettes Zentralasien', ru: 'Полная Центральная Азия' },
    duration: 21,
    price: 3999,
    rating: 4.9,
    reviews: 29,
    isBestseller: true,
    type: 'cultural',
  },
];

export default function ToursPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    destination: '',
    type: '',
    duration: '',
    priceRange: '',
  });
  const [sortBy, setSortBy] = useState('popularity');

  const filteredTours = allTours.filter((tour) => {
    if (filters.destination && tour.destination.toLowerCase() !== filters.destination.toLowerCase()) {
      return false;
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
                  <option value="uzbekistan">{t('navigation.uzbekistan')}</option>
                  <option value="kazakhstan">{t('navigation.kazakhstan')}</option>
                  <option value="kyrgyzstan">{t('navigation.kyrgyzstan')}</option>
                  <option value="tajikistan">{t('navigation.tajikistan')}</option>
                  <option value="central asia">{t('navigation.silkRoad')}</option>
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
              {locale === 'en' && 'No tours found matching your criteria'}
              {locale === 'de' && 'Keine Reisen gefunden, die Ihren Kriterien entsprechen'}
              {locale === 'ru' && 'Туры, соответствующие вашим критериям, не найдены'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
