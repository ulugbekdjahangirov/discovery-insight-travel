'use client';

import { useState } from 'react';
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
} from 'lucide-react';

const tourData = {
  id: 1,
  slug: 'classic-uzbekistan',
  images: [
    'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580742314666-5bf5b15c94c0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80',
  ],
  destination: 'Uzbekistan',
  title: {
    en: 'Classic Uzbekistan Tour',
    de: 'Klassische Usbekistan Reise',
    ru: 'Классический тур по Узбекистану',
  },
  description: {
    en: 'Discover the ancient cities of the Silk Road on this unforgettable journey through Uzbekistan. Visit Tashkent, Samarkand, Bukhara, and Khiva.',
    de: 'Entdecken Sie die antiken Städte der Seidenstraße auf dieser unvergesslichen Reise durch Usbekistan. Besuchen Sie Taschkent, Samarkand, Buchara und Chiwa.',
    ru: 'Откройте древние города Шелкового пути в этом незабываемом путешествии по Узбекистану. Посетите Ташкент, Самарканд, Бухару и Хиву.',
  },
  duration: 8,
  price: 1299,
  groupSize: '2-16',
  rating: 4.9,
  reviews: 124,
  included: {
    en: ['Airport transfers', 'All accommodation', 'Daily breakfast', 'English-speaking guide', 'Entrance fees', 'Internal transport'],
    de: ['Flughafentransfers', 'Alle Unterkünfte', 'Tägliches Frühstück', 'Deutschsprachiger Guide', 'Eintrittsgelder', 'Interner Transport'],
    ru: ['Трансфер из аэропорта', 'Все проживание', 'Ежедневный завтрак', 'Русскоговорящий гид', 'Входные билеты', 'Внутренний транспорт'],
  },
  notIncluded: {
    en: ['International flights', 'Travel insurance', 'Personal expenses', 'Lunch and dinner', 'Tips'],
    de: ['Internationale Flüge', 'Reiseversicherung', 'Persönliche Ausgaben', 'Mittag- und Abendessen', 'Trinkgelder'],
    ru: ['Международные перелеты', 'Туристическая страховка', 'Личные расходы', 'Обед и ужин', 'Чаевые'],
  },
  itinerary: [
    {
      day: 1,
      title: { en: 'Arrival in Tashkent', de: 'Ankunft in Taschkent', ru: 'Прибытие в Ташкент' },
      description: {
        en: 'Arrive at Tashkent International Airport. Transfer to hotel. Evening city tour of modern Tashkent.',
        de: 'Ankunft am internationalen Flughafen Taschkent. Transfer zum Hotel. Abendliche Stadtrundfahrt durch das moderne Taschkent.',
        ru: 'Прибытие в международный аэропорт Ташкента. Трансфер в отель. Вечерняя экскурсия по современному Ташкенту.',
      },
    },
    {
      day: 2,
      title: { en: 'Tashkent - Samarkand', de: 'Taschkent - Samarkand', ru: 'Ташкент - Самарканд' },
      description: {
        en: 'High-speed train to Samarkand. Visit Registan Square, Gur-Emir Mausoleum, and Bibi-Khanym Mosque.',
        de: 'Schnellzug nach Samarkand. Besuch des Registan-Platzes, des Gur-Emir-Mausoleums und der Bibi-Khanym-Moschee.',
        ru: 'Скоростной поезд в Самарканд. Посещение площади Регистан, мавзолея Гур-Эмир и мечети Биби-Ханым.',
      },
    },
    {
      day: 3,
      title: { en: 'Samarkand Full Day', de: 'Samarkand Ganzer Tag', ru: 'Самарканд полный день' },
      description: {
        en: 'Visit Shah-i-Zinda necropolis, Ulugh Beg Observatory, and paper-making workshop. Evening free.',
        de: 'Besuch der Nekropole Shah-i-Zinda, des Ulugh-Beg-Observatoriums und einer Papierwerkstatt. Abend frei.',
        ru: 'Посещение некрополя Шахи-Зинда, обсерватории Улугбека и мастерской по изготовлению бумаги. Свободный вечер.',
      },
    },
    {
      day: 4,
      title: { en: 'Samarkand - Bukhara', de: 'Samarkand - Buchara', ru: 'Самарканд - Бухара' },
      description: {
        en: 'Drive to Bukhara. En route visit the palace of the last Emir. Check-in and evening walk in the old city.',
        de: 'Fahrt nach Buchara. Unterwegs Besuch des Palastes des letzten Emirs. Check-in und Abendspaziergang in der Altstadt.',
        ru: 'Переезд в Бухару. По пути посещение дворца последнего эмира. Заселение и вечерняя прогулка по старому городу.',
      },
    },
    {
      day: 5,
      title: { en: 'Bukhara Full Day', de: 'Buchara Ganzer Tag', ru: 'Бухара полный день' },
      description: {
        en: 'Explore Ark Fortress, Bolo-Hauz Mosque, Ismail Samani Mausoleum, and the trading domes.',
        de: 'Entdecken Sie die Festung Ark, die Bolo-Hauz-Moschee, das Ismail-Samani-Mausoleum und die Handelskuppeln.',
        ru: 'Исследуйте крепость Арк, мечеть Боло-Хауз, мавзолей Исмаила Самани и торговые купола.',
      },
    },
    {
      day: 6,
      title: { en: 'Bukhara - Khiva', de: 'Buchara - Chiwa', ru: 'Бухара - Хива' },
      description: {
        en: 'Drive through Kyzylkum Desert to Khiva. Arrival and evening walk in Ichan-Kala.',
        de: 'Fahrt durch die Wüste Kyzylkum nach Chiwa. Ankunft und Abendspaziergang in Ichan-Kala.',
        ru: 'Переезд через пустыню Кызылкум в Хиву. Прибытие и вечерняя прогулка по Ичан-Кале.',
      },
    },
    {
      day: 7,
      title: { en: 'Khiva Full Day', de: 'Chiwa Ganzer Tag', ru: 'Хива полный день' },
      description: {
        en: 'Full day exploring the museum city of Khiva. Visit Kalta Minor, Tosh-Hovli Palace, and Islam Khoja Minaret.',
        de: 'Ganztägige Erkundung der Museumsstadt Chiwa. Besuch von Kalta Minor, Tosh-Hovli-Palast und Islam-Khoja-Minarett.',
        ru: 'Полный день исследования города-музея Хива. Посещение Кальта-Минор, дворца Таш-Ховли и минарета Ислам-Ходжа.',
      },
    },
    {
      day: 8,
      title: { en: 'Departure', de: 'Abreise', ru: 'Отъезд' },
      description: {
        en: 'Morning flight to Tashkent. Transfer to international airport for departure.',
        de: 'Morgenflug nach Taschkent. Transfer zum internationalen Flughafen für die Abreise.',
        ru: 'Утренний перелет в Ташкент. Трансфер в международный аэропорт для вылета.',
      },
    },
  ],
};

export default function TourDetailPage({ params }: { params: { slug: string } }) {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const [activeImage, setActiveImage] = useState(0);
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Image Gallery */}
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={tourData.images[activeImage]}
          alt={tourData.title[locale]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="container-custom">
            <div className="flex gap-2">
              {tourData.images.map((img, idx) => (
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
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 text-primary-500 text-sm mb-2">
                <MapPin size={16} />
                <span>{tourData.destination}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
                {tourData.title[locale]}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-secondary-600">
                <div className="flex items-center gap-1">
                  <Star className="fill-yellow-400 text-yellow-400" size={18} />
                  <span className="font-medium">{tourData.rating}</span>
                  <span className="text-secondary-400">({tourData.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={18} />
                  <span>{tourData.duration} {t('common.days')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={18} />
                  <span>{tourData.groupSize} {locale === 'en' ? 'persons' : locale === 'de' ? 'Personen' : 'человек'}</span>
                </div>
              </div>
              <p className="mt-4 text-secondary-600 leading-relaxed">{tourData.description[locale]}</p>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-secondary-800 mb-6">{t('tours.itinerary')}</h2>
              <div className="space-y-4">
                {tourData.itinerary.map((item) => (
                  <div key={item.day} className="border border-secondary-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDay(item.day)}
                      className="w-full flex items-center justify-between p-4 bg-secondary-50 hover:bg-secondary-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                          {item.day}
                        </span>
                        <span className="font-semibold text-secondary-800">{item.title[locale]}</span>
                      </div>
                      {expandedDays.includes(item.day) ? (
                        <ChevronUp size={20} className="text-secondary-400" />
                      ) : (
                        <ChevronDown size={20} className="text-secondary-400" />
                      )}
                    </button>
                    {expandedDays.includes(item.day) && (
                      <div className="p-4 text-secondary-600">{item.description[locale]}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Included / Not Included */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={24} />
                  {t('tours.included')}
                </h3>
                <ul className="space-y-2">
                  {tourData.included[locale].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-secondary-600">
                      <CheckCircle size={16} className="text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-secondary-800 mb-4 flex items-center gap-2">
                  <XCircle className="text-red-500" size={24} />
                  {t('tours.notIncluded')}
                </h3>
                <ul className="space-y-2">
                  {tourData.notIncluded[locale].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-secondary-600">
                      <XCircle size={16} className="text-red-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <div className="text-center mb-6">
                <span className="text-secondary-500">{t('common.from')}</span>
                <div className="text-4xl font-bold text-primary-500">
                  €{tourData.price.toLocaleString()}
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
                href={`/${locale}/booking?tour=${tourData.slug}`}
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
