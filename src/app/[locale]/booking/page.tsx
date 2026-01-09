'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  MapPin,
  ArrowLeft,
  Download,
  Printer,
} from 'lucide-react';

interface Tour {
  id: number;
  slug: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  destination: string;
  duration: number;
  price: number;
  main_image: string;
  enable_private_tour: boolean;
  enable_group_tour: boolean;
  private_tour_prices: { personsFrom: number; personsTo: number; price: number }[];
  group_tour_prices: { personsFrom: number; personsTo: number; price: number }[];
}

export default function BookingPage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const searchParams = useSearchParams();
  const tourSlug = searchParams.get('tour');
  const adultsParam = searchParams.get('adults');
  const childrenParam = searchParams.get('children');
  const dateParam = searchParams.get('date');

  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoadingTour, setIsLoadingTour] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState<string>('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    pickupLocation: '',
    tourType: 'private', // 'private' or 'group'
    adults: adultsParam || '2',
    children: childrenParam || '0',
    startDate: dateParam || '',
    startTime: '09:00',
    endDate: '',
    specialRequests: '',
    howDidYouHear: '',
  });

  // Fetch tour data
  useEffect(() => {
    const fetchTour = async () => {
      if (!tourSlug) {
        setIsLoadingTour(false);
        return;
      }

      try {
        const response = await fetch(`/api/tours?slug=${tourSlug}`);
        if (response.ok) {
          const data = await response.json();
          setTour(data);

          // Calculate end date if we have start date from URL
          if (dateParam && data.duration) {
            const startDate = new Date(dateParam);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + data.duration - 1);
            const endDateStr = endDate.toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, endDate: endDateStr }));
          }
        }
      } catch (err) {
        console.error('Error fetching tour:', err);
      } finally {
        setIsLoadingTour(false);
      }
    };

    fetchTour();
  }, [tourSlug, dateParam]);

  const getTourTitle = () => {
    if (!tour) return '';
    return tour[`title_${locale}`] || tour.title_en;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // If start date changes, automatically calculate end date based on tour duration
    if (name === 'startDate' && value && tour?.duration) {
      const startDate = new Date(value);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + tour.duration - 1); // duration includes start day
      const endDateStr = endDate.toISOString().split('T')[0];

      setFormData({ ...formData, startDate: value, endDate: endDateStr });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError('');
  };

  // Get per-person price based on tour type and number of travelers
  // Children (0-5) are FREE
  const getPerPersonPrice = () => {
    if (!tour) return { adultPrice: 0, childPrice: 0 };

    const adultsCount = parseInt(formData.adults) || 1;
    const childrenCount = parseInt(formData.children) || 0;
    const totalPersons = adultsCount + childrenCount;

    // Check for tiered pricing - price tier based on total group size
    if (formData.tourType === 'private' && tour.private_tour_prices?.length > 0) {
      const priceTier = tour.private_tour_prices.find(
        (p) => totalPersons >= p.personsFrom && totalPersons <= p.personsTo
      );
      if (priceTier) {
        return { adultPrice: priceTier.price, childPrice: 0 }; // Children FREE
      }
    }

    if (formData.tourType === 'group' && tour.group_tour_prices?.length > 0) {
      const priceTier = tour.group_tour_prices.find(
        (p) => totalPersons >= p.personsFrom && totalPersons <= p.personsTo
      );
      if (priceTier) {
        return { adultPrice: priceTier.price, childPrice: 0 }; // Children FREE
      }
    }

    // Fallback to base price - children FREE
    return { adultPrice: tour.price, childPrice: 0 };
  };

  // Calculate price based on number of travelers
  const calculatePrice = () => {
    if (!tour) return 0;

    const adultsCount = parseInt(formData.adults) || 1;
    const childrenCount = parseInt(formData.children) || 0;
    const { adultPrice, childPrice } = getPerPersonPrice();

    return adultPrice * adultsCount + childPrice * childrenCount;
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError(locale === 'en' ? 'Please fill in all required fields' : locale === 'de' ? 'Bitte füllen Sie alle Pflichtfelder aus' : 'Пожалуйста, заполните все обязательные поля');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError(locale === 'en' ? 'Please enter a valid email' : locale === 'de' ? 'Bitte geben Sie eine gültige E-Mail ein' : 'Пожалуйста, введите действительный email');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.startDate) {
        setError(locale === 'en' ? 'Please select a start date' : locale === 'de' ? 'Bitte wählen Sie ein Startdatum' : 'Пожалуйста, выберите дату начала');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour_id: tour?.id,
          tour_slug: tour?.slug,
          tour_title: getTourTitle(),
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          pickup_location: formData.pickupLocation,
          tour_type: formData.tourType,
          adults: parseInt(formData.adults),
          children: parseInt(formData.children),
          start_date: formData.startDate,
          start_time: formData.startTime,
          end_date: formData.endDate,
          special_requests: formData.specialRequests,
          how_did_you_hear: formData.howDidYouHear,
          total_price: calculatePrice(),
          status: 'pending',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingId(data.booking_number || `BK${data.id}`);
        setIsSuccess(true);
      } else {
        const data = await response.json();
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : (data.error || 'Failed to submit booking');
        setError(errorMsg);
      }
    } catch (err) {
      setError(locale === 'en' ? 'Something went wrong. Please try again.' : locale === 'de' ? 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.' : 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = calculatePrice();
  const adultsCount = parseInt(formData.adults) || 1;
  const childrenCount = parseInt(formData.children) || 0;

  // Loading state
  if (isLoadingTour) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

  // No tour found
  if (!tour && tourSlug) {
    return (
      <div className="min-h-screen bg-secondary-50 py-16">
        <div className="container-custom text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary-800 mb-4">
            {locale === 'en' ? 'Tour not found' : locale === 'de' ? 'Tour nicht gefunden' : 'Тур не найден'}
          </h1>
          <Link href={`/${locale}/tours`} className="btn-primary inline-block">
            {locale === 'en' ? 'Browse Tours' : locale === 'de' ? 'Touren durchsuchen' : 'Просмотр туров'}
          </Link>
        </div>
      </div>
    );
  }

  // Print/PDF function
  const handlePrint = () => {
    window.print();
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-secondary-50 py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            {/* Printable Booking Confirmation */}
            <div id="booking-confirmation" className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none">
              {/* Header with Logo */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Image
                    src="/images/logo.png"
                    alt="Discovery Insight Travel"
                    width={60}
                    height={60}
                    className="rounded-full bg-white p-1"
                  />
                  <div className="text-left">
                    <h2 className="text-xl font-bold">Discovery Insight</h2>
                    <p className="text-primary-100 text-sm">Travel Agency</p>
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="text-white" size={40} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {locale === 'en' ? 'Booking Confirmed!' : locale === 'de' ? 'Buchung bestätigt!' : 'Бронирование подтверждено!'}
                </h1>
              </div>

              {/* Booking Reference */}
              <div className="bg-primary-50 p-4 text-center border-b border-primary-100">
                <p className="text-sm text-secondary-600 mb-1">
                  {locale === 'en' ? 'Booking Reference Number' : locale === 'de' ? 'Buchungsnummer' : 'Номер бронирования'}
                </p>
                <p className="text-2xl font-bold text-primary-600 tracking-wider">{bookingId}</p>
              </div>

              {/* Main Content */}
              <div className="p-6 md:p-8">
                {/* Thank you message */}
                <div className="text-center mb-8">
                  <p className="text-secondary-600">
                    {locale === 'en'
                      ? 'Thank you for choosing Discovery Insight Travel! We will contact you within 24 hours to confirm availability and provide payment details.'
                      : locale === 'de'
                      ? 'Vielen Dank, dass Sie sich für Discovery Insight Travel entschieden haben! Wir werden Sie innerhalb von 24 Stunden kontaktieren.'
                      : 'Спасибо, что выбрали Discovery Insight Travel! Мы свяжемся с вами в течение 24 часов.'}
                  </p>
                </div>

                {/* Tour Info Card */}
                {tour && (
                  <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-xl mb-6">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={tour.main_image || '/images/placeholder-tour.jpg'}
                        alt={getTourTitle()}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary-800 text-lg">{getTourTitle()}</h3>
                      <div className="flex items-center gap-3 text-sm text-secondary-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {tour.destination}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {tour.duration} {locale === 'en' ? 'days' : locale === 'de' ? 'Tage' : 'дней'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Booking Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-secondary-800 flex items-center gap-2">
                      <User size={18} className="text-primary-500" />
                      {locale === 'en' ? 'Guest Information' : locale === 'de' ? 'Gästeinformationen' : 'Информация о госте'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-secondary-100">
                        <span className="text-secondary-500">{locale === 'en' ? 'Name' : locale === 'de' ? 'Name' : 'Имя'}</span>
                        <span className="font-medium text-secondary-800">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-secondary-100">
                        <span className="text-secondary-500">Email</span>
                        <span className="font-medium text-secondary-800">{formData.email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-secondary-100">
                        <span className="text-secondary-500">{locale === 'en' ? 'Phone' : locale === 'de' ? 'Telefon' : 'Телефон'}</span>
                        <span className="font-medium text-secondary-800">{formData.phone}</span>
                      </div>
                      {formData.country && (
                        <div className="flex justify-between py-2 border-b border-secondary-100">
                          <span className="text-secondary-500">{locale === 'en' ? 'Country' : locale === 'de' ? 'Land' : 'Страна'}</span>
                          <span className="font-medium text-secondary-800">{formData.country}</span>
                        </div>
                      )}
                      {formData.pickupLocation && (
                        <div className="flex justify-between py-2 border-b border-secondary-100">
                          <span className="text-secondary-500">{locale === 'en' ? 'Pickup Location' : locale === 'de' ? 'Abholort' : 'Место встречи'}</span>
                          <span className="font-medium text-secondary-800">{formData.pickupLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trip Info */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-secondary-800 flex items-center gap-2">
                      <Calendar size={18} className="text-primary-500" />
                      {locale === 'en' ? 'Trip Details' : locale === 'de' ? 'Reisedetails' : 'Детали поездки'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-secondary-100">
                        <span className="text-secondary-500">{locale === 'en' ? 'Start Date' : locale === 'de' ? 'Startdatum' : 'Дата начала'}</span>
                        <span className="font-medium text-secondary-800">{formData.startDate} {formData.startTime}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-secondary-100">
                        <span className="text-secondary-500">{locale === 'en' ? 'End Date' : locale === 'de' ? 'Enddatum' : 'Дата окончания'}</span>
                        <span className="font-medium text-secondary-800">{formData.endDate}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-secondary-100">
                        <span className="text-secondary-500">{locale === 'en' ? 'Duration' : locale === 'de' ? 'Dauer' : 'Продолжительность'}</span>
                        <span className="font-medium text-secondary-800">{tour?.duration} {locale === 'en' ? 'days' : locale === 'de' ? 'Tage' : 'дней'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-secondary-100">
                        <span className="text-secondary-500">{locale === 'en' ? 'Tour Type' : locale === 'de' ? 'Tourart' : 'Тип тура'}</span>
                        <span className="font-medium text-secondary-800">
                          {formData.tourType === 'private'
                            ? (locale === 'en' ? 'Private' : locale === 'de' ? 'Privat' : 'Приватный')
                            : (locale === 'en' ? 'Group' : locale === 'de' ? 'Gruppe' : 'Групповой')}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-secondary-100">
                        <span className="text-secondary-500">{locale === 'en' ? 'Travelers' : locale === 'de' ? 'Reisende' : 'Путешественники'}</span>
                        <span className="font-medium text-secondary-800">
                          {adultsCount} {locale === 'en' ? 'Adults' : locale === 'de' ? 'Erwachsene' : 'Взрослых'}
                          {childrenCount > 0 && `, ${childrenCount} ${locale === 'en' ? 'Children' : locale === 'de' ? 'Kinder' : 'Детей'}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-r from-primary-50 to-orange-50 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-secondary-800 mb-3">
                    {locale === 'en' ? 'Price Summary' : locale === 'de' ? 'Preisübersicht' : 'Сводка цен'}
                  </h4>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-secondary-600 text-sm">
                      <span>{adultsCount} {locale === 'en' ? 'Adults' : locale === 'de' ? 'Erwachsene' : 'Взрослых'} × €{getPerPersonPrice().adultPrice.toLocaleString()}</span>
                      <span>€{(getPerPersonPrice().adultPrice * adultsCount).toLocaleString()}</span>
                    </div>
                    {childrenCount > 0 && (
                      <div className="flex justify-between text-secondary-600 text-sm">
                        <span>{childrenCount} {locale === 'en' ? 'Children' : locale === 'de' ? 'Kinder' : 'Детей'} (0-5)</span>
                        <span className="text-green-600 font-medium">{locale === 'en' ? 'FREE' : locale === 'de' ? 'GRATIS' : 'БЕСПЛАТНО'}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-primary-200">
                    <div>
                      <p className="text-secondary-700 font-medium">
                        {locale === 'en' ? 'Estimated Total' : locale === 'de' ? 'Geschätzte Gesamtsumme' : 'Примерная сумма'}
                      </p>
                      <p className="text-xs text-secondary-400">
                        {locale === 'en' ? '* Final price will be confirmed' : locale === 'de' ? '* Endpreis wird bestätigt' : '* Окончательная цена будет подтверждена'}
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-primary-600">€{totalPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* Special Requests */}
                {formData.specialRequests && (
                  <div className="bg-secondary-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-secondary-800 mb-2">
                      {locale === 'en' ? 'Special Requests' : locale === 'de' ? 'Besondere Wünsche' : 'Особые пожелания'}
                    </h4>
                    <p className="text-secondary-600 text-sm">{formData.specialRequests}</p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="border-t border-secondary-200 pt-6 text-center text-sm text-secondary-500">
                  <p className="mb-2">
                    {locale === 'en' ? 'Questions? Contact us:' : locale === 'de' ? 'Fragen? Kontaktieren Sie uns:' : 'Вопросы? Свяжитесь с нами:'}
                  </p>
                  <div className="flex items-center justify-center gap-6">
                    <a href="mailto:info@discoveryinsight.uz" className="hover:text-primary-500 flex items-center gap-1">
                      <Mail size={14} />
                      info@discoveryinsight.uz
                    </a>
                    <a href="tel:+998933484208" className="hover:text-primary-500 flex items-center gap-1">
                      <Phone size={14} />
                      +998 93 348 42 08
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons (not printed) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 print:hidden">
              <button
                onClick={handlePrint}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Printer size={20} />
                {locale === 'en' ? 'Print / Save PDF' : locale === 'de' ? 'Drucken / PDF speichern' : 'Печать / Сохранить PDF'}
              </button>
              <Link href={`/${locale}`} className="btn-secondary flex items-center justify-center gap-2">
                {locale === 'en' ? 'Back to Home' : locale === 'de' ? 'Zur Startseite' : 'На главную'}
              </Link>
              <Link href={`/${locale}/tours`} className="btn-primary flex items-center justify-center gap-2">
                {locale === 'en' ? 'Explore More Tours' : locale === 'de' ? 'Mehr Touren entdecken' : 'Больше туров'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        {/* Back Button */}
        {tour && (
          <Link href={`/${locale}/tours/${tour.slug}`} className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-6">
            <ArrowLeft size={20} />
            {locale === 'en' ? 'Back to tour' : locale === 'de' ? 'Zurück zur Tour' : 'Назад к туру'}
          </Link>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 text-center mb-8">
          {t('booking.title')}
        </h1>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step >= s ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-500'}`}>
                  {s}
                </div>
                {i < 2 && (
                  <div className={`w-16 md:w-24 h-1 ${step > s ? 'bg-primary-500' : 'bg-secondary-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center text-sm">
            <span className={`w-24 md:w-32 text-center ${step >= 1 ? 'text-primary-500 font-medium' : 'text-secondary-400'}`}>
              {locale === 'en' ? 'Your Info' : locale === 'de' ? 'Ihre Daten' : 'Ваши данные'}
            </span>
            <span className={`w-24 md:w-32 text-center ${step >= 2 ? 'text-primary-500 font-medium' : 'text-secondary-400'}`}>
              {locale === 'en' ? 'Trip Details' : locale === 'de' ? 'Reisedetails' : 'Детали поездки'}
            </span>
            <span className={`w-24 md:w-32 text-center ${step >= 3 ? 'text-primary-500 font-medium' : 'text-secondary-400'}`}>
              {locale === 'en' ? 'Confirm' : locale === 'de' ? 'Bestätigen' : 'Подтвердить'}
            </span>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                    <User className="text-primary-500" size={24} />
                    {t('booking.personalInfo')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.firstName')} *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.lastName')} *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.email')} *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field pl-10"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.phone')} *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input-field pl-10"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.country')}
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="input-field pl-10"
                          placeholder={locale === 'en' ? 'e.g. Germany' : locale === 'de' ? 'z.B. Deutschland' : 'напр. Германия'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {locale === 'en' ? 'Pickup Location' : locale === 'de' ? 'Abholort' : 'Место встречи'}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                          type="text"
                          name="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={handleChange}
                          className="input-field pl-10"
                          placeholder={locale === 'en' ? 'Hotel name or address' : locale === 'de' ? 'Hotelname oder Adresse' : 'Название отеля или адрес'}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button type="button" onClick={nextStep} className="btn-primary">
                      {locale === 'en' ? 'Continue' : locale === 'de' ? 'Weiter' : 'Продолжить'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Trip Details */}
              {step === 2 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                    <Calendar className="text-primary-500" size={24} />
                    {locale === 'en' ? 'Trip Details' : locale === 'de' ? 'Reisedetails' : 'Детали поездки'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tour Type Selection */}
                    {tour && (tour.enable_private_tour || tour.enable_group_tour) && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          {locale === 'en' ? 'Tour Type' : locale === 'de' ? 'Tourart' : 'Тип тура'} *
                        </label>
                        <div className="flex gap-4">
                          {tour.enable_private_tour && (
                            <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.tourType === 'private' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'}`}>
                              <input
                                type="radio"
                                name="tourType"
                                value="private"
                                checked={formData.tourType === 'private'}
                                onChange={handleChange}
                                className="sr-only"
                              />
                              <div className="font-medium text-secondary-800">
                                {locale === 'en' ? 'Private Tour' : locale === 'de' ? 'Privattour' : 'Приватный тур'}
                              </div>
                              <div className="text-sm text-secondary-500">
                                {locale === 'en' ? 'Exclusive tour just for you' : locale === 'de' ? 'Exklusive Tour nur für Sie' : 'Эксклюзивный тур только для вас'}
                              </div>
                            </label>
                          )}
                          {tour.enable_group_tour && (
                            <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.tourType === 'group' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'}`}>
                              <input
                                type="radio"
                                name="tourType"
                                value="group"
                                checked={formData.tourType === 'group'}
                                onChange={handleChange}
                                className="sr-only"
                              />
                              <div className="font-medium text-secondary-800">
                                {locale === 'en' ? 'Group Tour' : locale === 'de' ? 'Gruppentour' : 'Групповой тур'}
                              </div>
                              <div className="text-sm text-secondary-500">
                                {locale === 'en' ? 'Join other travelers' : locale === 'de' ? 'Mit anderen Reisenden' : 'Присоединяйтесь к другим'}
                              </div>
                            </label>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          {t('booking.startDate')} *
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          {locale === 'en' ? 'Start Time' : locale === 'de' ? 'Startzeit' : 'Время начала'} *
                        </label>
                        <select
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className="input-field"
                        >
                          <option value="06:00">06:00</option>
                          <option value="07:00">07:00</option>
                          <option value="08:00">08:00</option>
                          <option value="09:00">09:00</option>
                          <option value="10:00">10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="12:00">12:00</option>
                          <option value="13:00">13:00</option>
                          <option value="14:00">14:00</option>
                          <option value="15:00">15:00</option>
                          <option value="16:00">16:00</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {locale === 'en' ? 'End Date' : locale === 'de' ? 'Enddatum' : 'Дата окончания'}
                        {tour?.duration && (
                          <span className="text-xs text-secondary-400 font-normal ml-2">
                            ({tour.duration} {locale === 'en' ? 'days tour' : locale === 'de' ? 'Tage Tour' : 'дней тур'})
                          </span>
                        )}
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        readOnly
                        className="input-field bg-secondary-50 cursor-not-allowed"
                        placeholder={locale === 'en' ? 'Select start date first' : locale === 'de' ? 'Wählen Sie zuerst das Startdatum' : 'Сначала выберите дату начала'}
                      />
                      {!formData.startDate && (
                        <p className="text-xs text-secondary-400 mt-1">
                          {locale === 'en' ? 'Auto-calculated based on tour duration' : locale === 'de' ? 'Automatisch berechnet basierend auf der Tourdauer' : 'Автоматически рассчитывается на основе продолжительности тура'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.adults')} *
                      </label>
                      <select
                        name="adults"
                        value={formData.adults}
                        onChange={handleChange}
                        className="input-field"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.children')} (0-5)
                      </label>
                      <select
                        name="children"
                        value={formData.children}
                        onChange={handleChange}
                        className="input-field"
                      >
                        {[0, 1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.specialRequests')}
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        rows={4}
                        className="input-field"
                        placeholder={locale === 'en' ? 'Dietary requirements, accessibility needs, special requests...' : locale === 'de' ? 'Ernährungsanforderungen, Barrierefreiheit, besondere Wünsche...' : 'Диетические требования, особые пожелания...'}
                      ></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {locale === 'en' ? 'How did you hear about us?' : locale === 'de' ? 'Wie haben Sie von uns erfahren?' : 'Как вы узнали о нас?'}
                      </label>
                      <select
                        name="howDidYouHear"
                        value={formData.howDidYouHear}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">{locale === 'en' ? 'Please select' : locale === 'de' ? 'Bitte auswählen' : 'Выберите'}</option>
                        <option value="google">Google</option>
                        <option value="tripadvisor">TripAdvisor</option>
                        <option value="gyg">GetYourGuide</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="friend">{locale === 'en' ? 'Friend/Family' : locale === 'de' ? 'Freunde/Familie' : 'Друзья/Семья'}</option>
                        <option value="other">{locale === 'en' ? 'Other' : locale === 'de' ? 'Andere' : 'Другое'}</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                      {locale === 'en' ? 'Back' : locale === 'de' ? 'Zurück' : 'Назад'}
                    </button>
                    <button type="button" onClick={nextStep} className="btn-primary">
                      {locale === 'en' ? 'Continue' : locale === 'de' ? 'Weiter' : 'Продолжить'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-secondary-800 mb-6 flex items-center gap-2">
                    <CreditCard className="text-primary-500" size={24} />
                    {locale === 'en' ? 'Confirm Booking' : locale === 'de' ? 'Buchung bestätigen' : 'Подтвердить бронирование'}
                  </h2>

                  <div className="bg-secondary-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-secondary-800 mb-4">
                      {locale === 'en' ? 'Booking Summary' : locale === 'de' ? 'Buchungsübersicht' : 'Сводка бронирования'}
                    </h3>
                    <div className="space-y-3 text-secondary-600">
                      <div className="flex justify-between">
                        <span>{locale === 'en' ? 'Tour' : locale === 'de' ? 'Tour' : 'Тур'}:</span>
                        <span className="font-medium text-secondary-800">{getTourTitle()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('booking.firstName')}:</span>
                        <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('booking.email')}:</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('booking.phone')}:</span>
                        <span className="font-medium">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{locale === 'en' ? 'Tour Type' : locale === 'de' ? 'Tourart' : 'Тип тура'}:</span>
                        <span className="font-medium">{formData.tourType === 'private' ? (locale === 'en' ? 'Private' : locale === 'de' ? 'Privat' : 'Приватный') : (locale === 'en' ? 'Group' : locale === 'de' ? 'Gruppe' : 'Групповой')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('booking.startDate')}:</span>
                        <span className="font-medium">{formData.startDate} {formData.startTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{locale === 'en' ? 'End Date' : locale === 'de' ? 'Enddatum' : 'Дата окончания'}:</span>
                        <span className="font-medium">{formData.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('booking.travelers')}:</span>
                        <span className="font-medium">{adultsCount} {t('booking.adults')}, {childrenCount} {t('booking.children')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-blue-800">
                      {locale === 'en' && 'This is a booking request. Our team will contact you within 24 hours to confirm availability and provide payment details.'}
                      {locale === 'de' && 'Dies ist eine Buchungsanfrage. Unser Team wird Sie innerhalb von 24 Stunden kontaktieren, um die Verfügbarkeit zu bestätigen und Zahlungsdetails bereitzustellen.'}
                      {locale === 'ru' && 'Это запрос на бронирование. Наша команда свяжется с вами в течение 24 часов для подтверждения наличия мест и предоставления платежных реквизитов.'}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                      {locale === 'en' ? 'Back' : locale === 'de' ? 'Zurück' : 'Назад'}
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          {locale === 'en' ? 'Submitting...' : locale === 'de' ? 'Wird gesendet...' : 'Отправка...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          {locale === 'en' ? 'Submit Booking Request' : locale === 'de' ? 'Buchungsanfrage senden' : 'Отправить запрос'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar - Tour & Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm sticky top-24 overflow-hidden">
              {/* Tour Image & Info */}
              {tour && (
                <div>
                  <div className="relative h-48">
                    <Image
                      src={tour.main_image || '/images/placeholder-tour.jpg'}
                      alt={getTourTitle()}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 border-b border-secondary-100">
                    <h3 className="font-bold text-secondary-800 mb-2">{getTourTitle()}</h3>
                    <div className="flex items-center gap-4 text-sm text-secondary-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {tour.destination}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {tour.duration} {locale === 'en' ? 'days' : locale === 'de' ? 'Tage' : 'дней'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div className="p-4">
                <h3 className="font-bold text-secondary-800 mb-4">
                  {locale === 'en' ? 'Price Summary' : locale === 'de' ? 'Preisübersicht' : 'Сводка цен'}
                </h3>

                <div className="space-y-3 mb-4">
                  {/* Adults pricing */}
                  <div className="flex justify-between items-center text-secondary-600">
                    <div>
                      <span>{adultsCount} {t('booking.adults')}</span>
                      <span className="text-secondary-400 text-sm ml-1">× €{getPerPersonPrice().adultPrice.toLocaleString()}</span>
                    </div>
                    <span className="font-medium">€{(getPerPersonPrice().adultPrice * adultsCount).toLocaleString()}</span>
                  </div>
                  {/* Children pricing - FREE */}
                  {childrenCount > 0 && (
                    <div className="flex justify-between items-center text-secondary-600">
                      <div>
                        <span>{childrenCount} {t('booking.children')}</span>
                        <span className="text-secondary-400 text-sm ml-1">(0-5)</span>
                      </div>
                      <span className="font-medium text-green-600">{locale === 'en' ? 'FREE' : locale === 'de' ? 'GRATIS' : 'БЕСПЛАТНО'}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between text-lg font-bold text-secondary-800">
                    <span>{locale === 'en' ? 'Estimated Total' : locale === 'de' ? 'Geschätzte Gesamtsumme' : 'Примерная сумма'}</span>
                    <span className="text-primary-500">€{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-xs text-secondary-400">
                  {locale === 'en' ? '* Final price will be confirmed by our team' : locale === 'de' ? '* Endpreis wird von unserem Team bestätigt' : '* Окончательная цена будет подтверждена нашей командой'}
                </div>
              </div>

              {/* Benefits */}
              <div className="p-4 bg-secondary-50">
                <div className="text-sm text-secondary-600 space-y-2">
                  <p className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    {locale === 'en' ? 'Free cancellation up to 30 days' : locale === 'de' ? 'Kostenlose Stornierung bis 30 Tage' : 'Бесплатная отмена до 30 дней'}
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    {locale === 'en' ? 'Best price guarantee' : locale === 'de' ? 'Bestpreisgarantie' : 'Гарантия лучшей цены'}
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    {locale === 'en' ? '24/7 customer support' : locale === 'de' ? '24/7 Kundenservice' : 'Поддержка 24/7'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
