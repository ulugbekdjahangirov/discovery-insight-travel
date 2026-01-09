'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Star, Loader2, Globe } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: number;
  author_name: string;
  author_country: string;
  author_avatar: string;
  rating: number;
  title: string;
  comment: string;
  source: string;
  tours: {
    id: number;
    title_en: string;
    title_de: string;
    title_ru: string;
  } | null;
}

// Platform SVG icons
const PlatformIcon = ({ source, size = 32 }: { source: string; size?: number }) => {
  switch (source) {
    case 'google':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      );
    case 'tripadvisor':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#00AF87"/>
          <circle cx="8" cy="12" r="3" fill="white"/>
          <circle cx="16" cy="12" r="3" fill="white"/>
          <circle cx="8" cy="12" r="1.5" fill="#00AF87"/>
          <circle cx="16" cy="12" r="1.5" fill="#00AF87"/>
          <path d="M12 8 L12 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'gyg':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#FF5533"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">G</text>
        </svg>
      );
    default: // website - Discovery Insight
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#F97316"/>
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">D</text>
        </svg>
      );
  }
};

export default function Testimonials() {
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const [reviews, setReviews] = useState<Review[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const CARDS_TO_SHOW = 4;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?status=approved');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTourTitle = (review: Review) => {
    if (!review.tours) return '';
    const titleKey = `title_${locale}` as keyof typeof review.tours;
    return review.tours[titleKey] || review.tours.title_en;
  };

  // Get visible reviews (4 at a time, with wrapping)
  const getVisibleReviews = () => {
    if (reviews.length === 0) return [];
    const visible = [];
    for (let i = 0; i < CARDS_TO_SHOW; i++) {
      const index = (startIndex + i) % reviews.length;
      visible.push({ ...reviews[index], displayIndex: i });
    }
    return visible;
  };

  // Auto-slide every 4 seconds - one card at a time
  useEffect(() => {
    if (reviews.length > CARDS_TO_SHOW) {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setStartIndex((prev) => (prev + 1) % reviews.length);
          setIsAnimating(false);
        }, 300);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-primary-500">
        <div className="container-custom flex justify-center">
          <Loader2 className="animate-spin text-white" size={48} />
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const visibleReviews = getVisibleReviews();

  return (
    <section className="py-16 md:py-24 bg-primary-500 overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {locale === 'en' && 'What Our Travelers Say'}
            {locale === 'de' && 'Was unsere Reisenden sagen'}
            {locale === 'ru' && 'Что говорят наши путешественники'}
          </h2>
          <p className="text-primary-100">
            {locale === 'en' && `${reviews.length} reviews from happy travelers`}
            {locale === 'de' && `${reviews.length} Bewertungen von zufriedenen Reisenden`}
            {locale === 'ru' && `${reviews.length} отзывов от довольных путешественников`}
          </p>
        </div>

        {/* Reviews Grid - 4 cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isAnimating ? 'opacity-70' : 'opacity-100'}`}>
          {visibleReviews.map((review, idx) => {
            return (
              <div
                key={`${review.id}-${startIndex}-${idx}`}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Platform Icon & Name */}
                <div className="flex items-center gap-2 mb-4">
                  <PlatformIcon source={review.source} size={28} />
                  <span className={`text-sm font-medium ${
                    review.source === 'google' ? 'text-blue-600' :
                    review.source === 'tripadvisor' ? 'text-green-600' :
                    review.source === 'gyg' ? 'text-orange-600' :
                    'text-primary-500'
                  }`}>
                    {review.source === 'google' ? 'Google' :
                     review.source === 'tripadvisor' ? 'TripAdvisor' :
                     review.source === 'gyg' ? 'GetYourGuide' :
                     'Discovery Insight'}
                  </span>
                </div>

                {/* Review Title */}
                {review.title && (
                  <h3 className="text-sm font-semibold text-secondary-800 mb-2 line-clamp-1">
                    "{review.title}"
                  </h3>
                )}

                {/* Review Text */}
                <p className="text-secondary-600 text-sm mb-4 leading-relaxed line-clamp-4 flex-grow">
                  {review.comment}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-secondary-100">
                  {review.author_avatar ? (
                    <Image
                      src={review.author_avatar}
                      alt={review.author_name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-bold text-sm">
                      {review.author_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-secondary-800 text-sm truncate">{review.author_name}</h4>
                    {review.author_country && (
                      <p className="text-secondary-400 text-xs truncate">{review.author_country}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-secondary-300'}
                      />
                    ))}
                  </div>
                </div>

                {/* Tour Name */}
                {review.tours && (
                  <p className="text-primary-500 text-xs font-medium mt-3 truncate">
                    {getTourTitle(review)}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Dots */}
        {reviews.length > CARDS_TO_SHOW && (
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === startIndex ? 'bg-white w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
