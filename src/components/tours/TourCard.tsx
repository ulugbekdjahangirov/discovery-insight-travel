'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Star, Clock, MapPin } from 'lucide-react';

interface Tour {
  id: number;
  slug: string;
  image: string;
  destination: string;
  title: { en: string; de: string; ru: string };
  duration: number;
  price: number;
  rating: number;
  reviews: number;
  isBestseller?: boolean;
}

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';

  return (
    <Link href={`/${locale}/tours/${tour.slug}`} className="card group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title[locale]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {tour.isBestseller && (
          <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {t('common.bestSellers')}
          </span>
        )}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-primary-500 font-bold">
            {t('common.from')} €{tour.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Destination */}
        <div className="flex items-center gap-1 text-secondary-500 text-sm mb-2">
          <MapPin size={14} />
          <span>{tour.destination}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-secondary-800 mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
          {tour.title[locale]}
        </h3>

        {/* Rating & Duration */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-secondary-700">{tour.rating}</span>
            <span className="text-secondary-400 text-sm">({tour.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-secondary-500 text-sm">
            <Clock size={14} />
            <span>
              {tour.duration} {t('common.days')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
