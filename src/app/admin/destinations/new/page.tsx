'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  Navigation,
} from 'lucide-react';

interface MenuItem {
  id: number;
  name_en: string;
  location: string;
  parent_id: number | null;
  children?: MenuItem[];
}

export default function NewDestinationPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [countryMenus, setCountryMenus] = useState<MenuItem[]>([]);
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
    addToMenu: true,
    countryMenuId: '',
  });

  // Fetch country menus (children of "Destinations" menu)
  useEffect(() => {
    const fetchCountryMenus = async () => {
      try {
        const response = await fetch('/api/menus?location=header');
        if (response.ok) {
          const data = await response.json();
          // Find "Destinations" menu and get its children (countries)
          const destinationsMenu = data.find((m: MenuItem) =>
            m.name_en.toLowerCase() === 'destinations'
          );
          if (destinationsMenu && destinationsMenu.children) {
            setCountryMenus(destinationsMenu.children);
          }
        }
      } catch (error) {
        console.error('Error fetching country menus:', error);
      }
    };
    fetchCountryMenus();
  }, []);

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
      // Create destination
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
        // If "Add to menu" is checked, create menu item under selected country
        if (formData.addToMenu && formData.countryMenuId) {
          try {
            await fetch('/api/menus', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name_en: formData.name_en,
                name_de: formData.name_de || formData.name_en,
                name_ru: formData.name_ru || formData.name_en,
                url: `/tours?destination=${formData.slug}`,
                parent_id: parseInt(formData.countryMenuId),
                location: 'header',
                order_index: 99,
                status: formData.status,
              }),
            });
          } catch (menuError) {
            console.error('Error creating menu item:', menuError);
          }
        }

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
          <h1 className="text-2xl font-bold text-secondary-800">Add New Destination</h1>
          <p className="text-secondary-600">Create a new travel destination</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-secondary-800">Basic Information</h2>

            {/* Names in 3 languages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Name (English) *
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => {
                    handleChange('name_en', e.target.value);
                    handleChange('slug', generateSlug(e.target.value));
                  }}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Name (German)
                </label>
                <input
                  type="text"
                  value={formData.name_de}
                  onChange={(e) => handleChange('name_de', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Name (Russian)
                </label>
                <input
                  type="text"
                  value={formData.name_ru}
                  onChange={(e) => handleChange('name_ru', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select country</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                </select>
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Region
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Samarkand Region"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                  Featured Destination (show on homepage)
                </label>
              </div>
            </div>
          </div>

          {/* Menu Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Navigation size={20} className="text-primary-500" />
              <h2 className="text-lg font-semibold text-secondary-800">Menyu sozlamalari</h2>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="addToMenu"
                checked={formData.addToMenu}
                onChange={(e) => handleChange('addToMenu', e.target.checked)}
                className="w-5 h-5 text-primary-500 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="addToMenu" className="text-sm font-medium text-secondary-700">
                Menyuga avtomatik qo'shish
              </label>
            </div>

            {formData.addToMenu && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Qaysi davlat menyusi ostida ko'rinsin?
                </label>
                <select
                  value={formData.countryMenuId}
                  onChange={(e) => handleChange('countryMenuId', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">-- Davlatni tanlang --</option>
                  {countryMenus.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name_en}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-secondary-500 mt-1">
                  Masalan: "Uzbekistan" tanlasangiz → Destinations → Uzbekistan → [Yangi destination]
                </p>
                {countryMenus.length === 0 && (
                  <p className="text-sm text-amber-600 mt-2">
                    ⚠️ Avval Supabase'da menus jadvalini yarating va davlat menyularini qo'shing
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Descriptions */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-secondary-800">Descriptions</h2>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description (English)
              </label>
              <textarea
                value={formData.description_en}
                onChange={(e) => handleChange('description_en', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe this destination..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description (German)
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
                Description (Russian)
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
            <h2 className="text-lg font-semibold text-secondary-800">Destination Image</h2>

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
                    <p className="text-secondary-500">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon size={40} className="text-secondary-400 mb-2" />
                    <p className="text-secondary-600 font-medium">Click to upload image</p>
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
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Create Destination
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
