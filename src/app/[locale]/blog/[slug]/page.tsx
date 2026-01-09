'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Calendar, User, ArrowLeft, Loader2, FileText, Share2, X, ChevronLeft, ChevronRight } from 'lucide-react';

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
  content_de: string;
  content_ru: string;
  image: string;
  gallery: string[];
  author: string;
  category: string;
  status: string;
  created_at: string;
}

export default function BlogPostPage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/slug/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Error loading post');
    } finally {
      setIsLoading(false);
    }
  };

  // Get localized content
  const getTitle = () => {
    if (!post) return '';
    const key = `title_${locale}` as keyof BlogPost;
    return (post[key] as string) || post.title_en || 'Untitled';
  };

  const getContent = () => {
    if (!post) return '';
    const key = `content_${locale}` as keyof BlogPost;
    return (post[key] as string) || post.content_en || '';
  };

  const categoryNames: Record<string, Record<string, string>> = {
    'travel-tips': { en: 'Travel Tips', de: 'Reisetipps', ru: 'Советы' },
    history: { en: 'History', de: 'Geschichte', ru: 'История' },
    culture: { en: 'Culture', de: 'Kultur', ru: 'Культура' },
    food: { en: 'Food & Culture', de: 'Essen & Kultur', ru: 'Еда' },
    architecture: { en: 'Architecture', de: 'Architektur', ru: 'Архитектура' },
  };

  const getCategoryName = (cat: string) => {
    return categoryNames[cat]?.[locale] || cat;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getTitle(),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(locale === 'ru' ? 'Ссылка скопирована!' : locale === 'de' ? 'Link kopiert!' : 'Link copied!');
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    if (post?.gallery) {
      setLightboxIndex((prev) => (prev + 1) % post.gallery.length);
    }
  };

  const prevImage = () => {
    if (post?.gallery) {
      setLightboxIndex((prev) => (prev - 1 + post.gallery.length) % post.gallery.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <FileText size={64} className="mx-auto text-secondary-300 mb-4" />
          <h1 className="text-2xl font-bold text-secondary-700 mb-2">
            {locale === 'en' && 'Post not found'}
            {locale === 'de' && 'Beitrag nicht gefunden'}
            {locale === 'ru' && 'Статья не найдена'}
          </h1>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 mt-4"
          >
            <ArrowLeft size={18} />
            {locale === 'en' && 'Back to Blog'}
            {locale === 'de' && 'Zurück zum Blog'}
            {locale === 'ru' && 'Назад к блогу'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Image */}
      {post.image ? (
        <div className="relative h-[400px] md:h-[500px]">
          <img
            src={post.image}
            alt={getTitle()}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container-custom">
              {post.category && (
                <span className="inline-block bg-primary-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                  {getCategoryName(post.category)}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
                {getTitle()}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                {post.author && (
                  <span className="flex items-center gap-2">
                    <User size={18} />
                    {post.author}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar size={18} />
                  {new Date(post.created_at).toLocaleDateString(
                    locale === 'de' ? 'de-DE' : locale === 'ru' ? 'ru-RU' : 'en-US',
                    { month: 'long', day: 'numeric', year: 'numeric' }
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-primary-500 py-16 md:py-24">
          <div className="container-custom">
            {post.category && (
              <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                {getCategoryName(post.category)}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
              {getTitle()}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              {post.author && (
                <span className="flex items-center gap-2">
                  <User size={18} />
                  {post.author}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Calendar size={18} />
                {new Date(post.created_at).toLocaleDateString(
                  locale === 'de' ? 'de-DE' : locale === 'ru' ? 'ru-RU' : 'en-US',
                  { month: 'long', day: 'numeric', year: 'numeric' }
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back link & Share */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft size={18} />
              {locale === 'en' && 'Back to Blog'}
              {locale === 'de' && 'Zurück zum Blog'}
              {locale === 'ru' && 'Назад к блогу'}
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Share2 size={18} />
              {locale === 'en' && 'Share'}
              {locale === 'de' && 'Teilen'}
              {locale === 'ru' && 'Поделиться'}
            </button>
          </div>

          {/* Article content */}
          <article className="bg-white rounded-xl p-8 shadow-sm">
            <div
              className="prose prose-lg max-w-none prose-headings:text-secondary-800 prose-p:text-secondary-600 prose-a:text-primary-500"
              dangerouslySetInnerHTML={{ __html: getContent().replace(/\n/g, '<br />') }}
            />
          </article>

          {/* Gallery */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="bg-white rounded-xl p-8 shadow-sm mt-8">
              <h2 className="text-xl font-bold text-secondary-800 mb-4">
                {locale === 'en' && 'Photo Gallery'}
                {locale === 'de' && 'Fotogalerie'}
                {locale === 'ru' && 'Фотогалерея'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {post.gallery.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-video cursor-pointer group overflow-hidden rounded-lg"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Author Box */}
          {post.author && (
            <div className="bg-white rounded-xl p-6 shadow-sm mt-8 flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-secondary-500">
                  {locale === 'en' && 'Written by'}
                  {locale === 'de' && 'Geschrieben von'}
                  {locale === 'ru' && 'Автор'}
                </p>
                <p className="text-lg font-semibold text-secondary-800">{post.author}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && post.gallery && post.gallery.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={32} />
          </button>

          {/* Previous button */}
          {post.gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft size={40} />
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={post.gallery[lightboxIndex]}
              alt={`Gallery ${lightboxIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {/* Counter */}
            <p className="text-center text-white mt-4">
              {lightboxIndex + 1} / {post.gallery.length}
            </p>
          </div>

          {/* Next button */}
          {post.gallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight size={40} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
