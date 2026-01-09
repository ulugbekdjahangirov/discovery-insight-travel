'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  X,
  Image as ImageIcon,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function NewBlogPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [seoExpanded, setSeoExpanded] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    slug: '',
    title_en: '',
    title_de: '',
    title_ru: '',
    excerpt_en: '',
    excerpt_de: '',
    excerpt_ru: '',
    content_en: '',
    content_de: '',
    content_ru: '',
    image: '',
    gallery: [] as string[],
    author: '',
    category: '',
    status: 'draft',
    // SEO fields
    meta_title_en: '',
    meta_title_de: '',
    meta_title_ru: '',
    meta_description_en: '',
    meta_description_de: '',
    meta_description_ru: '',
    keywords_en: '',
    keywords_de: '',
    keywords_ru: '',
    og_title_en: '',
    og_title_de: '',
    og_title_ru: '',
    og_description_en: '',
    og_description_de: '',
    og_description_ru: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (response.ok) {
        const data = await response.json();
        handleChange('image', data.url);
      } else {
        alert('Rasm yuklashda xatolik');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Rasm yuklashda xatolik');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    if (!files.length) return;

    setUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadData = new FormData();
        uploadData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (response.ok) {
          const data = await response.json();
          return data.url;
        }
        return null;
      });

      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url) => url !== null);

      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...validUrls],
      }));
    } catch (error) {
      console.error('Gallery upload error:', error);
      alert('Galereya rasmlarini yuklashda xatolik');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const generateSeo = async (locale: 'en' | 'de' | 'ru') => {
    const titleKey = `title_${locale}` as keyof typeof formData;
    const contentKey = `content_${locale}` as keyof typeof formData;
    const title = formData[titleKey] || formData.title_en;
    const content = formData[contentKey] || formData.content_en;

    if (!title) {
      alert('Avval sarlavha kiriting');
      return;
    }

    setIsGeneratingSeo(true);
    try {
      const response = await fetch('/api/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, locale }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          [`meta_title_${locale}`]: data.meta_title || '',
          [`meta_description_${locale}`]: data.meta_description || '',
          [`keywords_${locale}`]: data.keywords || '',
          [`og_title_${locale}`]: data.og_title || '',
          [`og_description_${locale}`]: data.og_description || '',
        }));
        setSeoExpanded(true);
      } else {
        const error = await response.json();
        alert(error.error || 'SEO yaratishda xatolik');
      }
    } catch (err) {
      console.error('SEO generation error:', err);
      alert('SEO yaratishda xatolik');
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  const generateAllSeo = async () => {
    setIsGeneratingSeo(true);
    try {
      // Generate for all languages in parallel
      await Promise.all([
        formData.title_en && generateSeoForLocale('en'),
        formData.title_de && generateSeoForLocale('de'),
        formData.title_ru && generateSeoForLocale('ru'),
      ]);
      setSeoExpanded(true);
    } catch (err) {
      console.error('SEO generation error:', err);
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  const generateSeoForLocale = async (locale: 'en' | 'de' | 'ru') => {
    const titleKey = `title_${locale}` as keyof typeof formData;
    const contentKey = `content_${locale}` as keyof typeof formData;
    const title = formData[titleKey];
    const content = formData[contentKey];

    if (!title) return;

    const response = await fetch('/api/ai/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, locale }),
    });

    if (response.ok) {
      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        [`meta_title_${locale}`]: data.meta_title || '',
        [`meta_description_${locale}`]: data.meta_description || '',
        [`keywords_${locale}`]: data.keywords || '',
        [`og_title_${locale}`]: data.og_title || '',
        [`og_description_${locale}`]: data.og_description || '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        const data = await response.json();
        setError(data.error || 'Post yaratishda xatolik');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Post yaratishda xatolik');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/blog"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-secondary-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Yangi Blog Post</h1>
          <p className="text-secondary-600">Yangi maqola yozing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-secondary-800">Asosiy ma'lumotlar</h2>

            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Sarlavha (Inglizcha) *
                </label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => {
                    handleChange('title_en', e.target.value);
                    handleChange('slug', generateSlug(e.target.value));
                  }}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Best Time to Visit Uzbekistan"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Sarlavha (Nemischa)
                </label>
                <input
                  type="text"
                  value={formData.title_de}
                  onChange={(e) => handleChange('title_de', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Beste Reisezeit für Usbekistan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Sarlavha (Ruscha)
                </label>
                <input
                  type="text"
                  value={formData.title_ru}
                  onChange={(e) => handleChange('title_ru', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Лучшее время для посещения"
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                URL Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-secondary-400">/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="flex-1 px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Author & Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Muallif
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Kategoriya
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Tanlang</option>
                  <option value="travel-tips">Travel Tips</option>
                  <option value="history">History</option>
                  <option value="culture">Culture</option>
                  <option value="food">Food & Culture</option>
                  <option value="architecture">Architecture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Holat
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="draft">Qoralama</option>
                  <option value="published">Chop etish</option>
                </select>
              </div>
            </div>
          </div>

          {/* Excerpts */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-secondary-800">Qisqa tavsif (Excerpt)</h2>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Inglizcha
              </label>
              <textarea
                value={formData.excerpt_en}
                onChange={(e) => handleChange('excerpt_en', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Maqola haqida qisqacha..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Nemischa
              </label>
              <textarea
                value={formData.excerpt_de}
                onChange={(e) => handleChange('excerpt_de', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Ruscha
              </label>
              <textarea
                value={formData.excerpt_ru}
                onChange={(e) => handleChange('excerpt_ru', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-secondary-800">Maqola matni</h2>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Inglizcha *
              </label>
              <textarea
                value={formData.content_en}
                onChange={(e) => handleChange('content_en', e.target.value)}
                rows={10}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Maqola matnini yozing..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Nemischa
              </label>
              <textarea
                value={formData.content_de}
                onChange={(e) => handleChange('content_de', e.target.value)}
                rows={10}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Ruscha
              </label>
              <textarea
                value={formData.content_ru}
                onChange={(e) => handleChange('content_ru', e.target.value)}
                rows={10}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setSeoExpanded(!seoExpanded)}
              className="w-full flex items-center justify-between p-6 hover:bg-secondary-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles size={24} className="text-primary-500" />
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-secondary-800">SEO Sozlamalari</h2>
                  <p className="text-sm text-secondary-500">Meta title, description, keywords</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    generateAllSeo();
                  }}
                  disabled={isGeneratingSeo || !formData.title_en}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-primary-500 text-white rounded-lg hover:from-purple-600 hover:to-primary-600 transition-all disabled:opacity-50 text-sm font-medium"
                >
                  {isGeneratingSeo ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  AI bilan yaratish
                </button>
                {seoExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {seoExpanded && (
              <div className="p-6 pt-0 space-y-6 border-t border-secondary-100">
                {/* English SEO */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-secondary-700">Inglizcha SEO</h3>
                    <button
                      type="button"
                      onClick={() => generateSeo('en')}
                      disabled={isGeneratingSeo}
                      className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
                    >
                      <Sparkles size={14} />
                      Yaratish
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-secondary-600 mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={formData.meta_title_en}
                        onChange={(e) => handleChange('meta_title_en', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        placeholder="SEO sarlavha (50-60 belgi)"
                      />
                      <p className="text-xs text-secondary-400 mt-1">{formData.meta_title_en.length}/60</p>
                    </div>
                    <div>
                      <label className="block text-sm text-secondary-600 mb-1">Keywords</label>
                      <input
                        type="text"
                        value={formData.keywords_en}
                        onChange={(e) => handleChange('keywords_en', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-secondary-600 mb-1">Meta Description</label>
                    <textarea
                      value={formData.meta_description_en}
                      onChange={(e) => handleChange('meta_description_en', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      placeholder="SEO tavsifi (150-160 belgi)"
                    />
                    <p className="text-xs text-secondary-400 mt-1">{formData.meta_description_en.length}/160</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-secondary-600 mb-1">OG Title</label>
                      <input
                        type="text"
                        value={formData.og_title_en}
                        onChange={(e) => handleChange('og_title_en', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        placeholder="Social media sarlavha"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-secondary-600 mb-1">OG Description</label>
                      <input
                        type="text"
                        value={formData.og_description_en}
                        onChange={(e) => handleChange('og_description_en', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        placeholder="Social media tavsifi"
                      />
                    </div>
                  </div>
                </div>

                {/* German SEO */}
                <div className="space-y-4 pt-4 border-t border-secondary-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-secondary-700">Nemischa SEO</h3>
                    <button
                      type="button"
                      onClick={() => generateSeo('de')}
                      disabled={isGeneratingSeo}
                      className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
                    >
                      <Sparkles size={14} />
                      Yaratish
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-secondary-600 mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={formData.meta_title_de}
                        onChange={(e) => handleChange('meta_title_de', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-secondary-600 mb-1">Keywords</label>
                      <input
                        type="text"
                        value={formData.keywords_de}
                        onChange={(e) => handleChange('keywords_de', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-secondary-600 mb-1">Meta Description</label>
                    <textarea
                      value={formData.meta_description_de}
                      onChange={(e) => handleChange('meta_description_de', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>

                {/* Russian SEO */}
                <div className="space-y-4 pt-4 border-t border-secondary-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-secondary-700">Ruscha SEO</h3>
                    <button
                      type="button"
                      onClick={() => generateSeo('ru')}
                      disabled={isGeneratingSeo}
                      className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
                    >
                      <Sparkles size={14} />
                      Yaratish
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-secondary-600 mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={formData.meta_title_ru}
                        onChange={(e) => handleChange('meta_title_ru', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-secondary-600 mb-1">Keywords</label>
                      <input
                        type="text"
                        value={formData.keywords_ru}
                        onChange={(e) => handleChange('keywords_ru', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-secondary-600 mb-1">Meta Description</label>
                    <textarea
                      value={formData.meta_description_ru}
                      onChange={(e) => handleChange('meta_description_ru', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Image */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-secondary-800">Asosiy rasm</h2>
            <p className="text-sm text-secondary-500">Bu rasm blog kartochkasida va sahifa tepasida ko'rinadi</p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              accept="image/*"
              className="hidden"
            />

            {formData.image ? (
              <div className="relative inline-block">
                <img
                  src={formData.image}
                  alt="Blog post"
                  className="w-64 h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleChange('image', '')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 size={40} className="animate-spin text-primary-500 mb-2" />
                    <p className="text-secondary-500">Yuklanmoqda...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon size={40} className="text-secondary-400 mb-2" />
                    <p className="text-secondary-600 font-medium">Rasm yuklash uchun bosing</p>
                    <p className="text-secondary-400 text-sm">JPG, PNG, WebP (max 5MB)</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gallery Images */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-secondary-800">Galereya rasmlari</h2>
            <p className="text-sm text-secondary-500">Maqola ichida ko'rsatiladigan qo'shimcha rasmlar</p>

            <input
              type="file"
              ref={galleryInputRef}
              onChange={(e) => {
                const files = e.target.files;
                if (files) handleGalleryUpload(files);
                e.target.value = '';
              }}
              accept="image/*"
              multiple
              className="hidden"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.gallery.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Add more button */}
              <div
                onClick={() => galleryInputRef.current?.click()}
                className="border-2 border-dashed border-secondary-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors"
              >
                {uploadingGallery ? (
                  <Loader2 size={24} className="animate-spin text-primary-500" />
                ) : (
                  <>
                    <Plus size={24} className="text-secondary-400 mb-1" />
                    <p className="text-secondary-500 text-sm">Rasm qo'shish</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/blog"
              className="px-6 py-3 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-colors"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saqlanmoqda...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Saqlash
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
