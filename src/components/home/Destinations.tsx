'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Loader2, MapPin } from 'lucide-react';

interface Destination {
  id: number;
  slug: string;
  name_en: string;
  name_de: string;
  name_ru: string;
  image: string;
  country: string;
  tours_count: number;
  featured: boolean;
}

// Fallback static data when no destinations in database
const fallbackDestinations = [
  {
    id: 1,
    slug: 'uzbekistan',
    name_en: 'Uzbekistan',
    name_de: 'Usbekistan',
    name_ru: 'Узбекистан',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80',
    country: 'Uzbekistan',
    tours_count: 24,
    featured: true,
  },
  {
    id: 2,
    slug: 'kazakhstan',
    name_en: 'Kazakhstan',
    name_de: 'Kasachstan',
    name_ru: 'Казахстан',
    image: 'https://images.unsplash.com/photo-1590595906931-81120976ec5d?auto=format&fit=crop&w=800&q=80',
    country: 'Kazakhstan',
    tours_count: 12,
    featured: true,
  },
  {
    id: 3,
    slug: 'kyrgyzstan',
    name_en: 'Kyrgyzstan',
    name_de: 'Kirgisistan',
    name_ru: 'Кыргызстан',
    image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
    country: 'Kyrgyzstan',
    tours_count: 15,
    featured: true,
  },
  {
    id: 4,
    slug: 'tajikistan',
    name_en: 'Tajikistan',
    name_de: 'Tadschikistan',
    name_ru: 'Таджикистан',
    image: 'https://images.unsplash.com/photo-1625736300986-37847903b2e5?auto=format&fit=crop&w=800&q=80',
    country: 'Tajikistan',
    tours_count: 8,
    featured: true,
  },
  {
    id: 5,
    slug: 'turkmenistan',
    name_en: 'Turkmenistan',
    name_de: 'Turkmenistan',
    name_ru: 'Туркменистан',
    image: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=800&q=80',
    country: 'Turkmenistan',
    tours_count: 6,
    featured: true,
  },
  {
    id: 6,
    slug: 'silk-road',
    name_en: 'Silk Road',
    name_de: 'Seidenstraße',
    name_ru: 'Шелковый путь',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
    country: 'Central Asia',
    tours_count: 18,
    featured: true,
  },
];

export default function Destinations() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations?status=active');
        if (response.ok) {
          const data = await response.json();
          // If we have destinations from API, use them; otherwise use fallback
          if (data && data.length > 0) {
            setDestinations(data);
          } else {
            setDestinations(fallbackDestinations);
          }
        } else {
          // On error, use fallback data
          setDestinations(fallbackDestinations);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setDestinations(fallbackDestinations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Get localized name
  const getName = (dest: Destination) => {
    return dest[`name_${locale}`] || dest.name_en;
  };

  return (
    <section className="py-16 md:py-24 bg-secondary-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">{t('navigation.destinations')}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {locale === 'en' && 'Explore the wonders of Central Asia and the ancient Silk Road'}
            {locale === 'de' && 'Entdecken Sie die Wunder Zentralasiens und der alten Seidenstraße'}
            {locale === 'ru' && 'Исследуйте чудеса Центральной Азии и древнего Шелкового пути'}
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={40} className="animate-spin text-primary-500" />
          </div>
        ) : (
          /* Destinations Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 6).map((dest) => (
              <Link
                key={dest.id}
                href={`/${locale}/tours?destination=${dest.slug}`}
                className="group relative h-64 rounded-xl overflow-hidden"
              >
                <img
                  src={dest.image || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80'}
                  alt={getName(dest)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold mb-1">{getName(dest)}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">
                      {dest.tours_count || 0} {locale === 'en' ? 'tours' : locale === 'de' ? 'Reisen' : 'туров'}
                    </span>
                    <span className="text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('common.viewDetails')}
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
