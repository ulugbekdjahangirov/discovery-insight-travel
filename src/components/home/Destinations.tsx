'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

const destinations = [
  {
    id: 1,
    key: 'uzbekistan',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80',
    tourCount: 24,
  },
  {
    id: 2,
    key: 'kazakhstan',
    image: 'https://images.unsplash.com/photo-1590595906931-81120976ec5d?auto=format&fit=crop&w=800&q=80',
    tourCount: 12,
  },
  {
    id: 3,
    key: 'kyrgyzstan',
    image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
    tourCount: 15,
  },
  {
    id: 4,
    key: 'tajikistan',
    image: 'https://images.unsplash.com/photo-1625736300986-37847903b2e5?auto=format&fit=crop&w=800&q=80',
    tourCount: 8,
  },
  {
    id: 5,
    key: 'turkmenistan',
    image: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=800&q=80',
    tourCount: 6,
  },
  {
    id: 6,
    key: 'silkRoad',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
    tourCount: 18,
  },
];

export default function Destinations() {
  const t = useTranslations();
  const locale = useLocale();

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

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/${locale}/tours?destination=${dest.key}`}
              className="group relative h-64 rounded-xl overflow-hidden"
            >
              <img
                src={dest.image}
                alt={t(`navigation.${dest.key}`)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-2xl font-bold mb-1">{t(`navigation.${dest.key}`)}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">
                    {dest.tourCount} {locale === 'en' ? 'tours' : locale === 'de' ? 'Reisen' : 'туров'}
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
      </div>
    </section>
  );
}
