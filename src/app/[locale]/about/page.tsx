'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Award, Users, Globe, Heart, MapPin, Star } from 'lucide-react';

const stats = [
  { value: '15+', label: { en: 'Years Experience', de: 'Jahre Erfahrung', ru: 'Лет опыта' } },
  { value: '5000+', label: { en: 'Happy Travelers', de: 'Zufriedene Reisende', ru: 'Довольных туристов' } },
  { value: '50+', label: { en: 'Tour Packages', de: 'Reisepakete', ru: 'Турпакетов' } },
  { value: '4.9', label: { en: 'Average Rating', de: 'Durchschnittsbewertung', ru: 'Средняя оценка' } },
];

const team = [
  {
    name: 'Akmal Karimov',
    role: { en: 'Founder & CEO', de: 'Gründer & CEO', ru: 'Основатель и CEO' },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Dilnoza Yusupova',
    role: { en: 'Operations Manager', de: 'Betriebsleiterin', ru: 'Операционный директор' },
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Sardor Alimov',
    role: { en: 'Head Tour Guide', de: 'Leitender Reiseführer', ru: 'Главный гид' },
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Nodira Rahimova',
    role: { en: 'Customer Relations', de: 'Kundenbetreuung', ru: 'Связи с клиентами' },
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
  },
];

const values = [
  {
    icon: Heart,
    title: { en: 'Passion', de: 'Leidenschaft', ru: 'Страсть' },
    description: {
      en: 'We love what we do and it shows in every tour we create',
      de: 'Wir lieben was wir tun und das zeigt sich in jeder Reise',
      ru: 'Мы любим то, что делаем, и это видно в каждом туре',
    },
  },
  {
    icon: Award,
    title: { en: 'Excellence', de: 'Exzellenz', ru: 'Совершенство' },
    description: {
      en: 'We strive for the highest quality in everything we offer',
      de: 'Wir streben nach höchster Qualität in allem, was wir anbieten',
      ru: 'Мы стремимся к высочайшему качеству во всем',
    },
  },
  {
    icon: Users,
    title: { en: 'Community', de: 'Gemeinschaft', ru: 'Сообщество' },
    description: {
      en: 'We support local communities and sustainable tourism',
      de: 'Wir unterstützen lokale Gemeinschaften und nachhaltigen Tourismus',
      ru: 'Мы поддерживаем местные сообщества и устойчивый туризм',
    },
  },
  {
    icon: Globe,
    title: { en: 'Authenticity', de: 'Authentizität', ru: 'Аутентичность' },
    description: {
      en: 'We provide genuine cultural experiences, not tourist traps',
      de: 'Wir bieten echte kulturelle Erfahrungen, keine Touristenfallen',
      ru: 'Мы предлагаем подлинные культурные впечатления',
    },
  },
];

export default function AboutPage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero */}
      <div
        className="relative h-[400px] flex items-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container-custom relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('common.about')}</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {locale === 'en' && 'Discover the story behind Discovery Insight Travel and our passion for Central Asia'}
            {locale === 'de' && 'Entdecken Sie die Geschichte von Discovery Insight Travel und unsere Leidenschaft für Zentralasien'}
            {locale === 'ru' && 'Узнайте историю Discovery Insight Travel и нашу страсть к Центральной Азии'}
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">
                {locale === 'en' ? 'Our Story' : locale === 'de' ? 'Unsere Geschichte' : 'Наша история'}
              </h2>
              <p className="text-secondary-600 mb-4 leading-relaxed">
                {locale === 'en' &&
                  'Founded in 2009, Discovery Insight Travel began with a simple mission: to share the incredible beauty and rich cultural heritage of Central Asia with travelers from around the world. What started as a small family business in Tashkent has grown into one of the leading tour operators in the region.'}
                {locale === 'de' &&
                  'Discovery Insight Travel wurde 2009 mit einer einfachen Mission gegründet: die unglaubliche Schönheit und das reiche kulturelle Erbe Zentralasiens mit Reisenden aus aller Welt zu teilen. Was als kleines Familienunternehmen in Taschkent begann, ist zu einem der führenden Reiseveranstalter der Region geworden.'}
                {locale === 'ru' &&
                  'Основанная в 2009 году, Discovery Insight Travel начала с простой миссии: поделиться невероятной красотой и богатым культурным наследием Центральной Азии с путешественниками со всего мира. То, что начиналось как небольшой семейный бизнес в Ташкенте, выросло в одного из ведущих туроператоров региона.'}
              </p>
              <p className="text-secondary-600 leading-relaxed">
                {locale === 'en' &&
                  'Our team of passionate travel experts and knowledgeable local guides work together to create unforgettable experiences. We believe in responsible tourism that benefits local communities while preserving the unique heritage of the Silk Road.'}
                {locale === 'de' &&
                  'Unser Team aus leidenschaftlichen Reiseexperten und sachkundigen lokalen Guides arbeitet zusammen, um unvergessliche Erlebnisse zu schaffen. Wir glauben an verantwortungsvollen Tourismus, der lokalen Gemeinschaften zugute kommt und das einzigartige Erbe der Seidenstraße bewahrt.'}
                {locale === 'ru' &&
                  'Наша команда увлеченных экспертов по путешествиям и знающих местных гидов работает вместе, чтобы создавать незабываемые впечатления. Мы верим в ответственный туризм, который приносит пользу местным сообществам и сохраняет уникальное наследие Шелкового пути.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1580742314666-5bf5b15c94c0?auto=format&fit=crop&w=400&q=80"
                alt="Samarkand"
                className="rounded-xl h-48 w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=400&q=80"
                alt="Bukhara"
                className="rounded-xl h-48 w-full object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=400&q=80"
                alt="Registan"
                className="rounded-xl h-48 w-full object-cover -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1590595906931-81120976ec5d?auto=format&fit=crop&w=400&q=80"
                alt="Kazakhstan"
                className="rounded-xl h-48 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-500">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label[locale]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title text-center">
            {locale === 'en' ? 'Our Values' : locale === 'de' ? 'Unsere Werte' : 'Наши ценности'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {values.map((value, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-primary-500" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">{value.title[locale]}</h3>
                <p className="text-secondary-600">{value.description[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <h2 className="section-title text-center">
            {locale === 'en' ? 'Meet Our Team' : locale === 'de' ? 'Unser Team' : 'Наша команда'}
          </h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            {locale === 'en' && 'The passionate people behind your unforgettable travel experiences'}
            {locale === 'de' && 'Die leidenschaftlichen Menschen hinter Ihren unvergesslichen Reiseerlebnissen'}
            {locale === 'ru' && 'Увлеченные люди, создающие ваши незабываемые путешествия'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-secondary-800">{member.name}</h3>
                  <p className="text-primary-500">{member.role[locale]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
