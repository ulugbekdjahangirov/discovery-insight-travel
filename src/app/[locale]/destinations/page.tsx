'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';

interface Destination {
  id: number;
  slug: string;
  name_en: string;
  name_de: string;
  name_ru: string;
  description_en: string;
  description_de: string;
  description_ru: string;
  image: string;
  country: string;
  region: string;
  tours_count: number;
  featured: boolean;
  status: string;
}

// Fallback static data when no destinations in database
const fallbackDestinations: Destination[] = [
  {
    id: 1,
    slug: 'uzbekistan',
    name_en: 'Uzbekistan',
    name_de: 'Usbekistan',
    name_ru: 'Узбекистан',
    description_en: 'Discover the heart of the ancient Silk Road with stunning Islamic architecture and rich history.',
    description_de: 'Entdecken Sie das Herz der alten Seidenstraße mit atemberaubender islamischer Architektur.',
    description_ru: 'Откройте для себя сердце древнего Шелкового пути с потрясающей исламской архитектурой.',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80',
    country: 'Uzbekistan',
    region: 'Central Asia',
    tours_count: 24,
    featured: true,
    status: 'active',
  },
  {
    id: 2,
    slug: 'kazakhstan',
    name_en: 'Kazakhstan',
    name_de: 'Kasachstan',
    name_ru: 'Казахстан',
    description_en: 'Experience vast steppes, modern cities, and nomadic traditions in the largest country in Central Asia.',
    description_de: 'Erleben Sie weite Steppen, moderne Städte und nomadische Traditionen.',
    description_ru: 'Испытайте бескрайние степи, современные города и кочевые традиции.',
    image: 'https://images.unsplash.com/photo-1590595906931-81120976ec5d?auto=format&fit=crop&w=800&q=80',
    country: 'Kazakhstan',
    region: 'Central Asia',
    tours_count: 12,
    featured: true,
    status: 'active',
  },
  {
    id: 3,
    slug: 'kyrgyzstan',
    name_en: 'Kyrgyzstan',
    name_de: 'Kirgisistan',
    name_ru: 'Кыргызстан',
    description_en: 'Explore breathtaking mountain landscapes, pristine lakes, and authentic yurt camps.',
    description_de: 'Erkunden Sie atemberaubende Berglandschaften und authentische Jurten-Camps.',
    description_ru: 'Исследуйте захватывающие горные пейзажи и аутентичные юрточные лагеря.',
    image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
    country: 'Kyrgyzstan',
    region: 'Central Asia',
    tours_count: 15,
    featured: true,
    status: 'active',
  },
  {
    id: 4,
    slug: 'tajikistan',
    name_en: 'Tajikistan',
    name_de: 'Tadschikistan',
    name_ru: 'Таджикистан',
    description_en: 'Adventure through the Pamir Mountains, the "Roof of the World", with ancient fortresses.',
    description_de: 'Abenteuer durch das Pamir-Gebirge, das "Dach der Welt".',
    description_ru: 'Приключения через горы Памира, "Крышу мира".',
    image: 'https://images.unsplash.com/photo-1625736300986-37847903b2e5?auto=format&fit=crop&w=800&q=80',
    country: 'Tajikistan',
    region: 'Central Asia',
    tours_count: 8,
    featured: true,
    status: 'active',
  },
  {
    id: 5,
    slug: 'turkmenistan',
    name_en: 'Turkmenistan',
    name_de: 'Turkmenistan',
    name_ru: 'Туркменистан',
    description_en: 'Visit the mysterious Darvaza Gas Crater and ancient ruins of Merv.',
    description_de: 'Besuchen Sie den mysteriösen Darvaza-Gaskrater und die antiken Ruinen von Merv.',
    description_ru: 'Посетите загадочный газовый кратер Дарваза и древние руины Мерва.',
    image: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=800&q=80',
    country: 'Turkmenistan',
    region: 'Central Asia',
    tours_count: 6,
    featured: true,
    status: 'active',
  },
  {
    id: 6,
    slug: 'silk-road',
    name_en: 'Silk Road',
    name_de: 'Seidenstraße',
    name_ru: 'Шелковый путь',
    description_en: 'Journey along the legendary trade route connecting East and West.',
    description_de: 'Reisen Sie entlang der legendären Handelsroute zwischen Ost und West.',
    description_ru: 'Путешествие по легендарному торговому пути, соединяющему Восток и Запад.',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
    country: 'Central Asia',
    region: 'Multi-country',
    tours_count: 18,
    featured: true,
    status: 'active',
  },
];

export default function DestinationsPage() {
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
          if (data && data.length > 0) {
            setDestinations(data);
          } else {
            setDestinations(fallbackDestinations);
          }
        } else {
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

  // Get localized content
  const getName = (dest: Destination) => dest[`name_${locale}`] || dest.name_en;
  const getDescription = (dest: Destination) => dest[`description_${locale}`] || dest.description_en;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="bg-primary-500 py-16 md:py-24">
          <div className="container-custom text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('navigation.destinations')}</h1>
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
      <div
        className="relative h-[400px] flex items-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container-custom relative z-10 text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('navigation.destinations')}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {locale === 'en' && 'Explore the wonders of Central Asia and the ancient Silk Road'}
            {locale === 'de' && 'Entdecken Sie die Wunder Zentralasiens und der alten Seidenstraße'}
            {locale === 'ru' && 'Исследуйте чудеса Центральной Азии и древнего Шелкового пути'}
          </p>
        </div>
      </div>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/${locale}/tours?destination=${dest.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dest.image || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80'}
                    alt={getName(dest)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-2xl font-bold">{getName(dest)}</h3>
                    <div className="flex items-center gap-2 text-white/80 mt-1">
                      <MapPin size={16} />
                      <span>{dest.country || dest.region}</span>
                    </div>
                  </div>
                  {dest.featured && (
                    <span className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {locale === 'en' ? 'Featured' : locale === 'de' ? 'Empfohlen' : 'Рекомендуем'}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-secondary-600 mb-4 line-clamp-2">
                    {getDescription(dest)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-500">
                      {dest.tours_count || 0} {locale === 'en' ? 'tours available' : locale === 'de' ? 'Reisen verfügbar' : 'туров доступно'}
                    </span>
                    <span className="flex items-center gap-1 text-primary-500 font-medium group-hover:gap-2 transition-all">
                      {locale === 'en' ? 'Explore' : locale === 'de' ? 'Entdecken' : 'Исследовать'}
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {destinations.length === 0 && (
            <div className="text-center py-16">
              <MapPin size={64} className="mx-auto text-secondary-300 mb-4" />
              <p className="text-secondary-500 text-lg">
                {locale === 'en' && 'No destinations found. Check back soon!'}
                {locale === 'de' && 'Keine Reiseziele gefunden. Schauen Sie bald wieder vorbei!'}
                {locale === 'ru' && 'Направления не найдены. Загляните позже!'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500">
        <div className="container-custom text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {locale === 'en' && 'Ready to Start Your Adventure?'}
            {locale === 'de' && 'Bereit für Ihr Abenteuer?'}
            {locale === 'ru' && 'Готовы начать приключение?'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {locale === 'en' && 'Contact us today to plan your perfect Central Asian journey'}
            {locale === 'de' && 'Kontaktieren Sie uns noch heute, um Ihre perfekte Reise zu planen'}
            {locale === 'ru' && 'Свяжитесь с нами сегодня, чтобы спланировать идеальное путешествие'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/tours`}
              className="px-8 py-3 bg-white text-primary-500 rounded-lg font-medium hover:bg-secondary-100 transition-colors"
            >
              {locale === 'en' ? 'Browse Tours' : locale === 'de' ? 'Reisen durchsuchen' : 'Просмотреть туры'}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              {t('common.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
