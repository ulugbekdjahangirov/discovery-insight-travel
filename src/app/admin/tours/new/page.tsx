'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  Globe,
  MapPin,
  Clock,
  DollarSign,
  Users,
  FileText,
  Calendar,
  Upload,
  X,
  Loader2
} from 'lucide-react';

interface TourFormData {
  title: { en: string; de: string; ru: string };
  slug: string;
  destination: string;
  duration: number;
  price: number;
  type: 'cultural' | 'adventure' | 'historical' | 'group' | 'private';
  status: 'active' | 'inactive' | 'draft';
  groupSize: string;
  isBestseller: boolean;
  description: { en: string; de: string; ru: string };
  included: { en: string[]; de: string[]; ru: string[] };
  notIncluded: { en: string[]; de: string[]; ru: string[] };
  itinerary: {
    day: number;
    title: { en: string; de: string; ru: string };
    description: { en: string; de: string; ru: string };
  }[];
  mainImage: string;
  galleryImages: string[];
}

const initialFormData: TourFormData = {
  title: { en: '', de: '', ru: '' },
  slug: '',
  destination: '',
  duration: 1,
  price: 0,
  type: 'cultural',
  status: 'draft',
  groupSize: '2-10',
  isBestseller: false,
  description: { en: '', de: '', ru: '' },
  included: { en: [''], de: [''], ru: [''] },
  notIncluded: { en: [''], de: [''], ru: [''] },
  itinerary: [],
  mainImage: '',
  galleryImages: [],
};

const MAX_GALLERY_IMAGES = 10;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const steps = [
  { id: 1, title: 'Basic Info', icon: FileText },
  { id: 2, title: 'Description', icon: Globe },
  { id: 3, title: 'Itinerary', icon: Calendar },
  { id: 4, title: 'Images', icon: ImageIcon },
];

const tourTypes = [
  { value: 'cultural', label: 'Cultural' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'historical', label: 'Historical' },
  { value: 'group', label: 'Group' },
  { value: 'private', label: 'Private' },
];

interface Destination {
  id: number;
  slug: string;
  name_en: string;
  name_de: string;
  name_ru: string;
  status: string;
}

export default function NewTourPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TourFormData>(initialFormData);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'de' | 'ru'>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations?status=active');
        if (response.ok) {
          const data = await response.json();
          setDestinations(data || []);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };
    fetchDestinations();
  }, []);

  // Generate slug from English title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Update multilingual field
  const updateMultilingualField = (
    field: 'title' | 'description',
    lang: 'en' | 'de' | 'ru',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
    // Auto-generate slug from English title
    if (field === 'title' && lang === 'en') {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  // Update included/notIncluded arrays
  const updateListItem = (
    field: 'included' | 'notIncluded',
    lang: 'en' | 'de' | 'ru',
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newList = [...prev[field][lang]];
      newList[index] = value;
      return {
        ...prev,
        [field]: { ...prev[field], [lang]: newList },
      };
    });
  };

  const addListItem = (field: 'included' | 'notIncluded') => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        en: [...prev[field].en, ''],
        de: [...prev[field].de, ''],
        ru: [...prev[field].ru, ''],
      },
    }));
  };

  const removeListItem = (field: 'included' | 'notIncluded', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        en: prev[field].en.filter((_, i) => i !== index),
        de: prev[field].de.filter((_, i) => i !== index),
        ru: prev[field].ru.filter((_, i) => i !== index),
      },
    }));
  };

  // Itinerary management
  const addItineraryDay = () => {
    const newDay = {
      day: formData.itinerary.length + 1,
      title: { en: '', de: '', ru: '' },
      description: { en: '', de: '', ru: '' },
    };
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay],
    }));
  };

  const updateItineraryDay = (
    index: number,
    field: 'title' | 'description',
    lang: 'en' | 'de' | 'ru',
    value: string
  ) => {
    setFormData((prev) => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = {
        ...newItinerary[index],
        [field]: { ...newItinerary[index][field], [lang]: value },
      };
      return { ...prev, itinerary: newItinerary };
    });
  };

  const removeItineraryDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, day: i + 1 })),
    }));
  };

  // Image upload functions
  const uploadFile = async (file: File): Promise<string | null> => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, upload: 'Fayl turi noto\'g\'ri. Ruxsat etilgan: JPG, PNG, WebP, GIF' }));
      return null;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, upload: 'Fayl hajmi juda katta. Maksimum 5MB' }));
      return null;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.upload;
        return newErrors;
      });
      return data.url;
    } catch (error) {
      setErrors((prev) => ({ ...prev, upload: 'Rasm yuklanmadi. Qaytadan urinib ko\'ring.' }));
      return null;
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    const url = await uploadFile(file);
    if (url) {
      setFormData((prev) => ({ ...prev, mainImage: url }));
    }
    setUploadingMain(false);
    e.target.value = '';
  };

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_GALLERY_IMAGES - formData.galleryImages.length;
    if (files.length > remainingSlots) {
      setErrors((prev) => ({ ...prev, upload: `Faqat ${remainingSlots} ta rasm qo'shish mumkin` }));
      return;
    }

    setUploadingGallery(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploadedUrls],
      }));
    }
    setUploadingGallery(false);
    e.target.value = '';
  };

  const removeMainImage = () => {
    setFormData((prev) => ({ ...prev, mainImage: '' }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMainImageDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    const url = await uploadFile(file);
    if (url) {
      setFormData((prev) => ({ ...prev, mainImage: url }));
    }
    setUploadingMain(false);
  };

  const handleGalleryDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_GALLERY_IMAGES - formData.galleryImages.length;
    if (files.length > remainingSlots) {
      setErrors((prev) => ({ ...prev, upload: `Faqat ${remainingSlots} ta rasm qo'shish mumkin` }));
      return;
    }

    setUploadingGallery(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploadedUrls],
      }));
    }
    setUploadingGallery(false);
  };

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.en) newErrors.titleEn = 'English title is required';
      if (!formData.slug) newErrors.slug = 'Slug is required';
      if (!formData.destination) newErrors.destination = 'Destination is required';
      if (formData.duration < 1) newErrors.duration = 'Duration must be at least 1 day';
      if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    }

    if (step === 2) {
      if (!formData.description.en) newErrors.descriptionEn = 'English description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    // Validate main image
    if (!formData.mainImage) {
      setErrors({ upload: 'Asosiy rasmni yuklang' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine mainImage and galleryImages into images array
      const allImages = [formData.mainImage, ...formData.galleryImages];

      // Filter out empty values
      const cleanedData = {
        ...formData,
        included: {
          en: formData.included.en.filter((item) => item.trim()),
          de: formData.included.de.filter((item) => item.trim()),
          ru: formData.included.ru.filter((item) => item.trim()),
        },
        notIncluded: {
          en: formData.notIncluded.en.filter((item) => item.trim()),
          de: formData.notIncluded.de.filter((item) => item.trim()),
          ru: formData.notIncluded.ru.filter((item) => item.trim()),
        },
        images: allImages,
      };

      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        router.push('/admin/tours');
      } else {
        throw new Error('Failed to create tour');
      }
    } catch (error) {
      console.error('Error creating tour:', error);
      setErrors({ submit: 'Failed to create tour. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Language tabs component
  const LanguageTabs = () => (
    <div className="flex gap-2 mb-4">
      {(['en', 'de', 'ru'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setActiveLanguage(lang)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeLanguage === lang
              ? 'bg-primary-500 text-white'
              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/tours"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-secondary-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Create New Tour</h1>
          <p className="text-secondary-600">Fill in the details to create a new tour package</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-100 text-secondary-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check size={24} />
                  ) : (
                    <step.icon size={24} />
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-secondary-800' : 'text-secondary-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-4 rounded ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-secondary-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">Basic Information</h2>

            <LanguageTabs />

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tour Title ({activeLanguage.toUpperCase()}) *
              </label>
              <input
                type="text"
                value={formData.title[activeLanguage]}
                onChange={(e) => updateMultilingualField('title', activeLanguage, e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.titleEn && activeLanguage === 'en' ? 'border-red-500' : 'border-secondary-200'
                }`}
                placeholder={`Enter tour title in ${activeLanguage.toUpperCase()}`}
              />
              {errors.titleEn && activeLanguage === 'en' && (
                <p className="text-red-500 text-sm mt-1">{errors.titleEn}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                URL Slug *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-secondary-400">/tours/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => updateFormData('slug', e.target.value)}
                  className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.slug ? 'border-red-500' : 'border-secondary-200'
                  }`}
                  placeholder="tour-url-slug"
                />
              </div>
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Destination *
                </label>
                <select
                  value={formData.destination}
                  onChange={(e) => updateFormData('destination', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.destination ? 'border-red-500' : 'border-secondary-200'
                  }`}
                >
                  <option value="">Select destination</option>
                  {destinations.map((dest) => (
                    <option key={dest.id} value={dest.name_en}>{dest.name_en}</option>
                  ))}
                </select>
                {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
              </div>

              {/* Tour Type */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tour Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => updateFormData('type', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {tourTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Duration (days) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => updateFormData('duration', parseInt(e.target.value) || 1)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.duration ? 'border-red-500' : 'border-secondary-200'
                  }`}
                />
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Price (EUR) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => updateFormData('price', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.price ? 'border-red-500' : 'border-secondary-200'
                  }`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              {/* Group Size */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Users size={16} className="inline mr-1" />
                  Group Size
                </label>
                <input
                  type="text"
                  value={formData.groupSize}
                  onChange={(e) => updateFormData('groupSize', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 2-10 people"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateFormData('status', e.target.value)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Bestseller */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isBestseller"
                checked={formData.isBestseller}
                onChange={(e) => updateFormData('isBestseller', e.target.checked)}
                className="w-5 h-5 text-primary-500 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isBestseller" className="text-sm font-medium text-secondary-700">
                Mark as Bestseller
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Description & Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-secondary-800 mb-4">Description & Details</h2>

            <LanguageTabs />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description ({activeLanguage.toUpperCase()}) *
              </label>
              <textarea
                value={formData.description[activeLanguage]}
                onChange={(e) => updateMultilingualField('description', activeLanguage, e.target.value)}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.descriptionEn && activeLanguage === 'en' ? 'border-red-500' : 'border-secondary-200'
                }`}
                placeholder={`Enter tour description in ${activeLanguage.toUpperCase()}`}
              />
              {errors.descriptionEn && activeLanguage === 'en' && (
                <p className="text-red-500 text-sm mt-1">{errors.descriptionEn}</p>
              )}
            </div>

            {/* What's Included */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                What&apos;s Included ({activeLanguage.toUpperCase()})
              </label>
              {formData.included[activeLanguage].map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem('included', activeLanguage, index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Hotel accommodation"
                  />
                  {formData.included[activeLanguage].length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem('included', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('included')}
                className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>

            {/* What's Not Included */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                What&apos;s Not Included ({activeLanguage.toUpperCase()})
              </label>
              {formData.notIncluded[activeLanguage].map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem('notIncluded', activeLanguage, index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., International flights"
                  />
                  {formData.notIncluded[activeLanguage].length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem('notIncluded', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('notIncluded')}
                className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Itinerary */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-secondary-800">Itinerary</h2>
              <span className="text-secondary-500">
                Tour duration: {formData.duration} days
              </span>
            </div>

            <LanguageTabs />

            {formData.itinerary.length === 0 ? (
              <div className="text-center py-12 bg-secondary-50 rounded-lg">
                <Calendar size={48} className="mx-auto text-secondary-300 mb-4" />
                <p className="text-secondary-500 mb-4">No itinerary days added yet</p>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="btn-primary"
                >
                  <Plus size={18} className="inline mr-2" />
                  Add First Day
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.itinerary.map((day, index) => (
                  <div key={index} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-secondary-800">
                        Day {day.day}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Day Title ({activeLanguage.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={day.title[activeLanguage]}
                          onChange={(e) => updateItineraryDay(index, 'title', activeLanguage, e.target.value)}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="e.g., Arrival in Tashkent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Day Description ({activeLanguage.toUpperCase()})
                        </label>
                        <textarea
                          value={day.description[activeLanguage]}
                          onChange={(e) => updateItineraryDay(index, 'description', activeLanguage, e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Describe what happens on this day..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="w-full py-3 border-2 border-dashed border-secondary-300 rounded-lg text-secondary-500 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Day {formData.itinerary.length + 1}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Images */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-secondary-800 mb-2">Tour Images</h2>
              <p className="text-secondary-500">
                Rasmlarni yuklang. Ruxsat etilgan formatlar: JPG, PNG, WebP, GIF (max 5MB)
              </p>
            </div>

            {/* Error message */}
            {errors.upload && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {errors.upload}
              </div>
            )}

            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Asosiy Rasm (Main Image) *
              </label>

              {formData.mainImage ? (
                <div className="relative inline-block">
                  <img
                    src={formData.mainImage}
                    alt="Main tour image"
                    className="w-64 h-48 object-cover rounded-lg border border-secondary-200"
                  />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleMainImageDrop}
                  className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    id="mainImage"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="mainImage" className="cursor-pointer">
                    {uploadingMain ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={48} className="text-primary-500 animate-spin mb-3" />
                        <span className="text-secondary-600">Yuklanmoqda...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload size={48} className="text-secondary-300 mb-3" />
                        <span className="text-secondary-600 font-medium">
                          Rasm yuklash uchun bosing yoki shu yerga tashlang
                        </span>
                        <span className="text-secondary-400 text-sm mt-1">
                          JPG, PNG, WebP, GIF (max 5MB)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Gallery Images Upload */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-secondary-700">
                  Galereya Rasmlari (Gallery)
                </label>
                <span className="text-sm text-secondary-500">
                  {formData.galleryImages.length} / {MAX_GALLERY_IMAGES}
                </span>
              </div>

              {/* Gallery Grid */}
              {formData.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                  {formData.galleryImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-secondary-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area for Gallery */}
              {formData.galleryImages.length < MAX_GALLERY_IMAGES && (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleGalleryDrop}
                  className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    id="galleryImages"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleGalleryImagesUpload}
                    className="hidden"
                  />
                  <label htmlFor="galleryImages" className="cursor-pointer">
                    {uploadingGallery ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={36} className="text-primary-500 animate-spin mb-2" />
                        <span className="text-secondary-600">Yuklanmoqda...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Plus size={36} className="text-secondary-300 mb-2" />
                        <span className="text-secondary-600 font-medium">
                          Galereya uchun rasmlar qo&apos;shing
                        </span>
                        <span className="text-secondary-400 text-sm mt-1">
                          Bir nechta rasm tanlash mumkin (max {MAX_GALLERY_IMAGES - formData.galleryImages.length} ta)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error message */}
        {errors.submit && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {errors.submit}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            currentStep === 1
              ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
              : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
          }`}
        >
          <ArrowLeft size={20} />
          Previous
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Next
            <ArrowRight size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <Check size={20} />
                Create Tour
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
