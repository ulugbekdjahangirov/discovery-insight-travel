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
  Upload,
  X,
  HelpCircle,
  Search,
  Sparkles,
  RefreshCw,
  FileText,
  Globe,
  Check,
} from 'lucide-react';

const MAX_GALLERY_IMAGES = 10;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface Itinerary {
  id?: number;
  day_number: number;
  title_en: string;
  title_de: string;
  title_ru: string;
  description_en: string;
  description_de: string;
  description_ru: string;
  image: string;
}

interface ImageWithAlt {
  url: string;
  alt: string;
}

interface FaqItem {
  question: { en: string; de: string; ru: string };
  answer: { en: string; de: string; ru: string };
}

interface SeoData {
  metaTitle: { en: string; de: string; ru: string };
  metaDescription: { en: string; de: string; ru: string };
  keywords: { en: string; de: string; ru: string };
  ogImage: string;
  canonicalUrl: string;
}

interface Tour {
  id: number;
  slug: string;
  destination: string;
  category_id: number | null;
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
  enable_private_tour: boolean;
  enable_group_tour: boolean;
  private_tour_prices: { personsFrom: number; personsTo: number; price: number }[];
  group_tour_prices: { personsFrom: number; personsTo: number; price: number }[];
  main_image: string;
  main_image_alt: string;
  gallery_images: ImageWithAlt[];
  route_images: ImageWithAlt[];
  highlights_en: string;
  highlights_de: string;
  highlights_ru: string;
  included_en: string[];
  included_de: string[];
  included_ru: string[];
  not_included_en: string[];
  not_included_de: string[];
  not_included_ru: string[];
  itineraries: Itinerary[];
  faq: FaqItem[];
  seo: SeoData;
}

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

interface TourCategory {
  id: number;
  slug: string;
  name_en: string;
  name_de: string;
  name_ru: string;
}

export default function EditTourPage() {
  const router = useRouter();
  const params = useParams();
  const tourId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'itinerary' | 'images' | 'faq' | 'seo'>('basic');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingRoutes, setUploadingRoutes] = useState(false);
  const [uploadingItineraryIndex, setUploadingItineraryIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');

  const [formData, setFormData] = useState<Tour>({
    id: 0,
    slug: '',
    destination: '',
    category_id: null,
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
    enable_private_tour: true,
    enable_group_tour: false,
    private_tour_prices: [{ personsFrom: 1, personsTo: 1, price: 0 }],
    group_tour_prices: [{ personsFrom: 1, personsTo: 5, price: 0 }],
    main_image: '',
    main_image_alt: '',
    gallery_images: [],
    route_images: [],
    highlights_en: '',
    highlights_de: '',
    highlights_ru: '',
    included_en: [],
    included_de: [],
    included_ru: [],
    not_included_en: [],
    not_included_de: [],
    not_included_ru: [],
    itineraries: [],
    faq: [],
    seo: {
      metaTitle: { en: '', de: '', ru: '' },
      metaDescription: { en: '', de: '', ru: '' },
      keywords: { en: '', de: '', ru: '' },
      ogImage: '',
      canonicalUrl: '',
    },
  });

  // Helper function to convert images to new format
  const normalizeImages = (images: any[]): ImageWithAlt[] => {
    if (!images || !Array.isArray(images)) return [];
    return images.map((img: any) =>
      typeof img === 'string' ? { url: img, alt: '' } : { url: img.url || '', alt: img.alt || '' }
    );
  };

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
            category_id: tour.category_id || null,
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
            enable_private_tour: tour.enable_private_tour ?? true,
            enable_group_tour: tour.enable_group_tour ?? false,
            private_tour_prices: tour.private_tour_prices || [{ personsFrom: 1, personsTo: 1, price: 0 }],
            group_tour_prices: tour.group_tour_prices || [{ personsFrom: 1, personsTo: 5, price: 0 }],
            main_image: tour.main_image || '',
            main_image_alt: tour.main_image_alt || '',
            gallery_images: normalizeImages(tour.gallery_images),
            route_images: normalizeImages(tour.route_images),
            highlights_en: tour.highlights_en || '',
            highlights_de: tour.highlights_de || '',
            highlights_ru: tour.highlights_ru || '',
            included_en: tour.included_en || [],
            included_de: tour.included_de || [],
            included_ru: tour.included_ru || [],
            not_included_en: tour.not_included_en || [],
            not_included_de: tour.not_included_de || [],
            not_included_ru: tour.not_included_ru || [],
            itineraries: tour.itineraries || [],
            faq: tour.faq || [],
            seo: {
              metaTitle: {
                en: tour.seo_meta_title_en || '',
                de: tour.seo_meta_title_de || '',
                ru: tour.seo_meta_title_ru || '',
              },
              metaDescription: {
                en: tour.seo_meta_description_en || '',
                de: tour.seo_meta_description_de || '',
                ru: tour.seo_meta_description_ru || '',
              },
              keywords: {
                en: tour.seo_keywords_en || '',
                de: tour.seo_keywords_de || '',
                ru: tour.seo_keywords_ru || '',
              },
              ogImage: tour.seo_og_image || '',
              canonicalUrl: tour.seo_canonical_url || '',
            },
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

  // Fetch destinations and categories from API
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

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/tour-categories?status=active');
        if (response.ok) {
          const data = await response.json();
          setCategories(data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchDestinations();
    fetchCategories();
  }, []);

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

  // Image upload functions
  const uploadFile = async (file: File): Promise<string | null> => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setUploadError('Fayl turi noto\'g\'ri. Ruxsat etilgan: JPG, PNG, WebP, GIF');
      return null;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('Fayl hajmi juda katta. Maksimum 5MB');
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
      setUploadError('');
      return data.url;
    } catch (error) {
      setUploadError('Rasm yuklanmadi. Qaytadan urinib ko\'ring.');
      return null;
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    const url = await uploadFile(file);
    if (url) {
      handleChange('main_image', url);
    }
    setUploadingMain(false);
    e.target.value = '';
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_GALLERY_IMAGES - formData.gallery_images.length;
    if (files.length > remainingSlots) {
      setUploadError(`Faqat ${remainingSlots} ta rasm qo'shish mumkin`);
      return;
    }

    setUploadingGallery(true);
    const uploadedImages: ImageWithAlt[] = [];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        uploadedImages.push({ url, alt: '' });
      }
    }

    if (uploadedImages.length > 0) {
      handleChange('gallery_images', [...formData.gallery_images, ...uploadedImages]);
    }
    setUploadingGallery(false);
    e.target.value = '';
  };

  const updateGalleryImageAlt = (index: number, alt: string) => {
    const updated = [...formData.gallery_images];
    updated[index] = { ...updated[index], alt };
    handleChange('gallery_images', updated);
  };

  const handleRouteImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_GALLERY_IMAGES - formData.route_images.length;
    if (files.length > remainingSlots) {
      setUploadError(`Faqat ${remainingSlots} ta marshrut rasmi qo'shish mumkin`);
      return;
    }

    setUploadingRoutes(true);
    const uploadedImages: ImageWithAlt[] = [];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        uploadedImages.push({ url, alt: '' });
      }
    }

    if (uploadedImages.length > 0) {
      handleChange('route_images', [...formData.route_images, ...uploadedImages]);
    }
    setUploadingRoutes(false);
    e.target.value = '';
  };

  const updateRouteImageAlt = (index: number, alt: string) => {
    const updated = [...formData.route_images];
    updated[index] = { ...updated[index], alt };
    handleChange('route_images', updated);
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
          categoryId: formData.category_id,
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
          enablePrivateTour: formData.enable_private_tour,
          enableGroupTour: formData.enable_group_tour,
          privateTourPrices: formData.private_tour_prices,
          groupTourPrices: formData.group_tour_prices,
          main_image: formData.main_image,
          mainImageAlt: formData.main_image_alt,
          galleryImages: formData.gallery_images,
          routeImages: formData.route_images,
          highlights: {
            en: formData.highlights_en,
            de: formData.highlights_de,
            ru: formData.highlights_ru,
          },
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
            image: it.image || '',
          })),
          // FAQ - filter out empty questions
          faq: formData.faq.filter((item) =>
            item.question.en.trim() || item.question.de.trim() || item.question.ru.trim()
          ),
          // SEO data
          seo: formData.seo,
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
      image: '',
    };
    handleChange('itineraries', [...formData.itineraries, newDay]);
  };

  const handleItineraryImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingItineraryIndex(index);
    const url = await uploadFile(file);
    if (url) {
      updateItinerary(index, 'image', url);
    }
    setUploadingItineraryIndex(null);
    e.target.value = '';
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

  // Private Tour Prices management
  const addPrivateTourPrice = () => {
    const lastTo = formData.private_tour_prices.length > 0
      ? formData.private_tour_prices[formData.private_tour_prices.length - 1].personsTo + 1
      : 1;
    handleChange('private_tour_prices', [...formData.private_tour_prices, { personsFrom: lastTo, personsTo: lastTo, price: 0 }]);
  };

  const updatePrivateTourPrice = (index: number, field: 'personsFrom' | 'personsTo' | 'price', value: number) => {
    const updated = [...formData.private_tour_prices];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('private_tour_prices', updated);
  };

  const removePrivateTourPrice = (index: number) => {
    handleChange('private_tour_prices', formData.private_tour_prices.filter((_, i) => i !== index));
  };

  // Group Tour Prices management
  const addGroupTourPrice = () => {
    const lastTo = formData.group_tour_prices.length > 0
      ? formData.group_tour_prices[formData.group_tour_prices.length - 1].personsTo + 1
      : 1;
    handleChange('group_tour_prices', [...formData.group_tour_prices, { personsFrom: lastTo, personsTo: lastTo + 4, price: 0 }]);
  };

  const updateGroupTourPrice = (index: number, field: 'personsFrom' | 'personsTo' | 'price', value: number) => {
    const updated = [...formData.group_tour_prices];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('group_tour_prices', updated);
  };

  const removeGroupTourPrice = (index: number) => {
    handleChange('group_tour_prices', formData.group_tour_prices.filter((_, i) => i !== index));
  };

  // Included/Not included management
  type ListField = 'included_en' | 'included_de' | 'included_ru' | 'not_included_en' | 'not_included_de' | 'not_included_ru';

  const addIncludedItem = (field: ListField) => {
    handleChange(field, [...formData[field], '']);
  };

  const updateIncludedItem = (field: ListField, index: number, value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    handleChange(field, updated);
  };

  const removeIncludedItem = (field: ListField, index: number) => {
    handleChange(field, formData[field].filter((_, i) => i !== index));
  };

  // FAQ management
  const [activeFaqLang, setActiveFaqLang] = useState<'en' | 'de' | 'ru'>('en');

  const addFaqItem = () => {
    const newFaq: FaqItem = {
      question: { en: '', de: '', ru: '' },
      answer: { en: '', de: '', ru: '' },
    };
    handleChange('faq', [...formData.faq, newFaq]);
  };

  const updateFaqItem = (
    index: number,
    field: 'question' | 'answer',
    lang: 'en' | 'de' | 'ru',
    value: string
  ) => {
    const newFaq = [...formData.faq];
    newFaq[index] = {
      ...newFaq[index],
      [field]: { ...newFaq[index][field], [lang]: value },
    };
    handleChange('faq', newFaq);
  };

  const removeFaqItem = (index: number) => {
    handleChange('faq', formData.faq.filter((_, i) => i !== index));
  };

  // SEO management
  const [seoLanguage, setSeoLanguage] = useState<'en' | 'de' | 'ru'>('en');
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);

  const updateSeoField = (
    field: 'metaTitle' | 'metaDescription' | 'keywords',
    lang: 'en' | 'de' | 'ru',
    value: string
  ) => {
    handleChange('seo', {
      ...formData.seo,
      [field]: { ...formData.seo[field], [lang]: value },
    });
  };

  const updateSeoSimpleField = (field: 'ogImage' | 'canonicalUrl', value: string) => {
    handleChange('seo', { ...formData.seo, [field]: value });
  };

  const generateSeoWithAI = async () => {
    setIsGeneratingSeo(true);
    try {
      const tourData = {
        title: {
          en: formData.title_en,
          de: formData.title_de,
          ru: formData.title_ru,
        },
        destination: formData.destination,
        duration: formData.duration,
        type: formData.tour_type,
        description: {
          en: formData.description_en,
          de: formData.description_de,
          ru: formData.description_ru,
        },
        highlights: {
          en: formData.highlights_en,
          de: formData.highlights_de,
          ru: formData.highlights_ru,
        },
        included: {
          en: formData.included_en,
          de: formData.included_de,
          ru: formData.included_ru,
        },
        itinerary: formData.itineraries.map(it => ({
          day: it.day_number,
          title: { en: it.title_en, de: it.title_de, ru: it.title_ru },
          description: { en: it.description_en, de: it.description_de, ru: it.description_ru },
        })),
        faq: formData.faq,
      };

      const response = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tourData, language: seoLanguage }),
      });

      if (response.ok) {
        const data = await response.json();
        handleChange('seo', {
          ...formData.seo,
          metaTitle: {
            ...formData.seo.metaTitle,
            [seoLanguage]: data.metaTitle || formData.seo.metaTitle[seoLanguage],
          },
          metaDescription: {
            ...formData.seo.metaDescription,
            [seoLanguage]: data.metaDescription || formData.seo.metaDescription[seoLanguage],
          },
          keywords: {
            ...formData.seo.keywords,
            [seoLanguage]: data.keywords || formData.seo.keywords[seoLanguage],
          },
        });
      }
    } catch (error) {
      console.error('Error generating SEO:', error);
    } finally {
      setIsGeneratingSeo(false);
    }
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
          { key: 'faq', label: 'FAQ' },
          { key: 'seo', label: 'SEO' },
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
                    <option key={dest.id} value={dest.name_en}>{dest.name_en}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Kategoriya
                </label>
                <select
                  value={formData.category_id || ''}
                  onChange={(e) => handleChange('category_id', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Kategoriyani tanlang</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name_en}</option>
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

            {/* Pricing Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Private Tour Prices */}
              <div className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-secondary-800">Private Tour Prices</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enable_private_tour}
                      onChange={(e) => handleChange('enable_private_tour', e.target.checked)}
                      className="w-4 h-4 text-primary-500 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-600">Enable</span>
                  </label>
                </div>

                {formData.enable_private_tour && (
                  <>
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-secondary-500 px-1">
                        <div className="col-span-3">From</div>
                        <div className="col-span-3">To</div>
                        <div className="col-span-4">Price (EUR)</div>
                        <div className="col-span-2"></div>
                      </div>
                      {formData.private_tour_prices.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                          <input
                            type="number"
                            min="1"
                            value={item.personsFrom}
                            onChange={(e) => updatePrivateTourPrice(index, 'personsFrom', parseInt(e.target.value) || 1)}
                            className="col-span-3 px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="number"
                            min="1"
                            value={item.personsTo}
                            onChange={(e) => updatePrivateTourPrice(index, 'personsTo', parseInt(e.target.value) || 1)}
                            className="col-span-3 px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(e) => updatePrivateTourPrice(index, 'price', parseInt(e.target.value) || 0)}
                            className="col-span-4 px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <button
                            type="button"
                            onClick={() => removePrivateTourPrice(index)}
                            className="col-span-2 p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30"
                            disabled={formData.private_tour_prices.length === 1}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addPrivateTourPrice}
                      className="mt-3 flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600"
                    >
                      <Plus size={16} /> Add Price
                    </button>
                  </>
                )}
              </div>

              {/* Group Tour Prices */}
              <div className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-secondary-800">Group Tour Prices</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enable_group_tour}
                      onChange={(e) => handleChange('enable_group_tour', e.target.checked)}
                      className="w-4 h-4 text-primary-500 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-600">Enable</span>
                  </label>
                </div>

                {formData.enable_group_tour && (
                  <>
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-secondary-500 px-1">
                        <div className="col-span-3">From</div>
                        <div className="col-span-3">To</div>
                        <div className="col-span-4">Price (EUR)</div>
                        <div className="col-span-2"></div>
                      </div>
                      {formData.group_tour_prices.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                          <input
                            type="number"
                            min="1"
                            value={item.personsFrom}
                            onChange={(e) => updateGroupTourPrice(index, 'personsFrom', parseInt(e.target.value) || 1)}
                            className="col-span-3 px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="number"
                            min="1"
                            value={item.personsTo}
                            onChange={(e) => updateGroupTourPrice(index, 'personsTo', parseInt(e.target.value) || 1)}
                            className="col-span-3 px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(e) => updateGroupTourPrice(index, 'price', parseInt(e.target.value) || 0)}
                            className="col-span-4 px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeGroupTourPrice(index)}
                            className="col-span-2 p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30"
                            disabled={formData.group_tour_prices.length === 1}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addGroupTourPrice}
                      className="mt-3 flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600"
                    >
                      <Plus size={16} /> Add Price
                    </button>
                  </>
                )}
              </div>
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

            {/* Highlights */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-secondary-800">Highlights</h2>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Highlights (English)
                </label>
                <textarea
                  value={formData.highlights_en}
                  onChange={(e) => handleChange('highlights_en', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter tour highlights..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Highlights (German)
                </label>
                <textarea
                  value={formData.highlights_de}
                  onChange={(e) => handleChange('highlights_de', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Höhepunkte eingeben..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Highlights (Russian)
                </label>
                <textarea
                  value={formData.highlights_ru}
                  onChange={(e) => handleChange('highlights_ru', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Введите основные моменты..."
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

                    {/* Day Image */}
                    <div className="mb-4">
                      <label className="block text-xs text-secondary-500 mb-2">Kun rasmi (Day Image)</label>
                      {day.image ? (
                        <div className="relative inline-block">
                          <img
                            src={day.image}
                            alt={`Day ${day.day_number}`}
                            className="w-40 h-28 object-cover rounded-lg border border-secondary-200"
                          />
                          <button
                            type="button"
                            onClick={() => updateItinerary(index, 'image', '')}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="inline-block">
                          <input
                            type="file"
                            id={`itinerary-image-edit-${index}`}
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={(e) => handleItineraryImageUpload(index, e)}
                            className="hidden"
                          />
                          <label
                            htmlFor={`itinerary-image-edit-${index}`}
                            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-secondary-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                          >
                            {uploadingItineraryIndex === index ? (
                              <>
                                <Loader2 size={18} className="animate-spin text-primary-500" />
                                <span className="text-secondary-600">Yuklanmoqda...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={18} className="text-secondary-400" />
                                <span className="text-secondary-600">Rasm yuklash</span>
                              </>
                            )}
                          </label>
                        </div>
                      )}
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

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs text-secondary-500 mb-1">Description (English)</label>
                        <textarea
                          value={day.description_en}
                          onChange={(e) => updateItinerary(index, 'description_en', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Description (English)"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-secondary-500 mb-1">Description (German)</label>
                        <textarea
                          value={day.description_de}
                          onChange={(e) => updateItinerary(index, 'description_de', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Beschreibung (Deutsch)"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-secondary-500 mb-1">Description (Russian)</label>
                        <textarea
                          value={day.description_ru}
                          onChange={(e) => updateItinerary(index, 'description_ru', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Описание (Русский)"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-secondary-800">Tour Images</h2>
              <p className="text-secondary-500 text-sm">Rasmlarni yuklang. Ruxsat etilgan formatlar: JPG, PNG, WebP, GIF (max 5MB)</p>
            </div>

            {/* Upload Error */}
            {uploadError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {uploadError}
              </div>
            )}

            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Asosiy Rasm (Main Image) *
              </label>

              {formData.main_image ? (
                <div className="flex gap-4 items-start">
                  <div className="relative">
                    <img
                      src={formData.main_image}
                      alt={formData.main_image_alt || "Main tour image"}
                      className="w-48 h-36 object-cover rounded-lg border border-secondary-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleChange('main_image', '')}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X size={16} />
                    </button>
                    <p className="mt-1 text-xs text-secondary-500 truncate max-w-[192px]" title={formData.main_image.split('/').pop()}>
                      {formData.main_image.split('/').pop()}
                    </p>
                  </div>
                  <div className="flex-1 max-w-xs">
                    <label className="block text-xs text-secondary-500 mb-1">Alt Text (SEO uchun)</label>
                    <input
                      type="text"
                      value={formData.main_image_alt}
                      onChange={(e) => handleChange('main_image_alt', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Rasmni tavsiflovchi matn"
                    />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    id="mainImageEdit"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="mainImageEdit" className="cursor-pointer">
                    {uploadingMain ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={48} className="text-primary-500 animate-spin mb-3" />
                        <span className="text-secondary-600">Yuklanmoqda...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload size={48} className="text-secondary-300 mb-3" />
                        <span className="text-secondary-600 font-medium">Rasm yuklash uchun bosing</span>
                        <span className="text-secondary-400 text-sm mt-1">JPG, PNG, WebP, GIF (max 5MB)</span>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-secondary-700">
                  Galereya Rasmlari (Gallery)
                </label>
                <span className="text-sm text-secondary-500">
                  {formData.gallery_images.length} / {MAX_GALLERY_IMAGES}
                </span>
              </div>

              {/* Gallery Grid */}
              {formData.gallery_images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {formData.gallery_images.map((img, index) => (
                    <div key={index} className="flex gap-3 p-3 border border-secondary-200 rounded-lg">
                      <div className="relative flex-shrink-0">
                        <img
                          src={img.url}
                          alt={img.alt || `Gallery image ${index + 1}`}
                          className="w-24 h-20 object-cover rounded-lg border border-secondary-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.gallery_images.filter((_, i) => i !== index);
                            handleChange('gallery_images', updated);
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X size={12} />
                        </button>
                        <p className="mt-1 text-[10px] text-secondary-400 truncate max-w-[96px]" title={img.url.split('/').pop()}>
                          {img.url.split('/').pop()}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs text-secondary-500 mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) => updateGalleryImageAlt(index, e.target.value)}
                          className="w-full px-2 py-1.5 border border-secondary-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Rasm tavsifi"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area for Gallery */}
              {formData.gallery_images.length < MAX_GALLERY_IMAGES && (
                <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    id="galleryImagesEdit"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                  <label htmlFor="galleryImagesEdit" className="cursor-pointer">
                    {uploadingGallery ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={36} className="text-primary-500 animate-spin mb-2" />
                        <span className="text-secondary-600">Yuklanmoqda...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Plus size={36} className="text-secondary-300 mb-2" />
                        <span className="text-secondary-600 font-medium">Galereya uchun rasmlar qo&apos;shing</span>
                        <span className="text-secondary-400 text-sm mt-1">
                          Bir nechta rasm tanlash mumkin (max {MAX_GALLERY_IMAGES - formData.gallery_images.length} ta)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Route Images */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-secondary-700">
                  Marshrut Rasmlari (Tour Routes)
                </label>
                <span className="text-sm text-secondary-500">
                  {formData.route_images.length} / {MAX_GALLERY_IMAGES}
                </span>
              </div>

              {/* Route Images Grid */}
              {formData.route_images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {formData.route_images.map((img, index) => (
                    <div key={index} className="flex gap-3 p-3 border border-secondary-200 rounded-lg">
                      <div className="relative flex-shrink-0">
                        <img
                          src={img.url}
                          alt={img.alt || `Route image ${index + 1}`}
                          className="w-24 h-20 object-cover rounded-lg border border-secondary-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.route_images.filter((_, i) => i !== index);
                            handleChange('route_images', updated);
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X size={12} />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </span>
                        <p className="mt-1 text-[10px] text-secondary-400 truncate max-w-[96px]" title={img.url.split('/').pop()}>
                          {img.url.split('/').pop()}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs text-secondary-500 mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) => updateRouteImageAlt(index, e.target.value)}
                          className="w-full px-2 py-1.5 border border-secondary-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Marshrut rasmi tavsifi"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area for Route Images */}
              {formData.route_images.length < MAX_GALLERY_IMAGES && (
                <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    id="routeImagesEdit"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleRouteImagesUpload}
                    className="hidden"
                  />
                  <label htmlFor="routeImagesEdit" className="cursor-pointer">
                    {uploadingRoutes ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={36} className="text-primary-500 animate-spin mb-2" />
                        <span className="text-secondary-600">Yuklanmoqda...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <MapPin size={36} className="text-secondary-300 mb-2" />
                        <span className="text-secondary-600 font-medium">Marshrut rasmlari qo&apos;shing</span>
                        <span className="text-secondary-400 text-sm mt-1">
                          Bir nechta rasm tanlash mumkin (max {MAX_GALLERY_IMAGES - formData.route_images.length} ta)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-secondary-800">Frequently Asked Questions</h2>
                <p className="text-secondary-500 text-sm">Ko&apos;p so&apos;raladigan savollar va javoblar</p>
              </div>
            </div>

            {/* Language Tabs for FAQ */}
            <div className="flex gap-2">
              {(['en', 'de', 'ru'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveFaqLang(lang)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeFaqLang === lang
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {formData.faq.length === 0 ? (
              <div className="text-center py-12 bg-secondary-50 rounded-lg">
                <HelpCircle size={48} className="mx-auto text-secondary-300 mb-4" />
                <p className="text-secondary-500 mb-4">Hali savol-javob qo&apos;shilmagan</p>
                <button
                  type="button"
                  onClick={addFaqItem}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  <Plus size={18} className="inline mr-2" />
                  Birinchi savolni qo&apos;shish
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.faq.map((item, index) => (
                  <div key={index} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <span className="font-medium text-secondary-700">Savol {index + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFaqItem(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Question */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Savol ({activeFaqLang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={item.question[activeFaqLang]}
                          onChange={(e) => updateFaqItem(index, 'question', activeFaqLang, e.target.value)}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={`Savolni ${activeFaqLang.toUpperCase()} tilida kiriting`}
                        />
                      </div>

                      {/* Answer */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Javob ({activeFaqLang.toUpperCase()})
                        </label>
                        <textarea
                          value={item.answer[activeFaqLang]}
                          onChange={(e) => updateFaqItem(index, 'answer', activeFaqLang, e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={`Javobni ${activeFaqLang.toUpperCase()} tilida kiriting`}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addFaqItem}
                  className="w-full py-3 border-2 border-dashed border-secondary-300 rounded-lg text-secondary-500 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Yangi savol qo&apos;shish
                </button>
              </div>
            )}
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            {/* Header with AI Button */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Search size={28} />
                    SEO Optimization
                  </h2>
                  <p className="text-primary-100 mt-1">
                    Qidiruv tizimlarida yaxshi ko&apos;rinish uchun SEO sozlamalari
                  </p>
                </div>
                <button
                  type="button"
                  onClick={generateSeoWithAI}
                  disabled={isGeneratingSeo}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                >
                  {isGeneratingSeo ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      Generatsiya...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      AI bilan generatsiya
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-secondary-600">Til tanlang:</span>
                <div className="flex gap-2">
                  {(['en', 'de', 'ru'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSeoLanguage(lang)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        seoLanguage === lang
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                      }`}
                    >
                      {lang === 'en' ? '🇬🇧 English' : lang === 'de' ? '🇩🇪 Deutsch' : '🇷🇺 Русский'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO Fields Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-secondary-50 to-secondary-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700 w-48">
                      Maydon
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">
                      Qiymat ({seoLanguage.toUpperCase()})
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-secondary-700 w-24">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {/* Meta Title */}
                  <tr className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-800">Meta Title</p>
                          <p className="text-xs text-secondary-500">50-60 belgi tavsiya etiladi</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.seo.metaTitle[seoLanguage]}
                        onChange={(e) => updateSeoField('metaTitle', seoLanguage, e.target.value)}
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Sahifa sarlavhasi..."
                        maxLength={70}
                      />
                      <span className="text-xs text-secondary-400 mt-1 block">
                        {formData.seo.metaTitle[seoLanguage].length}/70
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {formData.seo.metaTitle[seoLanguage].length > 0 ? (
                        formData.seo.metaTitle[seoLanguage].length >= 50 && formData.seo.metaTitle[seoLanguage].length <= 60 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <Check size={14} className="mr-1" /> Yaxshi
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            ⚠️ Tavsiya
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-500">
                          Bo&apos;sh
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Meta Description */}
                  <tr className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Globe size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-800">Meta Description</p>
                          <p className="text-xs text-secondary-500">150-160 belgi tavsiya etiladi</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <textarea
                        value={formData.seo.metaDescription[seoLanguage]}
                        onChange={(e) => updateSeoField('metaDescription', seoLanguage, e.target.value)}
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        placeholder="Sahifa tavsifi..."
                        rows={3}
                        maxLength={200}
                      />
                      <span className="text-xs text-secondary-400 mt-1 block">
                        {formData.seo.metaDescription[seoLanguage].length}/200
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {formData.seo.metaDescription[seoLanguage].length > 0 ? (
                        formData.seo.metaDescription[seoLanguage].length >= 150 && formData.seo.metaDescription[seoLanguage].length <= 160 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <Check size={14} className="mr-1" /> Yaxshi
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            ⚠️ Tavsiya
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-500">
                          Bo&apos;sh
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Keywords */}
                  <tr className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Search size={20} className="text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-800">Keywords</p>
                          <p className="text-xs text-secondary-500">Vergul bilan ajrating</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.seo.keywords[seoLanguage]}
                        onChange={(e) => updateSeoField('keywords', seoLanguage, e.target.value)}
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="uzbekistan, tour, travel, samarkand..."
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {formData.seo.keywords[seoLanguage].length > 0 ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <Check size={14} className="mr-1" /> Yaxshi
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-500">
                          Bo&apos;sh
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* OG Image */}
                  <tr className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                          <ImageIcon size={20} className="text-pink-600" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-800">OG Image</p>
                          <p className="text-xs text-secondary-500">Ijtimoiy tarmoqlar uchun</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 items-center">
                        {formData.main_image ? (
                          <>
                            <img
                              src={formData.main_image}
                              alt="OG Preview"
                              className="w-20 h-12 object-cover rounded-lg border border-secondary-200"
                            />
                            <button
                              type="button"
                              onClick={() => updateSeoSimpleField('ogImage', formData.main_image)}
                              className="px-4 py-2 bg-primary-100 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
                            >
                              Asosiy rasmni ishlatish
                            </button>
                          </>
                        ) : (
                          <span className="text-secondary-400 text-sm">Avval asosiy rasmni yuklang</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {formData.seo.ogImage || formData.main_image ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <Check size={14} className="mr-1" /> Tayyor
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-500">
                          Bo&apos;sh
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SEO Preview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center gap-2">
                <Search size={20} className="text-primary-500" />
                Google qidiruv natijasi ko&apos;rinishi
              </h3>
              <div className="border border-secondary-200 rounded-lg p-4 bg-white">
                <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                  {formData.seo.metaTitle[seoLanguage] || formData[`title_${seoLanguage}` as keyof Tour] || 'Sahifa sarlavhasi'}
                </div>
                <div className="text-green-700 text-sm mt-1">
                  discovery-insight-travel.uz/{seoLanguage}/tours/{formData.slug || 'tour-slug'}
                </div>
                <div className="text-secondary-600 text-sm mt-1 line-clamp-2">
                  {formData.seo.metaDescription[seoLanguage] || formData[`description_${seoLanguage}` as keyof Tour] || 'Sahifa tavsifi shu yerda ko\'rinadi...'}
                </div>
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
