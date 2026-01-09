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
  Loader2,
  HelpCircle,
  Search,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface TourCategory {
  id: number;
  slug: string;
  name_en: string;
  name_de: string;
  name_ru: string;
}

interface TourFormData {
  title: { en: string; de: string; ru: string };
  slug: string;
  destination: string;
  categoryId: number | null;
  duration: number;
  price: number;
  type: 'cultural' | 'adventure' | 'historical' | 'group' | 'private';
  status: 'active' | 'inactive' | 'draft';
  groupSize: string;
  isBestseller: boolean;
  enablePrivateTour: boolean;
  enableGroupTour: boolean;
  privateTourPrices: { personsFrom: number; personsTo: number; price: number }[];
  groupTourPrices: { personsFrom: number; personsTo: number; price: number }[];
  description: { en: string; de: string; ru: string };
  highlights: { en: string; de: string; ru: string };
  included: { en: string[]; de: string[]; ru: string[] };
  notIncluded: { en: string[]; de: string[]; ru: string[] };
  itinerary: {
    day: number;
    title: { en: string; de: string; ru: string };
    description: { en: string; de: string; ru: string };
    image: string;
  }[];
  mainImage: string;
  mainImageAlt: string;
  galleryImages: { url: string; alt: string }[];
  routeImages: { url: string; alt: string }[];
  faq: {
    question: { en: string; de: string; ru: string };
    answer: { en: string; de: string; ru: string };
  }[];
  seo: {
    metaTitle: { en: string; de: string; ru: string };
    metaDescription: { en: string; de: string; ru: string };
    keywords: { en: string; de: string; ru: string };
    ogImage: string;
    canonicalUrl: string;
  };
}

const initialFormData: TourFormData = {
  title: { en: '', de: '', ru: '' },
  slug: '',
  destination: '',
  categoryId: null,
  duration: 1,
  price: 0,
  type: 'cultural',
  status: 'draft',
  groupSize: '2-10',
  isBestseller: false,
  enablePrivateTour: true,
  enableGroupTour: false,
  privateTourPrices: [{ personsFrom: 1, personsTo: 1, price: 0 }],
  groupTourPrices: [{ personsFrom: 1, personsTo: 5, price: 0 }],
  description: { en: '', de: '', ru: '' },
  highlights: { en: '', de: '', ru: '' },
  included: { en: [''], de: [''], ru: [''] },
  notIncluded: { en: [''], de: [''], ru: [''] },
  itinerary: [],
  mainImage: '',
  mainImageAlt: '',
  galleryImages: [],
  routeImages: [],
  faq: [],
  seo: {
    metaTitle: { en: '', de: '', ru: '' },
    metaDescription: { en: '', de: '', ru: '' },
    keywords: { en: '', de: '', ru: '' },
    ogImage: '',
    canonicalUrl: '',
  },
};

const MAX_GALLERY_IMAGES = 10;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const steps = [
  { id: 1, title: 'Basic Info', icon: FileText },
  { id: 2, title: 'Description', icon: Globe },
  { id: 3, title: 'Itinerary', icon: Calendar },
  { id: 4, title: 'Images', icon: ImageIcon },
  { id: 5, title: 'FAQ', icon: HelpCircle },
  { id: 6, title: 'SEO', icon: Search },
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
  const [uploadingRoutes, setUploadingRoutes] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<TourCategory[]>([]);

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
    field: 'title' | 'description' | 'highlights',
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

  // Private Tour Prices management
  const addPrivateTourPrice = () => {
    const lastTo = formData.privateTourPrices.length > 0
      ? formData.privateTourPrices[formData.privateTourPrices.length - 1].personsTo + 1
      : 1;
    setFormData((prev) => ({
      ...prev,
      privateTourPrices: [...prev.privateTourPrices, { personsFrom: lastTo, personsTo: lastTo, price: 0 }],
    }));
  };

  const updatePrivateTourPrice = (index: number, field: 'personsFrom' | 'personsTo' | 'price', value: number) => {
    setFormData((prev) => {
      const updated = [...prev.privateTourPrices];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, privateTourPrices: updated };
    });
  };

  const removePrivateTourPrice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      privateTourPrices: prev.privateTourPrices.filter((_, i) => i !== index),
    }));
  };

  // Group Tour Prices management
  const addGroupTourPrice = () => {
    const lastTo = formData.groupTourPrices.length > 0
      ? formData.groupTourPrices[formData.groupTourPrices.length - 1].personsTo + 1
      : 1;
    setFormData((prev) => ({
      ...prev,
      groupTourPrices: [...prev.groupTourPrices, { personsFrom: lastTo, personsTo: lastTo + 4, price: 0 }],
    }));
  };

  const updateGroupTourPrice = (index: number, field: 'personsFrom' | 'personsTo' | 'price', value: number) => {
    setFormData((prev) => {
      const updated = [...prev.groupTourPrices];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, groupTourPrices: updated };
    });
  };

  const removeGroupTourPrice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      groupTourPrices: prev.groupTourPrices.filter((_, i) => i !== index),
    }));
  };

  // Itinerary management
  const addItineraryDay = () => {
    const newDay = {
      day: formData.itinerary.length + 1,
      title: { en: '', de: '', ru: '' },
      description: { en: '', de: '', ru: '' },
      image: '',
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

  const updateItineraryImage = (index: number, imageUrl: string) => {
    setFormData((prev) => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = {
        ...newItinerary[index],
        image: imageUrl,
      };
      return { ...prev, itinerary: newItinerary };
    });
  };

  const [uploadingItineraryIndex, setUploadingItineraryIndex] = useState<number | null>(null);

  const handleItineraryImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingItineraryIndex(index);
    const url = await uploadFile(file);
    if (url) {
      updateItineraryImage(index, url);
    }
    setUploadingItineraryIndex(null);
    e.target.value = '';
  };

  const removeItineraryDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, day: i + 1 })),
    }));
  };

  // FAQ management
  const addFaqItem = () => {
    const newFaq = {
      question: { en: '', de: '', ru: '' },
      answer: { en: '', de: '', ru: '' },
    };
    setFormData((prev) => ({
      ...prev,
      faq: [...prev.faq, newFaq],
    }));
  };

  const updateFaqItem = (
    index: number,
    field: 'question' | 'answer',
    lang: 'en' | 'de' | 'ru',
    value: string
  ) => {
    setFormData((prev) => {
      const newFaq = [...prev.faq];
      newFaq[index] = {
        ...newFaq[index],
        [field]: { ...newFaq[index][field], [lang]: value },
      };
      return { ...prev, faq: newFaq };
    });
  };

  const removeFaqItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  // SEO management
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [seoLanguage, setSeoLanguage] = useState<'en' | 'de' | 'ru'>('en');

  const updateSeoField = (
    field: 'metaTitle' | 'metaDescription' | 'keywords',
    lang: 'en' | 'de' | 'ru',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: { ...prev.seo[field], [lang]: value },
      },
    }));
  };

  const updateSeoSimpleField = (field: 'ogImage' | 'canonicalUrl', value: string) => {
    setFormData((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  };

  const generateSeoWithAI = async () => {
    setIsGeneratingSeo(true);
    try {
      // Collect all data from previous steps
      const tourData = {
        title: formData.title,
        destination: formData.destination,
        duration: formData.duration,
        type: formData.type,
        description: formData.description,
        highlights: formData.highlights,
        included: formData.included,
        itinerary: formData.itinerary.map(day => ({
          day: day.day,
          title: day.title,
          description: day.description,
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
        setFormData((prev) => ({
          ...prev,
          seo: {
            ...prev.seo,
            metaTitle: {
              ...prev.seo.metaTitle,
              [seoLanguage]: data.metaTitle || prev.seo.metaTitle[seoLanguage],
            },
            metaDescription: {
              ...prev.seo.metaDescription,
              [seoLanguage]: data.metaDescription || prev.seo.metaDescription[seoLanguage],
            },
            keywords: {
              ...prev.seo.keywords,
              [seoLanguage]: data.keywords || prev.seo.keywords[seoLanguage],
            },
          },
        }));
      } else {
        console.error('Failed to generate SEO');
      }
    } catch (error) {
      console.error('Error generating SEO:', error);
    } finally {
      setIsGeneratingSeo(false);
    }
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
    const uploadedImages: { url: string; alt: string }[] = [];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        uploadedImages.push({ url, alt: '' });
      }
    }

    if (uploadedImages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploadedImages],
      }));
    }
    setUploadingGallery(false);
    e.target.value = '';
  };

  const updateGalleryImageAlt = (index: number, alt: string) => {
    setFormData((prev) => {
      const updated = [...prev.galleryImages];
      updated[index] = { ...updated[index], alt };
      return { ...prev, galleryImages: updated };
    });
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

  // Route images handlers
  const handleRouteImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_GALLERY_IMAGES - formData.routeImages.length;
    if (files.length > remainingSlots) {
      setErrors((prev) => ({ ...prev, upload: `Faqat ${remainingSlots} ta marshrut rasmi qo'shish mumkin` }));
      return;
    }

    setUploadingRoutes(true);
    const uploadedImages: { url: string; alt: string }[] = [];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        uploadedImages.push({ url, alt: '' });
      }
    }

    if (uploadedImages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        routeImages: [...prev.routeImages, ...uploadedImages],
      }));
    }
    setUploadingRoutes(false);
    e.target.value = '';
  };

  const updateRouteImageAlt = (index: number, alt: string) => {
    setFormData((prev) => {
      const updated = [...prev.routeImages];
      updated[index] = { ...updated[index], alt };
      return { ...prev, routeImages: updated };
    });
  };

  const removeRouteImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      routeImages: prev.routeImages.filter((_, i) => i !== index),
    }));
  };

  const handleRoutesDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_GALLERY_IMAGES - formData.routeImages.length;
    if (files.length > remainingSlots) {
      setErrors((prev) => ({ ...prev, upload: `Faqat ${remainingSlots} ta marshrut rasmi qo'shish mumkin` }));
      return;
    }

    setUploadingRoutes(true);
    const uploadedImages: { url: string; alt: string }[] = [];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        uploadedImages.push({ url, alt: '' });
      }
    }

    if (uploadedImages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        routeImages: [...prev.routeImages, ...uploadedImages],
      }));
    }
    setUploadingRoutes(false);
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
    const uploadedImages: { url: string; alt: string }[] = [];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        uploadedImages.push({ url, alt: '' });
      }
    }

    if (uploadedImages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploadedImages],
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
      setCurrentStep((prev) => Math.min(prev + 1, 6));
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
      // Filter out empty values
      const cleanedData = {
        ...formData,
        // Send main image with alt text
        mainImage: formData.mainImage,
        mainImageAlt: formData.mainImageAlt,
        // Gallery images as array of { url, alt }
        galleryImages: formData.galleryImages,
        // Route images as array of { url, alt }
        routeImages: formData.routeImages,
        // For backwards compatibility, also send images array (URL strings only)
        images: [formData.mainImage, ...formData.galleryImages.map(img => img.url)],
        highlights: formData.highlights,
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
        // FAQ - filter out empty questions
        faq: formData.faq.filter((item) =>
          item.question.en.trim() || item.question.de.trim() || item.question.ru.trim()
        ),
        // SEO data
        seo: formData.seo,
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
              <button
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white group-hover:bg-green-600'
                      : currentStep === step.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-100 text-secondary-400 group-hover:bg-secondary-200'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check size={24} />
                  ) : (
                    <step.icon size={24} />
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium transition-colors ${
                    currentStep >= step.id ? 'text-secondary-800' : 'text-secondary-400 group-hover:text-secondary-600'
                  }`}
                >
                  {step.title}
                </span>
              </button>
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

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Kategoriya
                </label>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) => updateFormData('categoryId', e.target.value ? parseInt(e.target.value) : null)}
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

            {/* Pricing Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Private Tour Prices */}
              <div className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-secondary-800">Private Tour Prices</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enablePrivateTour}
                      onChange={(e) => updateFormData('enablePrivateTour', e.target.checked)}
                      className="w-4 h-4 text-primary-500 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-600">Enable</span>
                  </label>
                </div>

                {formData.enablePrivateTour && (
                  <>
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-secondary-500 px-1">
                        <div className="col-span-3">From</div>
                        <div className="col-span-3">To</div>
                        <div className="col-span-4">Price (EUR)</div>
                        <div className="col-span-2"></div>
                      </div>
                      {formData.privateTourPrices.map((item, index) => (
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
                            disabled={formData.privateTourPrices.length === 1}
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
                      checked={formData.enableGroupTour}
                      onChange={(e) => updateFormData('enableGroupTour', e.target.checked)}
                      className="w-4 h-4 text-primary-500 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-600">Enable</span>
                  </label>
                </div>

                {formData.enableGroupTour && (
                  <>
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-secondary-500 px-1">
                        <div className="col-span-3">From</div>
                        <div className="col-span-3">To</div>
                        <div className="col-span-4">Price (EUR)</div>
                        <div className="col-span-2"></div>
                      </div>
                      {formData.groupTourPrices.map((item, index) => (
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
                            disabled={formData.groupTourPrices.length === 1}
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

            {/* Highlights */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Highlights ({activeLanguage.toUpperCase()})
              </label>
              <textarea
                value={formData.highlights[activeLanguage]}
                onChange={(e) => updateMultilingualField('highlights', activeLanguage, e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={`Enter tour highlights in ${activeLanguage.toUpperCase()} (e.g., Visit UNESCO World Heritage sites, Experience local cuisine, etc.)`}
              />
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
                      {/* Day Image */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Kun rasmi (Day Image)
                        </label>
                        {day.image ? (
                          <div className="relative inline-block">
                            <img
                              src={day.image}
                              alt={`Day ${day.day}`}
                              className="w-40 h-28 object-cover rounded-lg border border-secondary-200"
                            />
                            <button
                              type="button"
                              onClick={() => updateItineraryImage(index, '')}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-block">
                            <input
                              type="file"
                              id={`itinerary-image-${index}`}
                              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                              onChange={(e) => handleItineraryImageUpload(index, e)}
                              className="hidden"
                            />
                            <label
                              htmlFor={`itinerary-image-${index}`}
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
                <div className="flex gap-4 items-start">
                  <div className="relative">
                    <img
                      src={formData.mainImage}
                      alt={formData.mainImageAlt || "Main tour image"}
                      className="w-48 h-36 object-cover rounded-lg border border-secondary-200"
                    />
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X size={16} />
                    </button>
                    <p className="mt-1 text-xs text-secondary-500 truncate max-w-[192px]" title={formData.mainImage.split('/').pop()}>
                      {formData.mainImage.split('/').pop()}
                    </p>
                  </div>
                  <div className="flex-1 max-w-xs">
                    <label className="block text-xs text-secondary-500 mb-1">Alt Text (SEO uchun)</label>
                    <input
                      type="text"
                      value={formData.mainImageAlt}
                      onChange={(e) => updateFormData('mainImageAlt', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Rasmni tavsiflovchi matn"
                    />
                  </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {formData.galleryImages.map((image, index) => (
                    <div key={index} className="flex gap-3 p-3 border border-secondary-200 rounded-lg">
                      <div className="relative flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.alt || `Gallery image ${index + 1}`}
                          className="w-24 h-20 object-cover rounded-lg border border-secondary-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X size={12} />
                        </button>
                        <p className="mt-1 text-[10px] text-secondary-400 truncate max-w-[96px]" title={image.url.split('/').pop()}>
                          {image.url.split('/').pop()}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs text-secondary-500 mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={image.alt}
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

            {/* Route Images Upload */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-secondary-700">
                  Marshrut Rasmlari (Tour Routes)
                </label>
                <span className="text-sm text-secondary-500">
                  {formData.routeImages.length} / {MAX_GALLERY_IMAGES}
                </span>
              </div>

              {/* Route Images Grid */}
              {formData.routeImages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {formData.routeImages.map((image, index) => (
                    <div key={index} className="flex gap-3 p-3 border border-secondary-200 rounded-lg">
                      <div className="relative flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.alt || `Route image ${index + 1}`}
                          className="w-24 h-20 object-cover rounded-lg border border-secondary-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeRouteImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X size={12} />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </span>
                        <p className="mt-1 text-[10px] text-secondary-400 truncate max-w-[96px]" title={image.url.split('/').pop()}>
                          {image.url.split('/').pop()}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs text-secondary-500 mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={image.alt}
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
              {formData.routeImages.length < MAX_GALLERY_IMAGES && (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleRoutesDrop}
                  className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    id="routeImages"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleRouteImagesUpload}
                    className="hidden"
                  />
                  <label htmlFor="routeImages" className="cursor-pointer">
                    {uploadingRoutes ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={36} className="text-primary-500 animate-spin mb-2" />
                        <span className="text-secondary-600">Yuklanmoqda...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <MapPin size={36} className="text-secondary-300 mb-2" />
                        <span className="text-secondary-600 font-medium">
                          Marshrut rasmlari qo&apos;shing
                        </span>
                        <span className="text-secondary-400 text-sm mt-1">
                          Bir nechta rasm tanlash mumkin (max {MAX_GALLERY_IMAGES - formData.routeImages.length} ta)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: FAQ */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-secondary-800">Frequently Asked Questions</h2>
                <p className="text-secondary-500 text-sm">Ko&apos;p so&apos;raladigan savollar va javoblar</p>
              </div>
            </div>

            <LanguageTabs />

            {formData.faq.length === 0 ? (
              <div className="text-center py-12 bg-secondary-50 rounded-lg">
                <HelpCircle size={48} className="mx-auto text-secondary-300 mb-4" />
                <p className="text-secondary-500 mb-4">Hali savol-javob qo&apos;shilmagan</p>
                <button
                  type="button"
                  onClick={addFaqItem}
                  className="btn-primary"
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
                          Savol ({activeLanguage.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={item.question[activeLanguage]}
                          onChange={(e) => updateFaqItem(index, 'question', activeLanguage, e.target.value)}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={`Savolni ${activeLanguage.toUpperCase()} tilida kiriting`}
                        />
                      </div>

                      {/* Answer */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Javob ({activeLanguage.toUpperCase()})
                        </label>
                        <textarea
                          value={item.answer[activeLanguage]}
                          onChange={(e) => updateFaqItem(index, 'answer', activeLanguage, e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder={`Javobni ${activeLanguage.toUpperCase()} tilida kiriting`}
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

        {/* Step 6: SEO */}
        {currentStep === 6 && (
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
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Sahifa sarlavhasi..."
                        maxLength={70}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-secondary-400">
                          {formData.seo.metaTitle[seoLanguage].length}/70
                        </span>
                      </div>
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
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                        placeholder="Sahifa tavsifi..."
                        rows={3}
                        maxLength={200}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-secondary-400">
                          {formData.seo.metaDescription[seoLanguage].length}/200
                        </span>
                      </div>
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
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                        {formData.mainImage ? (
                          <>
                            <img
                              src={formData.mainImage}
                              alt="OG Preview"
                              className="w-20 h-12 object-cover rounded-lg border border-secondary-200"
                            />
                            <button
                              type="button"
                              onClick={() => updateSeoSimpleField('ogImage', formData.mainImage)}
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
                      {formData.seo.ogImage || formData.mainImage ? (
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

                  {/* Canonical URL */}
                  <tr className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Globe size={20} className="text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-800">Canonical URL</p>
                          <p className="text-xs text-secondary-500">Avtomatik generatsiya</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 px-4 py-3 bg-secondary-50 rounded-lg">
                        <span className="text-secondary-400">/tours/</span>
                        <span className="text-secondary-800 font-medium">{formData.slug || 'tour-slug'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {formData.slug ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <Check size={14} className="mr-1" /> Tayyor
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          ⚠️ Slug kiritilmagan
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
                  {formData.seo.metaTitle[seoLanguage] || formData.title[seoLanguage] || 'Sahifa sarlavhasi'}
                </div>
                <div className="text-green-700 text-sm mt-1">
                  discovery-insight-travel.uz/{seoLanguage}/tours/{formData.slug || 'tour-slug'}
                </div>
                <div className="text-secondary-600 text-sm mt-1 line-clamp-2">
                  {formData.seo.metaDescription[seoLanguage] || formData.description[seoLanguage] || 'Sahifa tavsifi shu yerda ko\'rinadi...'}
                </div>
              </div>
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

        {currentStep < 6 ? (
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
