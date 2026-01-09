'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Calendar, User, ArrowRight, Loader2, FileText } from 'lucide-react';

interface BlogPost {
  id: number;
  slug: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  excerpt_en: string;
  excerpt_de: string;
  excerpt_ru: string;
  content_en: string;
  image: string;
  author: string;
  category: string;
  status: string;
  created_at: string;
}

export default function BlogPage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog?status=published');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get localized content
  const getTitle = (post: BlogPost) => {
    const key = `title_${locale}` as keyof BlogPost;
    return (post[key] as string) || post.title_en || 'Untitled';
  };

  const getExcerpt = (post: BlogPost) => {
    const key = `excerpt_${locale}` as keyof BlogPost;
    return (post[key] as string) || post.excerpt_en || '';
  };

  // Get unique categories
  const categories = ['all', ...new Set(posts.map(p => p.category).filter(Boolean))];

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const categoryNames: Record<string, Record<string, string>> = {
    all: { en: 'All', de: 'Alle', ru: 'Все' },
    'travel-tips': { en: 'Travel Tips', de: 'Reisetipps', ru: 'Советы' },
    history: { en: 'History', de: 'Geschichte', ru: 'История' },
    culture: { en: 'Culture', de: 'Kultur', ru: 'Культура' },
    food: { en: 'Food & Culture', de: 'Essen & Kultur', ru: 'Еда' },
    architecture: { en: 'Architecture', de: 'Architektur', ru: 'Архитектура' },
  };

  const getCategoryName = (cat: string) => {
    return categoryNames[cat]?.[locale] || cat;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

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
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-500'
                }`}
              >
                {getCategoryName(cat)}
              </button>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={getTitle(post)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <FileText size={48} className="text-white/50" />
                    </div>
                  )}
                  {post.category && (
                    <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {getCategoryName(post.category)}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold text-secondary-800 mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                    {getTitle(post)}
                  </h2>
                  <p className="text-secondary-600 mb-4 line-clamp-2">{getExcerpt(post)}</p>
                  <div className="flex items-center justify-between text-sm text-secondary-500">
                    <div className="flex items-center gap-4">
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {post.author}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.created_at).toLocaleDateString(
                          locale === 'de' ? 'de-DE' : locale === 'ru' ? 'ru-RU' : 'en-US',
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText size={64} className="mx-auto text-secondary-300 mb-4" />
            <h2 className="text-2xl font-bold text-secondary-700 mb-2">
              {locale === 'en' && 'No posts yet'}
              {locale === 'de' && 'Noch keine Beiträge'}
              {locale === 'ru' && 'Пока нет статей'}
            </h2>
            <p className="text-secondary-500">
              {locale === 'en' && 'Check back soon for travel tips and stories!'}
              {locale === 'de' && 'Schauen Sie bald wieder vorbei für Reisetipps und Geschichten!'}
              {locale === 'ru' && 'Загляните позже за советами и историями о путешествиях!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
