'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Loader2 } from 'lucide-react';
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
}

export default function FeaturedTours() {
  const t = useTranslations();
  const locale = useLocale();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        // Fetch active tours, limit to 4 for featured section
        const response = await fetch('/api/tours?status=active&limit=4');
        if (response.ok) {
          const data = await response.json();
          setTours(data);
        }
      } catch (error) {
        console.error('Error fetching featured tours:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, []);

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
  }));

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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={40} className="animate-spin text-primary-500" />
          </div>
        ) : transformedTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transformedTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary-50 rounded-xl">
            <p className="text-secondary-500">
              {locale === 'en' && 'No tours available yet. Check back soon!'}
              {locale === 'de' && 'Noch keine Reisen verfügbar. Schauen Sie bald wieder vorbei!'}
              {locale === 'ru' && 'Туры пока недоступны. Загляните позже!'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
