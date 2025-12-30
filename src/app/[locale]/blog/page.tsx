'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    slug: 'best-time-visit-uzbekistan',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80',
    category: { en: 'Travel Tips', de: 'Reisetipps', ru: 'Советы путешественникам' },
    title: {
      en: 'Best Time to Visit Uzbekistan: A Seasonal Guide',
      de: 'Die beste Reisezeit für Usbekistan: Ein saisonaler Leitfaden',
      ru: 'Лучшее время для посещения Узбекистана: сезонный гид',
    },
    excerpt: {
      en: 'Discover when to plan your trip to Uzbekistan for the perfect weather and fewer crowds.',
      de: 'Erfahren Sie, wann Sie Ihre Reise nach Usbekistan planen sollten für perfektes Wetter.',
      ru: 'Узнайте, когда лучше планировать поездку в Узбекистан для идеальной погоды.',
    },
    author: 'Maria Schmidt',
    date: '2024-12-15',
    readTime: 5,
  },
  {
    id: 2,
    slug: 'silk-road-history',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
    category: { en: 'History', de: 'Geschichte', ru: 'История' },
    title: {
      en: 'The Ancient Silk Road: A Journey Through History',
      de: 'Die alte Seidenstraße: Eine Reise durch die Geschichte',
      ru: 'Древний Шелковый путь: путешествие через историю',
    },
    excerpt: {
      en: 'Explore the fascinating history of the Silk Road and its impact on world civilization.',
      de: 'Entdecken Sie die faszinierende Geschichte der Seidenstraße und ihren Einfluss.',
      ru: 'Исследуйте увлекательную историю Шелкового пути и его влияние на мировую цивилизацию.',
    },
    author: 'Alex Johnson',
    date: '2024-12-10',
    readTime: 8,
  },
  {
    id: 3,
    slug: 'uzbek-cuisine-guide',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    category: { en: 'Food & Culture', de: 'Essen & Kultur', ru: 'Еда и культура' },
    title: {
      en: 'Uzbek Cuisine: Must-Try Dishes on Your Visit',
      de: 'Usbekische Küche: Must-Try Gerichte bei Ihrem Besuch',
      ru: 'Узбекская кухня: блюда, которые стоит попробовать',
    },
    excerpt: {
      en: 'From plov to samsa, discover the delicious flavors of traditional Uzbek cuisine.',
      de: 'Von Plov bis Samsa, entdecken Sie die köstlichen Aromen der usbekischen Küche.',
      ru: 'От плова до самсы — откройте для себя вкусы традиционной узбекской кухни.',
    },
    author: 'Elena Ivanova',
    date: '2024-12-05',
    readTime: 6,
  },
  {
    id: 4,
    slug: 'packing-guide-central-asia',
    image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
    category: { en: 'Travel Tips', de: 'Reisetipps', ru: 'Советы путешественникам' },
    title: {
      en: 'Essential Packing List for Central Asia',
      de: 'Wichtige Packliste für Zentralasien',
      ru: 'Что взять с собой в Центральную Азию',
    },
    excerpt: {
      en: 'Everything you need to pack for an unforgettable journey through Central Asia.',
      de: 'Alles, was Sie für eine unvergessliche Reise durch Zentralasien einpacken müssen.',
      ru: 'Все, что вам нужно взять с собой для незабываемого путешествия по Центральной Азии.',
    },
    author: 'David Miller',
    date: '2024-11-28',
    readTime: 4,
  },
  {
    id: 5,
    slug: 'samarkand-architecture',
    image: 'https://images.unsplash.com/photo-1580742314666-5bf5b15c94c0?auto=format&fit=crop&w=800&q=80',
    category: { en: 'Architecture', de: 'Architektur', ru: 'Архитектура' },
    title: {
      en: 'The Stunning Architecture of Samarkand',
      de: 'Die atemberaubende Architektur von Samarkand',
      ru: 'Потрясающая архитектура Самарканда',
    },
    excerpt: {
      en: 'Discover the magnificent Islamic architecture that makes Samarkand a UNESCO treasure.',
      de: 'Entdecken Sie die prächtige islamische Architektur, die Samarkand zum UNESCO-Schatz macht.',
      ru: 'Откройте великолепную исламскую архитектуру, делающую Самарканд сокровищем ЮНЕСКО.',
    },
    author: 'Sarah Wilson',
    date: '2024-11-20',
    readTime: 7,
  },
  {
    id: 6,
    slug: 'nomad-life-kazakhstan',
    image: 'https://images.unsplash.com/photo-1590595906931-81120976ec5d?auto=format&fit=crop&w=800&q=80',
    category: { en: 'Culture', de: 'Kultur', ru: 'Культура' },
    title: {
      en: 'Experiencing Nomad Life in Kazakhstan',
      de: 'Nomadenleben in Kasachstan erleben',
      ru: 'Опыт жизни кочевников в Казахстане',
    },
    excerpt: {
      en: 'Immerse yourself in the traditional nomadic culture of the Kazakh steppes.',
      de: 'Tauchen Sie ein in die traditionelle Nomadenkultur der kasachischen Steppe.',
      ru: 'Погрузитесь в традиционную кочевую культуру казахских степей.',
    },
    author: 'Michael Brown',
    date: '2024-11-15',
    readTime: 6,
  },
];

const categories = [
  { en: 'All', de: 'Alle', ru: 'Все' },
  { en: 'Travel Tips', de: 'Reisetipps', ru: 'Советы' },
  { en: 'History', de: 'Geschichte', ru: 'История' },
  { en: 'Culture', de: 'Kultur', ru: 'Культура' },
  { en: 'Food & Culture', de: 'Essen & Kultur', ru: 'Еда' },
  { en: 'Architecture', de: 'Architektur', ru: 'Архитектура' },
];

export default function BlogPage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero */}
      <div className="bg-primary-500 py-16 md:py-24">
        <div className="container-custom text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('blog.title')}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">{t('blog.subtitle')}</p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                idx === 0
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-500'
              }`}
            >
              {cat[locale]}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="card group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title[locale]}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {post.category[locale]}
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-secondary-800 mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                  {post.title[locale]}
                </h2>
                <p className="text-secondary-600 mb-4 line-clamp-2">{post.excerpt[locale]}</p>
                <div className="flex items-center justify-between text-sm text-secondary-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.date).toLocaleDateString(locale === 'de' ? 'de-DE' : locale === 'ru' ? 'ru-RU' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <span>{post.readTime} min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn-secondary">
            {locale === 'en' ? 'Load More Articles' : locale === 'de' ? 'Mehr Artikel laden' : 'Загрузить больше статей'}
          </button>
        </div>
      </div>
    </div>
  );
}
