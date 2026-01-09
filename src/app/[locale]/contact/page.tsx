'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero */}
      <div className="bg-primary-500 py-16 md:py-24">
        <div className="container-custom text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-secondary-800 mb-6">
                {locale === 'en' ? 'Get in Touch' : locale === 'de' ? 'Kontakt' : 'Свяжитесь с нами'}
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-800">{t('contact.address')}</h3>
                    <p className="text-secondary-600">
                      123 Amir Temur Street<br />
                      Tashkent, Uzbekistan 100000
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-800">{t('contact.phone')}</h3>
                    <p className="text-secondary-600">+998 93 348 42 08</p>
                    <p className="text-secondary-600 text-sm text-primary-500">(WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-800">Email</h3>
                    <p className="text-secondary-600">info@discoveryinsight.uz</p>
                    <p className="text-secondary-600">booking@discoveryinsight.uz</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-800">{t('contact.workingHours')}</h3>
                    <p className="text-secondary-600">{t('contact.workingHoursValue')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="h-64 bg-secondary-200 flex items-center justify-center">
                <p className="text-secondary-500">
                  {locale === 'en' ? 'Map will be displayed here' : locale === 'de' ? 'Karte wird hier angezeigt' : 'Здесь будет карта'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-secondary-800 mb-6">
                {locale === 'en' ? 'Send us a Message' : locale === 'de' ? 'Nachricht senden' : 'Отправить сообщение'}
              </h2>

              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-500" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                    {locale === 'en' ? 'Message Sent!' : locale === 'de' ? 'Nachricht gesendet!' : 'Сообщение отправлено!'}
                  </h3>
                  <p className="text-secondary-600 mb-6">
                    {locale === 'en' && "Thank you for contacting us. We'll get back to you within 24 hours."}
                    {locale === 'de' && 'Vielen Dank für Ihre Nachricht. Wir melden uns innerhalb von 24 Stunden.'}
                    {locale === 'ru' && 'Спасибо за обращение. Мы ответим вам в течение 24 часов.'}
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="btn-primary"
                  >
                    {locale === 'en' ? 'Send Another Message' : locale === 'de' ? 'Weitere Nachricht senden' : 'Отправить еще'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('contact.name')} *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {t('contact.email')} *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t('contact.subject')} *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      {t('contact.message')} *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="input-field"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>{locale === 'en' ? 'Sending...' : locale === 'de' ? 'Senden...' : 'Отправка...'}</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>{t('contact.send')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
