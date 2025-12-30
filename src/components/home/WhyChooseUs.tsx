'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Shield, Users, Award, HeadphonesIcon, Globe, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: { en: 'Safe Travel', de: 'Sicheres Reisen', ru: 'Безопасное путешествие' },
    description: {
      en: 'Your safety is our top priority with 24/7 support',
      de: 'Ihre Sicherheit hat höchste Priorität mit 24/7 Support',
      ru: 'Ваша безопасность - наш приоритет с круглосуточной поддержкой',
    },
  },
  {
    icon: Users,
    title: { en: 'Expert Guides', de: 'Experten-Guides', ru: 'Опытные гиды' },
    description: {
      en: 'Local experts with deep knowledge of the region',
      de: 'Lokale Experten mit tiefem Wissen über die Region',
      ru: 'Местные эксперты с глубоким знанием региона',
    },
  },
  {
    icon: Award,
    title: { en: 'Best Price', de: 'Bester Preis', ru: 'Лучшая цена' },
    description: {
      en: 'Competitive prices without compromising quality',
      de: 'Wettbewerbsfähige Preise ohne Kompromisse bei der Qualität',
      ru: 'Конкурентные цены без ущерба для качества',
    },
  },
  {
    icon: HeadphonesIcon,
    title: { en: '24/7 Support', de: '24/7 Unterstützung', ru: 'Поддержка 24/7' },
    description: {
      en: 'Always here to help before, during and after your trip',
      de: 'Immer für Sie da - vor, während und nach Ihrer Reise',
      ru: 'Всегда готовы помочь до, во время и после поездки',
    },
  },
  {
    icon: Globe,
    title: { en: 'Local Experience', de: 'Lokale Erfahrung', ru: 'Местный опыт' },
    description: {
      en: 'Authentic experiences with local communities',
      de: 'Authentische Erlebnisse mit lokalen Gemeinschaften',
      ru: 'Аутентичные впечатления с местными сообществами',
    },
  },
  {
    icon: Sparkles,
    title: { en: 'Tailor Made', de: 'Maßgeschneidert', ru: 'Индивидуальный подход' },
    description: {
      en: 'Customized tours to match your preferences',
      de: 'Individuelle Reisen nach Ihren Wünschen',
      ru: 'Индивидуальные туры под ваши предпочтения',
    },
  },
];

export default function WhyChooseUs() {
  const locale = useLocale() as 'en' | 'de' | 'ru';

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">
            {locale === 'en' && 'Why Choose Us'}
            {locale === 'de' && 'Warum uns wählen'}
            {locale === 'ru' && 'Почему выбирают нас'}
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {locale === 'en' && 'We create unforgettable travel experiences with passion and expertise'}
            {locale === 'de' && 'Wir schaffen unvergessliche Reiseerlebnisse mit Leidenschaft und Expertise'}
            {locale === 'ru' && 'Мы создаем незабываемые путешествия с страстью и профессионализмом'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl hover:bg-secondary-50 transition-colors group"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500 transition-colors">
                <feature.icon className="text-primary-500 group-hover:text-white transition-colors" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">{feature.title[locale]}</h3>
              <p className="text-secondary-600">{feature.description[locale]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
