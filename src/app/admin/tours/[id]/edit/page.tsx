'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Itinerary {
  id?: number;
  day_number: number;
  title_en: string;
  title_de: string;
  title_ru: string;
  description_en: string;
  description_de: string;
  description_ru: string;
}

interface Tour {
  id: number;
  slug: string;
  destination: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  description_en: string;
  description_de: string;
  description_ru: string;
  duration: number;
  price: number;
  tour_type: string;
  status: string;
  group_size: string;
  is_bestseller: boolean;
  main_image: string;
  gallery_images: string[];
  included_en: string[];
  included_de: string[];
  included_ru: string[];
  not_included_en: string[];
  not_included_de: string[];
  not_included_ru: string[];
  itineraries: Itinerary[];
}

const tourTypes = [
  { value: 'cultural', label: 'Cultural' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'historical', label: 'Historical' },
  { value: 'group', label: 'Group' },
  { value: 'private', label: 'Private' },
];

const destinations = [
  'Uzbekistan',
  'Kazakhstan',
  'Kyrgyzstan',
  'Tajikistan',
  'Turkmenistan',
  'Central Asia',
];

export default function EditTourPage() {
  const router = useRouter();
  const params = useParams();
  const tourId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'itinerary' | 'images'>('basic');

  const [formData, setFormData] = useState<Tour>({
    id: 0,
    slug: '',
    destination: '',
    title_en: '',
    title_de: '',
    title_ru: '',
    description_en: '',
    description_de: '',
    description_ru: '',
    duration: 1,
    price: 0,
    tour_type: 'cultural',
    status: 'draft',
    group_size: '',
    is_bestseller: false,
    main_image: '',
    gallery_images: [],
    included_en: [],
    included_de: [],
    included_ru: [],
    not_included_en: [],
    not_included_de: [],
    not_included_ru: [],
    itineraries: [],
  });

  // Load tour data from API
  useEffect(() => {
    const loadTour = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/tours/${tourId}`);
        if (response.ok) {
          const tour = await response.json();
          setFormData({
            id: tour.id,
            slug: tour.slug || '',
            destination: tour.destination || '',
            title_en: tour.title_en || '',
            title_de: tour.title_de || '',
            title_ru: tour.title_ru || '',
            description_en: tour.description_en || '',
            description_de: tour.description_de || '',
            description_ru: tour.description_ru || '',
            duration: tour.duration || 1,
            price: tour.price || 0,
            tour_type: tour.tour_type || 'cultural',
            status: tour.status || 'draft',
            group_size: tour.group_size || '',
            is_bestseller: tour.is_bestseller || false,
            main_image: tour.main_image || '',
            gallery_images: tour.gallery_images || [],
            included_en: tour.included_en || [],
            included_de: tour.included_de || [],
            included_ru: tour.included_ru || [],
            not_included_en: tour.not_included_en || [],
            not_included_de: tour.not_included_de || [],
            not_included_ru: tour.not_included_ru || [],
            itineraries: tour.itineraries || [],
          });
        } else {
          setError('Tour not found');
        }
      } catch (err) {
        console.error('Error loading tour:', err);
        setError('Failed to load tour');
      } finally {
        setIsLoading(false);
      }
    };

    loadTour();
  }, [tourId]);

  const handleChange = (field: keyof Tour, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccessMessage('');
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`/api/tours/${tourId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: formData.slug,
          destination: formData.destination,
          title: {
            en: formData.title_en,
            de: formData.title_de,
            ru: formData.title_ru,
          },
          description: {
            en: formData.description_en,
            de: formData.description_de,
            ru: formData.description_ru,
          },
          duration: formData.duration,
          price: formData.price,
          tour_type: formData.tour_type,
          status: formData.status,
          group_size: formData.group_size,
          is_bestseller: formData.is_bestseller,
          main_image: formData.main_image,
          gallery_images: formData.gallery_images,
          included: {
            en: formData.included_en,
            de: formData.included_de,
            ru: formData.included_ru,
          },
          notIncluded: {
            en: formData.not_included_en,
            de: formData.not_included_de,
            ru: formData.not_included_ru,
          },
          itinerary: formData.itineraries.map((it) => ({
            day_number: it.day_number,
            title_en: it.title_en,
            title_de: it.title_de,
            title_ru: it.title_ru,
            description_en: it.description_en,
            description_de: it.description_de,
            description_ru: it.description_ru,
          })),
        }),
      });

      if (response.ok) {
        setSuccessMessage('Tour updated successfully!');
        setTimeout(() => {
          router.push('/admin/tours');
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update tour');
      }
    } catch (err) {
      console.error('Error saving tour:', err);
      setError('Failed to save tour');
    } finally {
      setIsSaving(false);
    }
  };

  // Itinerary management
  const addItineraryDay = () => {
    const newDay: Itinerary = {
      day_number: formData.itineraries.length + 1,
      title_en: '',
      title_de: '',
      title_ru: '',
      description_en: '',
      description_de: '',
      description_ru: '',
    };
    handleChange('itineraries', [...formData.itineraries, newDay]);
  };

  const updateItinerary = (index: number, field: keyof Itinerary, value: any) => {
    const updated = [...formData.itineraries];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('itineraries', updated);
  };

  const removeItineraryDay = (index: number) => {
    const updated = formData.itineraries.filter((_, i) => i !== index);
    // Renumber days
    updated.forEach((item, i) => {
      item.day_number = i + 1;
    });
    handleChange('itineraries', updated);
  };

  // Included/Not included management
  const addIncludedItem = (field: 'included_en' | 'included_de' | 'included_ru' | 'not_included_en' | 'not_included_de' | 'not_included_ru') => {
    handleChange(field, [...formData[field], '']);
  };

  const updateIncludedItem = (field: 'included_en' | 'included_de' | 'included_ru' | 'not_included_en' | 'not_included_de' | 'not_included_ru', index: number, value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    handleChange(field, updated);
  };

  const removeIncludedItem = (field: 'included_en' | 'included_de' | 'included_ru' | 'not_included_en' | 'not_included_de' | 'not_included_ru', index: number) => {
    handleChange(field, formData[field].filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (error && !formData.title_en) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/admin/tours" className="text-primary-500 hover:underline">
          Back to Tours
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/tours"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-secondary-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Edit Tour</h1>
          <p className="text-secondary-600">Update tour information</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-secondary-200">
        {[
          { key: 'basic', label: 'Basic Info' },
          { key: 'content', label: 'Content' },
          { key: 'itinerary', label: 'Itinerary' },
          { key: 'images', label: 'Images' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-secondary-600 hover:text-secondary-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-secondary-800 mb-4">Basic Information</h2>

            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Title (English) *
                </label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => {
                    handleChange('title_en', e.target.value);
                    if (!formData.slug || formData.slug === generateSlug(formData.title_en)) {
                      handleChange('slug', generateSlug(e.target.value));
                    }
                  }}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Title (German)
                </label>
                <input
                  type="text"
                  value={formData.title_de}
                  onChange={(e) => handleChange('title_de', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Title (Russian)
                </label>
                <input
                  type="text"
                  value={formData.title_ru}
                  onChange={(e) => handleChange('title_ru', e.target.value)}
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
                <span className="text-secondary-400">/tours/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="flex-1 px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Destination
                </label>
                <select
                  value={formData.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select destination</option>
                  {destinations.map((dest) => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>

              {/* Tour Type */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tour Type
                </label>
                <select
                  value={formData.tour_type}
                  onChange={(e) => handleChange('tour_type', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {tourTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

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
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Duration (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Price (EUR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Group Size */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Users size={16} className="inline mr-1" />
                  Group Size
                </label>
                <input
                  type="text"
                  value={formData.group_size}
                  onChange={(e) => handleChange('group_size', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 2-10"
                />
              </div>
            </div>

            {/* Bestseller */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isBestseller"
                checked={formData.is_bestseller}
                onChange={(e) => handleChange('is_bestseller', e.target.checked)}
                className="w-5 h-5 text-primary-500 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isBestseller" className="text-sm font-medium text-secondary-700">
                Mark as Bestseller
              </label>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
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

            {/* Included */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-secondary-800">What's Included (English)</h2>
              {formData.included_en.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateIncludedItem('included_en', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Hotel accommodation"
                  />
                  <button
                    type="button"
                    onClick={() => removeIncludedItem('included_en', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addIncludedItem('included_en')}
                className="flex items-center gap-2 text-primary-500 hover:text-primary-600"
              >
                <Plus size={18} /> Add item
              </button>
            </div>

            {/* Not Included */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-secondary-800">Not Included (English)</h2>
              {formData.not_included_en.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateIncludedItem('not_included_en', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., International flights"
                  />
                  <button
                    type="button"
                    onClick={() => removeIncludedItem('not_included_en', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addIncludedItem('not_included_en')}
                className="flex items-center gap-2 text-primary-500 hover:text-primary-600"
              >
                <Plus size={18} /> Add item
              </button>
            </div>
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-800">Daily Itinerary</h2>
              <button
                type="button"
                onClick={addItineraryDay}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                <Plus size={18} /> Add Day
              </button>
            </div>

            {formData.itineraries.length === 0 ? (
              <p className="text-secondary-500 text-center py-8">
                No itinerary days added yet. Click "Add Day" to start.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.itineraries.map((day, index) => (
                  <div key={index} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {day.day_number}
                        </span>
                        <span className="font-medium">Day {day.day_number}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <input
                        type="text"
                        value={day.title_en}
                        onChange={(e) => updateItinerary(index, 'title_en', e.target.value)}
                        className="px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Title (English)"
                      />
                      <input
                        type="text"
                        value={day.title_de}
                        onChange={(e) => updateItinerary(index, 'title_de', e.target.value)}
                        className="px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Title (German)"
                      />
                      <input
                        type="text"
                        value={day.title_ru}
                        onChange={(e) => updateItinerary(index, 'title_ru', e.target.value)}
                        className="px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Title (Russian)"
                      />
                    </div>

                    <textarea
                      value={day.description_en}
                      onChange={(e) => updateItinerary(index, 'description_en', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Description (English)"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-secondary-800">Images</h2>

            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Main Image URL
              </label>
              <input
                type="text"
                value={formData.main_image}
                onChange={(e) => handleChange('main_image', e.target.value)}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://..."
              />
              {formData.main_image && (
                <img
                  src={formData.main_image}
                  alt="Main"
                  className="mt-2 w-48 h-32 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Gallery Images
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.gallery_images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.gallery_images.filter((_, i) => i !== index);
                        handleChange('gallery_images', updated);
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            {successMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Link
            href="/admin/tours"
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
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
