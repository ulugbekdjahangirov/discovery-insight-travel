'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
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
} from 'lucide-react';

export default function BookingPage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const searchParams = useSearchParams();
  const tourSlug = searchParams.get('tour');

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    adults: '2',
    children: '0',
    startDate: '',
    specialRequests: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const tourPrice = 1299;
  const adultsCount = parseInt(formData.adults) || 1;
  const childrenCount = parseInt(formData.children) || 0;
  const totalPrice = tourPrice * adultsCount + (tourPrice * 0.5 * childrenCount);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-secondary-50 py-16">
        <div className="container-custom">
          <div className="max-w-xl mx-auto bg-white rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <h1 className="text-3xl font-bold text-secondary-800 mb-4">{t('booking.success')}</h1>
            <p className="text-secondary-600 mb-8">{t('booking.successMessage')}</p>
            <div className="bg-secondary-50 rounded-lg p-6 text-left mb-6">
              <h3 className="font-semibold text-secondary-800 mb-4">
                {locale === 'en' ? 'Booking Details' : locale === 'de' ? 'Buchungsdetails' : 'Детали бронирования'}
              </h3>
              <div className="space-y-2 text-secondary-600">
                <p><strong>{t('booking.firstName')}:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>{t('booking.email')}:</strong> {formData.email}</p>
                <p><strong>{t('booking.startDate')}:</strong> {formData.startDate}</p>
                <p><strong>{t('booking.travelers')}:</strong> {adultsCount} {t('booking.adults')}, {childrenCount} {t('booking.children')}</p>
                <p><strong>{t('booking.totalPrice')}:</strong> €{totalPrice.toLocaleString()}</p>
              </div>
            </div>
            <a href={`/${locale}`} className="btn-primary inline-block">
              {t('common.home')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 text-center mb-8">
          {t('booking.title')}
        </h1>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-500'}`}>
              1
            </div>
            <div className={`w-20 h-1 ${step >= 2 ? 'bg-primary-500' : 'bg-secondary-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-500'}`}>
              2
            </div>
            <div className={`w-20 h-1 ${step >= 3 ? 'bg-primary-500' : 'bg-secondary-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-500'}`}>
              3
            </div>
          </div>
        </div>

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
                        required
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
                        required
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
                          required
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
                          required
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.country')} *
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="input-field pl-10"
                          required
                        >
                          <option value="">Select country</option>
                          <option value="DE">Germany</option>
                          <option value="RU">Russia</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="FR">France</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button type="button" onClick={() => setStep(2)} className="btn-primary">
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
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.startDate')} *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.adults')} *
                      </label>
                      <select
                        name="adults"
                        value={formData.adults}
                        onChange={handleChange}
                        className="input-field"
                        required
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('booking.children')}
                      </label>
                      <select
                        name="children"
                        value={formData.children}
                        onChange={handleChange}
                        className="input-field"
                      >
                        {[0, 1, 2, 3, 4].map((n) => (
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
                        placeholder={locale === 'en' ? 'Any dietary requirements, accessibility needs, or special requests...' : locale === 'de' ? 'Ernährungsanforderungen, Barrierefreiheit oder besondere Wünsche...' : 'Диетические требования, доступность или особые пожелания...'}
                      ></textarea>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                      {locale === 'en' ? 'Back' : locale === 'de' ? 'Zurück' : 'Назад'}
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="btn-primary">
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
                    <div className="space-y-2 text-secondary-600">
                      <div className="flex justify-between">
                        <span>{t('booking.firstName')}:</span>
                        <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('booking.email')}:</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('booking.startDate')}:</span>
                        <span className="font-medium">{formData.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('booking.adults')}:</span>
                        <span className="font-medium">{formData.adults}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('booking.children')}:</span>
                        <span className="font-medium">{formData.children}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                    <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                    <p className="text-sm text-yellow-800">
                      {locale === 'en' && 'By confirming this booking, you agree to our terms and conditions. Payment details will be requested via email.'}
                      {locale === 'de' && 'Mit der Bestätigung dieser Buchung stimmen Sie unseren AGB zu. Die Zahlungsdetails werden per E-Mail angefordert.'}
                      {locale === 'ru' && 'Подтверждая бронирование, вы соглашаетесь с нашими условиями. Платежные данные будут запрошены по электронной почте.'}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                      {locale === 'en' ? 'Back' : locale === 'de' ? 'Zurück' : 'Назад'}
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {locale === 'en' ? 'Processing...' : locale === 'de' ? 'Verarbeitung...' : 'Обработка...'}
                        </span>
                      ) : (
                        t('booking.confirm')
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-secondary-800 mb-4">
                {locale === 'en' ? 'Price Summary' : locale === 'de' ? 'Preisübersicht' : 'Сводка цен'}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-secondary-600">
                  <span>Classic Uzbekistan Tour</span>
                </div>
                <div className="flex justify-between text-secondary-600">
                  <span>{t('booking.adults')} x {adultsCount}</span>
                  <span>€{(tourPrice * adultsCount).toLocaleString()}</span>
                </div>
                {childrenCount > 0 && (
                  <div className="flex justify-between text-secondary-600">
                    <span>{t('booking.children')} x {childrenCount} (50%)</span>
                    <span>€{(tourPrice * 0.5 * childrenCount).toLocaleString()}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between text-lg font-bold text-secondary-800">
                  <span>{t('booking.totalPrice')}</span>
                  <span className="text-primary-500">€{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-sm text-secondary-500">
                <p className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {locale === 'en' ? 'Free cancellation up to 30 days' : locale === 'de' ? 'Kostenlose Stornierung bis 30 Tage' : 'Бесплатная отмена до 30 дней'}
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {locale === 'en' ? 'Best price guarantee' : locale === 'de' ? 'Bestpreisgarantie' : 'Гарантия лучшей цены'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
