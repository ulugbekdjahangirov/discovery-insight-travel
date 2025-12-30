'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import TourCard from '@/components/tours/TourCard';

const featuredTours = [
  {
    id: 1,
    slug: 'classic-uzbekistan',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80',
    destination: 'Uzbekistan',
    title: {
      en: 'Classic Uzbekistan Tour',
      de: 'Klassische Usbekistan Reise',
      ru: 'Классический тур по Узбекистану',
    },
    duration: 8,
    price: 1299,
    rating: 4.9,
    reviews: 124,
    isBestseller: true,
  },
  {
    id: 2,
    slug: 'silk-road-adventure',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
    destination: 'Central Asia',
    title: {
      en: 'Silk Road Adventure',
      de: 'Seidenstraße Abenteuer',
      ru: 'Приключение на Шелковом пути',
    },
    duration: 14,
    price: 2499,
    rating: 4.8,
    reviews: 89,
    isBestseller: true,
  },
  {
    id: 3,
    slug: 'samarkand-bukhara',
    image: 'https://images.unsplash.com/photo-1580742314666-5bf5b15c94c0?auto=format&fit=crop&w=800&q=80',
    destination: 'Uzbekistan',
    title: {
      en: 'Samarkand & Bukhara Explorer',
      de: 'Samarkand & Buchara Entdecker',
      ru: 'Исследование Самарканда и Бухары',
    },
    duration: 5,
    price: 799,
    rating: 4.7,
    reviews: 156,
    isBestseller: false,
  },
  {
    id: 4,
    slug: 'kazakhstan-nomad',
    image: 'https://images.unsplash.com/photo-1590595906931-81120976ec5d?auto=format&fit=crop&w=800&q=80',
    destination: 'Kazakhstan',
    title: {
      en: 'Kazakhstan Nomad Experience',
      de: 'Kasachstan Nomaden Erlebnis',
      ru: 'Кочевой опыт Казахстана',
    },
    duration: 10,
    price: 1899,
    rating: 4.6,
    reviews: 67,
    isBestseller: false,
  },
];

export default function FeaturedTours() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="section-title">{t('common.featuredTours')}</h2>
            <p className="section-subtitle mb-0 max-w-2xl">
              {locale === 'en' && 'Discover our most popular tours handpicked for unforgettable experiences'}
              {locale === 'de' && 'Entdecken Sie unsere beliebtesten Reisen für unvergessliche Erlebnisse'}
              {locale === 'ru' && 'Откройте наши самые популярные туры для незабываемых впечатлений'}
            </p>
          </div>
          <Link
            href={`/${locale}/tours`}
            className="flex items-center gap-2 text-primary-500 font-medium hover:text-primary-600 mt-4 md:mt-0"
          >
            {t('common.allTours')}
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
