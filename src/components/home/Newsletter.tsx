'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Send, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const t = useTranslations();
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 md:py-24 bg-secondary-100">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title">
            {locale === 'en' && 'Get Travel Inspiration'}
            {locale === 'de' && 'Reiseinspiration erhalten'}
            {locale === 'ru' && 'Получите вдохновение для путешествий'}
          </h2>
          <p className="section-subtitle">
            {locale === 'en' && 'Subscribe to our newsletter for exclusive offers, travel tips, and destination guides'}
            {locale === 'de' && 'Abonnieren Sie unseren Newsletter für exklusive Angebote, Reisetipps und Reiseführer'}
            {locale === 'ru' && 'Подпишитесь на нашу рассылку для эксклюзивных предложений, советов и путеводителей'}
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-100 py-4 px-6 rounded-lg">
              <CheckCircle size={24} />
              <span className="font-medium">
                {locale === 'en' && 'Thank you for subscribing!'}
                {locale === 'de' && 'Vielen Dank für Ihre Anmeldung!'}
                {locale === 'ru' && 'Спасибо за подписку!'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                className="input-field flex-grow"
                required
              />
              <button type="submit" className="btn-primary flex items-center justify-center gap-2">
                <Send size={18} />
                <span>{t('footer.subscribe')}</span>
              </button>
            </form>
          )}

          <p className="text-secondary-500 text-sm mt-4">
            {locale === 'en' && 'No spam, unsubscribe anytime'}
            {locale === 'de' && 'Kein Spam, jederzeit abmelden'}
            {locale === 'ru' && 'Без спама, отписаться можно в любое время'}
          </p>
        </div>
      </div>
    </section>
  );
}
