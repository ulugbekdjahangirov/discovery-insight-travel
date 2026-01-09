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
  Image,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

interface PriceTier {
  personsFrom: number;
  personsTo: number;
  price: number;
}

interface Tour {
  id: number;
  slug: string;
  main_image: string;
  gallery_images: string[];
  route_images: string[];
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
  reviews_count: number;
  highlights_en: string;
  highlights_de: string;
  highlights_ru: string;
  included_en: string[];
  included_de: string[];
  included_ru: string[];
  not_included_en: string[];
  not_included_de: string[];
  not_included_ru: string[];
  enable_private_tour: boolean;
  enable_group_tour: boolean;
  private_tour_prices: PriceTier[];
  group_tour_prices: PriceTier[];
  itineraries?: Itinerary[];
  faq?: {
    question: { en: string; de: string; ru: string };
    answer: { en: string; de: string; ru: string };
  }[];
}

interface Review {
  id: number;
  author_name: string;
  author_country: string;
  rating: number;
  created_at: string;
  comment: string;
  title?: string;
  author_avatar?: string;
  source: 'website' | 'gyg' | 'tripadvisor' | 'google';
}

// Platform icons and colors
const platformInfo = {
  website: { label: 'Discovery Insight', color: 'text-primary-500', bgColor: 'bg-primary-50' },
  gyg: { label: 'GetYourGuide', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  tripadvisor: { label: 'TripAdvisor', color: 'text-green-600', bgColor: 'bg-green-50' },
  google: { label: 'Google', color: 'text-blue-600', bgColor: 'bg-blue-50' },
};

interface RelatedTour {
  id: number;
  slug: string;
  main_image: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  destination: string;
  duration: number;
  price: number;
  rating: number;
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
  image?: string;
}

export default function TourDetailPage({ params }: { params: { slug: string } }) {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [expandedFaq, setExpandedFaq] = useState<number[]>([0]);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [relatedTours, setRelatedTours] = useState<RelatedTour[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStartIndex, setReviewStartIndex] = useState(0);
  const reviewsPerPage = 3;
  const [selectedAdults, setSelectedAdults] = useState(1);
  const [selectedChildren, setSelectedChildren] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');

  // Check if tour is saved in database
  useEffect(() => {
    if (tour) {
      const checkSaved = async () => {
        try {
          const response = await fetch(`/api/saved-tours?tour_id=${tour.id}`);
          const data = await response.json();
          setIsSaved(data.isSaved);
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      };
      checkSaved();
    }
  }, [tour]);

  // Handle Save/Unsave tour
  const handleSave = async () => {
    if (!tour || isSaving) return;

    setIsSaving(true);

    try {
      if (isSaved) {
        // Remove from saved
        const response = await fetch(`/api/saved-tours?tour_id=${tour.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setIsSaved(false);
        }
      } else {
        // Add to saved
        const response = await fetch('/api/saved-tours', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tour_id: tour.id })
        });
        if (response.ok) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error('Error saving tour:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Share tour
  const handleShare = async () => {
    if (!tour) return;

    const shareData = {
      title: tour[`title_${locale}`] || tour.title_en,
      text: tour[`description_${locale}`]?.substring(0, 100) || tour.description_en?.substring(0, 100) || '',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch (err) {
      // User cancelled or error
      console.log('Share cancelled or failed');
    }
  };

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

  // Fetch related tours
  useEffect(() => {
    if (tour) {
      const fetchRelated = async () => {
        try {
          const response = await fetch(`/api/tours?status=active&limit=4`);
          if (response.ok) {
            const data = await response.json();
            // Filter out current tour and limit to 3
            const filtered = data.filter((t: RelatedTour) => t.id !== tour.id).slice(0, 3);
            setRelatedTours(filtered);
          }
        } catch (error) {
          console.error('Error fetching related tours:', error);
        }
      };
      fetchRelated();
    }
  }, [tour]);

  // Fetch reviews for this tour
  useEffect(() => {
    if (tour) {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`/api/reviews?tour_id=${tour.id}&status=approved`);
          if (response.ok) {
            const data = await response.json();
            setReviews(data);
          }
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
      fetchReviews();
    }
  }, [tour]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Calculate price per person based on number of adults (children are free)
  const getPricePerPerson = () => {
    if (!tour) return 0;

    // Price tier is based on total group size (adults + children)
    const totalPersons = selectedAdults + selectedChildren;

    // Check private tour prices first (default)
    if (tour.private_tour_prices && tour.private_tour_prices.length > 0) {
      const priceTier = tour.private_tour_prices.find(
        (p) => totalPersons >= p.personsFrom && totalPersons <= p.personsTo
      );
      if (priceTier) {
        return priceTier.price;
      }
    }

    // Fallback to base price
    return tour.price || 0;
  };

  const pricePerPerson = getPricePerPerson();
  // Only adults pay - children (0-5) are FREE
  const totalPrice = pricePerPerson * selectedAdults;

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
  const highlights = tour[`highlights_${locale}`] || tour.highlights_en || '';
  const included = tour[`included_${locale}`] || tour.included_en || [];
  const notIncluded = tour[`not_included_${locale}`] || tour.not_included_en || [];

  // Build images array for gallery
  const images = [
    tour.main_image,
    ...(tour.gallery_images || [])
  ].filter(Boolean);

  // Build route images array
  const routeImages = tour.route_images || [];

  // All images for lightbox (gallery + routes)
  const allLightboxImages = [...images, ...routeImages];

  // Default image if none available
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80');
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Main Image */}
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={tour.main_image || images[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
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
                {(tour.rating > 0 || reviews.length > 0) && (
                  <div className="flex items-center gap-1">
                    <Star className="fill-yellow-400 text-yellow-400" size={18} />
                    <span className="font-medium">{tour.rating || 0}</span>
                    <span className="text-secondary-400">({reviews.length} {locale === 'en' ? 'reviews' : locale === 'de' ? 'Bewertungen' : 'отзывов'})</span>
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

            {/* Highlights */}
            {highlights && (
              <div className="bg-white rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                  <Star className="text-yellow-500" size={24} />
                  {locale === 'en' ? 'Highlights' : locale === 'de' ? 'Höhepunkte' : 'Основные моменты'}
                </h2>
                <p className="text-secondary-600 leading-relaxed whitespace-pre-line">{highlights}</p>
              </div>
            )}

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
                        {expandedDays.includes(item.day_number) && (
                          <div className="p-4">
                            <div className={`${item.image ? 'flex gap-4' : ''}`}>
                              {item.image && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={dayTitle}
                                    className="w-32 h-24 object-cover rounded-lg"
                                  />
                                </div>
                              )}
                              {dayDescription && (
                                <p className="text-secondary-600 flex-1">{dayDescription}</p>
                              )}
                            </div>
                          </div>
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

            {/* Photo Gallery */}
            {images.length > 1 && (
              <div className="bg-white rounded-xl p-6 mt-6">
                <h3 className="text-xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                  <Image className="text-primary-500" size={24} />
                  {locale === 'en' ? 'Tour Photos' : locale === 'de' ? 'Reisefotos' : 'Фото тура'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden group"
                    >
                      <img
                        src={img}
                        alt={`${title} - ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                          {locale === 'en' ? 'View' : locale === 'de' ? 'Ansehen' : 'Смотреть'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tour Routes */}
            {tour.route_images && tour.route_images.length > 0 && (
              <div className="bg-white rounded-xl p-6 mt-6">
                <h3 className="text-xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                  <MapPin className="text-primary-500" size={24} />
                  {locale === 'en' ? 'Tour Routes' : locale === 'de' ? 'Reiserouten' : 'Маршруты тура'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.route_images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLightboxIndex(images.length + idx);
                        setLightboxOpen(true);
                      }}
                      className="relative aspect-[16/10] rounded-lg overflow-hidden group"
                    >
                      <img
                        src={img}
                        alt={`${locale === 'en' ? 'Route' : locale === 'de' ? 'Route' : 'Маршрут'} ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                          {locale === 'en' ? 'View Route' : locale === 'de' ? 'Route ansehen' : 'Смотреть маршрут'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {tour.faq && tour.faq.length > 0 && (
              <div className="bg-white rounded-xl p-6 mt-6">
                <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                  <HelpCircle className="text-primary-500" size={28} />
                  {locale === 'en' ? 'Frequently Asked Questions' : locale === 'de' ? 'Häufig gestellte Fragen' : 'Часто задаваемые вопросы'}
                </h2>
                <div className="space-y-3">
                  {tour.faq.map((item, idx) => (
                    <div key={idx} className="border border-secondary-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between p-4 bg-secondary-50 hover:bg-secondary-100 transition-colors text-left"
                      >
                        <span className="font-medium text-secondary-800 pr-4">
                          {item.question[locale] || item.question.en}
                        </span>
                        {expandedFaq.includes(idx) ? (
                          <ChevronUp size={20} className="text-secondary-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown size={20} className="text-secondary-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFaq.includes(idx) && (
                        <div className="p-4 bg-white border-t border-secondary-100">
                          <p className="text-secondary-600 leading-relaxed">
                            {item.answer[locale] || item.answer.en}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews Section */}
            <div className="bg-white rounded-xl p-6 mt-6">
              <h2 className="text-2xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                <MessageCircle className="text-primary-500" size={28} />
                {locale === 'en' ? 'Customer Reviews' : locale === 'de' ? 'Kundenbewertungen' : 'Отзывы клиентов'}
              </h2>

              {/* Overall Rating */}
              {reviews.length > 0 ? (
                (() => {
                  const totalReviews = reviews.length;
                  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);
                  const ratingCounts = [5, 4, 3, 2, 1].map(star =>
                    reviews.filter(r => r.rating === star).length
                  );

                  return (
                    <div className="flex items-center gap-6 mb-8 p-4 bg-primary-50 rounded-lg">
                      <div className="text-center min-w-[80px]">
                        <div className="text-4xl font-bold text-primary-500">{avgRating}</div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={`${star <= Math.round(parseFloat(avgRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-secondary-500 mt-1">
                          {totalReviews} {locale === 'en' ? 'reviews' : locale === 'de' ? 'Bewertungen' : 'отзывов'}
                        </div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((stars, idx) => {
                          const count = ratingCounts[idx];
                          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                          return (
                            <div key={stars} className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-secondary-500 w-3">{stars}</span>
                              <Star size={12} className="fill-yellow-400 text-yellow-400" />
                              <div className="flex-1 h-2 bg-secondary-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-secondary-400 w-6">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8 mb-6 bg-gradient-to-r from-primary-50 to-orange-50 rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <MessageCircle className="text-primary-300" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-700 mb-2">
                    {locale === 'en' ? 'No Reviews Yet' : locale === 'de' ? 'Noch keine Bewertungen' : 'Пока нет отзывов'}
                  </h3>
                  <p className="text-secondary-500 text-sm mb-4">
                    {locale === 'en' ? 'Be the first to share your experience!' :
                     locale === 'de' ? 'Seien Sie der Erste, der seine Erfahrung teilt!' :
                     'Будьте первым, кто поделится своим опытом!'}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={24} className="text-secondary-200" />
                    ))}
                  </div>
                </div>
              )}

              {/* Review List with Pagination - Side by Side */}
              {reviews.length > 0 && (
                <div>
                  {/* Reviews Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {reviews.slice(reviewStartIndex, reviewStartIndex + reviewsPerPage).map((review) => (
                      <div key={review.id} className="bg-secondary-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                            {review.author_avatar ? (
                              <img src={review.author_avatar} alt={review.author_name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              review.author_name.charAt(0)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-secondary-800 text-sm">{review.author_name}</span>
                              {review.author_country && (
                                <span className="text-secondary-400 text-xs">{review.author_country}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={12}
                                  className={`${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Platform & Date */}
                        <div className="flex items-center justify-between mb-2">
                          {review.source && platformInfo[review.source] && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${platformInfo[review.source].bgColor} ${platformInfo[review.source].color}`}>
                              {platformInfo[review.source].label}
                            </span>
                          )}
                          <span className="text-secondary-400 text-xs">
                            {new Date(review.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'de' ? 'de-DE' : 'ru-RU', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Content */}
                        {review.title && (
                          <h4 className="font-medium text-secondary-800 text-sm mb-1">{review.title}</h4>
                        )}
                        <p className="text-secondary-600 text-sm line-clamp-3">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {reviews.length > reviewsPerPage && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <button
                        onClick={() => setReviewStartIndex(Math.max(0, reviewStartIndex - reviewsPerPage))}
                        disabled={reviewStartIndex === 0}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          reviewStartIndex === 0
                            ? 'text-secondary-300 cursor-not-allowed'
                            : 'text-primary-500 hover:bg-primary-50 border border-primary-200'
                        }`}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setReviewStartIndex(idx * reviewsPerPage)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              Math.floor(reviewStartIndex / reviewsPerPage) === idx
                                ? 'bg-primary-500'
                                : 'bg-secondary-300 hover:bg-secondary-400'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setReviewStartIndex(Math.min(reviews.length - reviewsPerPage, reviewStartIndex + reviewsPerPage))}
                        disabled={reviewStartIndex >= reviews.length - reviewsPerPage}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          reviewStartIndex >= reviews.length - reviewsPerPage
                            ? 'text-secondary-300 cursor-not-allowed'
                            : 'text-primary-500 hover:bg-primary-50 border border-primary-200'
                        }`}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Write Review Button */}
              <button className="mt-6 w-full py-3 border-2 border-primary-500 text-primary-500 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                {locale === 'en' ? 'Write a Review' : locale === 'de' ? 'Bewertung schreiben' : 'Написать отзыв'}
              </button>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              {/* Dynamic Price Display */}
              <div className="text-center mb-6">
                <span className="text-secondary-500">{t('common.from')}</span>
                <div className="text-4xl font-bold text-primary-500">
                  €{pricePerPerson.toLocaleString()}
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
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t('booking.adults')}
                    </label>
                    <select
                      value={selectedAdults}
                      onChange={(e) => setSelectedAdults(parseInt(e.target.value))}
                      className="input-field"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t('booking.children')} <span className="text-xs text-secondary-400">(0-5)</span>
                    </label>
                    <select
                      value={selectedChildren}
                      onChange={(e) => setSelectedChildren(parseInt(e.target.value))}
                      className="input-field"
                    >
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-secondary-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between text-sm text-secondary-600 mb-2">
                  <span>{selectedAdults} {locale === 'en' ? 'Adults' : locale === 'de' ? 'Erwachsene' : 'Взрослых'} × €{pricePerPerson.toLocaleString()}</span>
                  <span>€{totalPrice.toLocaleString()}</span>
                </div>
                {selectedChildren > 0 && (
                  <div className="flex justify-between text-sm text-secondary-600 mb-2">
                    <span>{selectedChildren} {locale === 'en' ? 'Children' : locale === 'de' ? 'Kinder' : 'Детей'} (0-5)</span>
                    <span className="text-green-600 font-medium">{locale === 'en' ? 'FREE' : locale === 'de' ? 'GRATIS' : 'БЕСПЛАТНО'}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-secondary-800 pt-2 border-t border-secondary-200">
                  <span>{locale === 'en' ? 'Total' : locale === 'de' ? 'Gesamt' : 'Итого'}</span>
                  <span className="text-primary-500">€{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href={`/${locale}/booking?tour=${tour.slug}&adults=${selectedAdults}&children=${selectedChildren}${selectedDate ? `&date=${selectedDate}` : ''}`}
                className="btn-primary w-full text-center block mb-4"
              >
                {t('tours.bookThisTour')}
              </Link>

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg transition-colors ${
                    isSaved
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'border-secondary-200 hover:bg-secondary-50 text-secondary-600'
                  } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Heart size={18} className={isSaved ? 'fill-red-500' : ''} />
                  )}
                  <span>
                    {isSaved
                      ? locale === 'en' ? 'Saved' : locale === 'de' ? 'Gespeichert' : 'Сохранено'
                      : locale === 'en' ? 'Save' : locale === 'de' ? 'Speichern' : 'Сохранить'
                    }
                  </span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 text-secondary-600 transition-colors"
                >
                  <Share2 size={18} />
                  <span>{t('blog.share')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tours Section */}
        {relatedTours.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-800">
                {locale === 'en' ? 'You May Also Like' : locale === 'de' ? 'Das könnte Ihnen auch gefallen' : 'Вам также может понравиться'}
              </h2>
              <Link
                href={`/${locale}/tours`}
                className="flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium"
              >
                {locale === 'en' ? 'View All Tours' : locale === 'de' ? 'Alle Reisen' : 'Все туры'}
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTours.map((relatedTour) => (
                <Link
                  key={relatedTour.id}
                  href={`/${locale}/tours/${relatedTour.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedTour.main_image || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80'}
                      alt={relatedTour[`title_${locale}`] || relatedTour.title_en}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-secondary-700">
                      {relatedTour.destination}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-secondary-800 mb-2 group-hover:text-primary-500 transition-colors">
                      {relatedTour[`title_${locale}`] || relatedTour.title_en}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3 text-secondary-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {relatedTour.duration} {t('common.days')}
                        </span>
                        {relatedTour.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            {relatedTour.rating}
                          </span>
                        )}
                      </div>
                      <div className="text-primary-500 font-bold">
                        €{relatedTour.price?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Toast Notification */}
      {showShareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-secondary-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {locale === 'en' && 'Link copied to clipboard!'}
          {locale === 'de' && 'Link in die Zwischenablage kopiert!'}
          {locale === 'ru' && 'Ссылка скопирована!'}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>

          {/* Previous button */}
          {allLightboxImages.length > 1 && (
            <button
              onClick={() => setLightboxIndex((prev) => (prev === 0 ? allLightboxImages.length - 1 : prev - 1))}
              className="absolute left-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft size={48} />
            </button>
          )}

          {/* Image */}
          <div className="max-w-5xl max-h-[85vh] px-16">
            <img
              src={allLightboxImages[lightboxIndex]}
              alt={`${title} - ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          {/* Next button */}
          {allLightboxImages.length > 1 && (
            <button
              onClick={() => setLightboxIndex((prev) => (prev === allLightboxImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight size={48} />
            </button>
          )}

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {lightboxIndex + 1} / {allLightboxImages.length}
          </div>

          {/* Thumbnail strip */}
          {allLightboxImages.length > 1 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
              {allLightboxImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-16 h-12 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                    idx === lightboxIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
