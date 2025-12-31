'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Star,
  Clock,
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Share2,
  Heart,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

interface Tour {
  id: number;
  slug: string;
  main_image: string;
  gallery_images: string[];
  destination: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  description_en: string;
  description_de: string;
  description_ru: string;
  duration: number;
  price: number;
  group_size: string;
  rating: number;
  reviews: number;
  included_en: string[];
  included_de: string[];
  included_ru: string[];
  not_included_en: string[];
  not_included_de: string[];
  not_included_ru: string[];
  itineraries?: Itinerary[];
}

interface Itinerary {
  id: number;
  day_number: number;
  title_en: string;
  title_de: string;
  title_ru: string;
  description_en: string;
  description_de: string;
  description_ru: string;
}

export default function TourDetailPage({ params }: { params: { slug: string } }) {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/tours?slug=${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setTour(data);
        } else {
          setError('Tour not found');
        }
      } catch (err) {
        setError('Failed to load tour');
        console.error('Error fetching tour:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTour();
  }, [params.slug]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-secondary-50 flex flex-col items-center justify-center">
        <p className="text-secondary-500 text-lg mb-4">
          {locale === 'en' && 'Tour not found'}
          {locale === 'de' && 'Reise nicht gefunden'}
          {locale === 'ru' && 'Тур не найден'}
        </p>
        <Link href={`/${locale}/tours`} className="text-primary-500 hover:underline flex items-center gap-2">
          <ArrowLeft size={18} />
          {locale === 'en' && 'Back to Tours'}
          {locale === 'de' && 'Zurück zu Reisen'}
          {locale === 'ru' && 'Назад к турам'}
        </Link>
      </div>
    );
  }

  // Get localized content
  const title = tour[`title_${locale}`] || tour.title_en;
  const description = tour[`description_${locale}`] || tour.description_en;
  const included = tour[`included_${locale}`] || tour.included_en || [];
  const notIncluded = tour[`not_included_${locale}`] || tour.not_included_en || [];

  // Build images array
  const images = [
    tour.main_image,
    ...(tour.gallery_images || [])
  ].filter(Boolean);

  // Default image if none available
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80');
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Image Gallery */}
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={images[activeImage]}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {images.length > 1 && (
          <div className="absolute bottom-6 left-6 right-6">
            <div className="container-custom">
              <div className="flex gap-2">
                {images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 ${
                      idx === activeImage ? 'border-white' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 text-primary-500 text-sm mb-2">
                <MapPin size={16} />
                <span>{tour.destination}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-secondary-600">
                {tour.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="fill-yellow-400 text-yellow-400" size={18} />
                    <span className="font-medium">{tour.rating}</span>
                    <span className="text-secondary-400">({tour.reviews} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock size={18} />
                  <span>{tour.duration} {t('common.days')}</span>
                </div>
                {tour.group_size && (
                  <div className="flex items-center gap-1">
                    <Users size={18} />
                    <span>{tour.group_size} {locale === 'en' ? 'persons' : locale === 'de' ? 'Personen' : 'человек'}</span>
                  </div>
                )}
              </div>
              {description && (
                <p className="mt-4 text-secondary-600 leading-relaxed">{description}</p>
              )}
            </div>

            {/* Itinerary */}
            {tour.itineraries && tour.itineraries.length > 0 && (
              <div className="bg-white rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-secondary-800 mb-6">{t('tours.itinerary')}</h2>
                <div className="space-y-4">
                  {tour.itineraries.map((item) => {
                    const dayTitle = item[`title_${locale}`] || item.title_en;
                    const dayDescription = item[`description_${locale}`] || item.description_en;
                    return (
                      <div key={item.id} className="border border-secondary-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleDay(item.day_number)}
                          className="w-full flex items-center justify-between p-4 bg-secondary-50 hover:bg-secondary-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                              {item.day_number}
                            </span>
                            <span className="font-semibold text-secondary-800">{dayTitle}</span>
                          </div>
                          {expandedDays.includes(item.day_number) ? (
                            <ChevronUp size={20} className="text-secondary-400" />
                          ) : (
                            <ChevronDown size={20} className="text-secondary-400" />
                          )}
                        </button>
                        {expandedDays.includes(item.day_number) && dayDescription && (
                          <div className="p-4 text-secondary-600">{dayDescription}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Included / Not Included */}
            {(included.length > 0 || notIncluded.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {included.length > 0 && (
                  <div className="bg-white rounded-xl p-6">
                    <h3 className="text-xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="text-green-500" size={24} />
                      {t('tours.included')}
                    </h3>
                    <ul className="space-y-2">
                      {included.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-secondary-600">
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {notIncluded.length > 0 && (
                  <div className="bg-white rounded-xl p-6">
                    <h3 className="text-xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                      <XCircle className="text-red-500" size={24} />
                      {t('tours.notIncluded')}
                    </h3>
                    <ul className="space-y-2">
                      {notIncluded.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-secondary-600">
                          <XCircle size={16} className="text-red-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <div className="text-center mb-6">
                <span className="text-secondary-500">{t('common.from')}</span>
                <div className="text-4xl font-bold text-primary-500">
                  €{tour.price?.toLocaleString()}
                </div>
                <span className="text-secondary-500">{t('common.perPerson')}</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {t('booking.startDate')}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                    <input type="date" className="input-field pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {t('booking.travelers')}
                  </label>
                  <select className="input-field">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5+</option>
                  </select>
                </div>
              </div>

              <Link
                href={`/${locale}/booking?tour=${tour.slug}`}
                className="btn-primary w-full text-center block mb-4"
              >
                {t('tours.bookThisTour')}
              </Link>

              <div className="flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 text-secondary-600">
                  <Heart size={18} />
                  <span>{locale === 'en' ? 'Save' : locale === 'de' ? 'Speichern' : 'Сохранить'}</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 text-secondary-600">
                  <Share2 size={18} />
                  <span>{t('blog.share')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
