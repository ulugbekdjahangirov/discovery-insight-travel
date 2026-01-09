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
} from 'lucide-react';

export default function NewDestinationPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    slug: '',
    name_en: '',
    name_de: '',
    name_ru: '',
    description_en: '',
    description_de: '',
    description_ru: '',
    image: '',
    country: '',
    region: '',
    status: 'active',
    featured: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        handleChange('image', data.url);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/destinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: formData.slug,
          name: {
            en: formData.name_en,
            de: formData.name_de,
            ru: formData.name_ru,
          },
          description: {
            en: formData.description_en,
            de: formData.description_de,
            ru: formData.description_ru,
          },
          image: formData.image,
          country: formData.country,
          region: formData.region,
          status: formData.status,
          featured: formData.featured,
        }),
      });

      if (response.ok) {
        router.push('/admin/destinations');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create destination');
      }
    } catch (err) {
      console.error('Error creating destination:', err);
      setError('Failed to create destination');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/destinations"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-secondary-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Yangi Destination</h1>
          <p className="text-secondary-600">Yangi sayohat manzilini yarating</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-secondary-800">Asosiy ma'lumotlar</h2>

            {/* Names in 3 languages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Nomi (Inglizcha) *
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => {
                    handleChange('name_en', e.target.value);
                    handleChange('slug', generateSlug(e.target.value));
                  }}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Samarkand"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Nomi (Nemischa)
                </label>
                <input
                  type="text"
                  value={formData.name_de}
                  onChange={(e) => handleChange('name_de', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Samarkand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Nomi (Ruscha)
                </label>
                <input
                  type="text"
                  value={formData.name_ru}
                  onChange={(e) => handleChange('name_ru', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Самарканд"
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                URL Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-secondary-400">/destinations/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="flex-1 px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Davlat *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Davlatni tanlang</option>
                  <option value="uzbekistan">Uzbekistan</option>
                  <option value="kazakhstan">Kazakhstan</option>
                  <option value="kyrgyzstan">Kyrgyzstan</option>
                  <option value="tajikistan">Tajikistan</option>
                  <option value="turkmenistan">Turkmenistan</option>
                  <option value="silk-road">Silk Road</option>
                </select>
                <p className="text-sm text-green-600 mt-1">
                  ✓ Destination tanlagan davlat sahifasida avtomatik ko'rinadi
                </p>
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Viloyat/Hudud
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Samarkand viloyati"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Holat
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">Faol</option>
                  <option value="inactive">Nofaol</option>
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="w-5 h-5 text-primary-500 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-secondary-700">
                  Bosh sahifada ko'rsatish
                </label>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-secondary-800">Tavsiflar</h2>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tavsif (Inglizcha)
              </label>
              <textarea
                value={formData.description_en}
                onChange={(e) => handleChange('description_en', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Bu manzil haqida qisqacha..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tavsif (Nemischa)
              </label>
              <textarea
                value={formData.description_de}
                onChange={(e) => handleChange('description_de', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tavsif (Ruscha)
              </label>
              <textarea
                value={formData.description_ru}
                onChange={(e) => handleChange('description_ru', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-secondary-800">Rasm</h2>

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
                  alt="Destination"
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

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/destinations"
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
