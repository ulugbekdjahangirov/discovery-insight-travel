'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Award, Users, Globe, Heart, Star, Shield, Zap, Target, Loader2 } from 'lucide-react';

interface StoryImage {
  url: string;
  alt: string;
}

interface Stat {
  value: string;
  label_en: string;
  label_de: string;
  label_ru: string;
}

interface Value {
  icon: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  description_en: string;
  description_de: string;
  description_ru: string;
}

interface TeamMember {
  name: string;
  role_en: string;
  role_de: string;
  role_ru: string;
  image: string;
}

interface AboutContent {
  hero_image: string;
  hero_subtitle_en: string;
  hero_subtitle_de: string;
  hero_subtitle_ru: string;
  story_title_en: string;
  story_title_de: string;
  story_title_ru: string;
  story_paragraph1_en: string;
  story_paragraph1_de: string;
  story_paragraph1_ru: string;
  story_paragraph2_en: string;
  story_paragraph2_de: string;
  story_paragraph2_ru: string;
  story_images: StoryImage[];
  stats: Stat[];
  values: Value[];
  team_title_en: string;
  team_title_de: string;
  team_title_ru: string;
  team_subtitle_en: string;
  team_subtitle_de: string;
  team_subtitle_ru: string;
  team_members: TeamMember[];
}

// Icon map for dynamic rendering
const iconMap: Record<string, typeof Heart> = {
  Heart,
  Award,
  Users,
  Globe,
  Star,
  Shield,
  Zap,
  Target,
};

// Default content as fallback
const defaultContent: AboutContent = {
  hero_image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=2000&q=80',
  hero_subtitle_en: 'Discover the story behind Discovery Insight Travel and our passion for Central Asia',
  hero_subtitle_de: 'Entdecken Sie die Geschichte von Discovery Insight Travel und unsere Leidenschaft für Zentralasien',
  hero_subtitle_ru: 'Узнайте историю Discovery Insight Travel и нашу страсть к Центральной Азии',
  story_title_en: 'Our Story',
  story_title_de: 'Unsere Geschichte',
  story_title_ru: 'Наша история',
  story_paragraph1_en: 'Founded in 2009, Discovery Insight Travel began with a simple mission: to share the incredible beauty and rich cultural heritage of Central Asia with travelers from around the world. What started as a small family business in Tashkent has grown into one of the leading tour operators in the region.',
  story_paragraph1_de: 'Discovery Insight Travel wurde 2009 mit einer einfachen Mission gegründet: die unglaubliche Schönheit und das reiche kulturelle Erbe Zentralasiens mit Reisenden aus aller Welt zu teilen. Was als kleines Familienunternehmen in Taschkent begann, ist zu einem der führenden Reiseveranstalter der Region geworden.',
  story_paragraph1_ru: 'Основанная в 2009 году, Discovery Insight Travel начала с простой миссии: поделиться невероятной красотой и богатым культурным наследием Центральной Азии с путешественниками со всего мира. То, что начиналось как небольшой семейный бизнес в Ташкенте, выросло в одного из ведущих туроператоров региона.',
  story_paragraph2_en: 'Our team of passionate travel experts and knowledgeable local guides work together to create unforgettable experiences. We believe in responsible tourism that benefits local communities while preserving the unique heritage of the Silk Road.',
  story_paragraph2_de: 'Unser Team aus leidenschaftlichen Reiseexperten und sachkundigen lokalen Guides arbeitet zusammen, um unvergessliche Erlebnisse zu schaffen. Wir glauben an verantwortungsvollen Tourismus, der lokalen Gemeinschaften zugute kommt und das einzigartige Erbe der Seidenstraße bewahrt.',
  story_paragraph2_ru: 'Наша команда увлеченных экспертов по путешествиям и знающих местных гидов работает вместе, чтобы создавать незабываемые впечатления. Мы верим в ответственный туризм, который приносит пользу местным сообществам и сохраняет уникальное наследие Шелкового пути.',
  story_images: [
    { url: 'https://images.unsplash.com/photo-1580742314666-5bf5b15c94c0?auto=format&fit=crop&w=400&q=80', alt: 'Samarkand' },
    { url: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=400&q=80', alt: 'Bukhara' },
    { url: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=400&q=80', alt: 'Registan' },
    { url: 'https://images.unsplash.com/photo-1590595906931-81120976ec5d?auto=format&fit=crop&w=400&q=80', alt: 'Kazakhstan' },
  ],
  stats: [
    { value: '15+', label_en: 'Years Experience', label_de: 'Jahre Erfahrung', label_ru: 'Лет опыта' },
    { value: '5000+', label_en: 'Happy Travelers', label_de: 'Zufriedene Reisende', label_ru: 'Довольных туристов' },
    { value: '50+', label_en: 'Tour Packages', label_de: 'Reisepakete', label_ru: 'Турпакетов' },
    { value: '4.9', label_en: 'Average Rating', label_de: 'Durchschnittsbewertung', label_ru: 'Средняя оценка' },
  ],
  values: [
    { icon: 'Heart', title_en: 'Passion', title_de: 'Leidenschaft', title_ru: 'Страсть', description_en: 'We love what we do and it shows in every tour we create', description_de: 'Wir lieben was wir tun und das zeigt sich in jeder Reise', description_ru: 'Мы любим то, что делаем, и это видно в каждом туре' },
    { icon: 'Award', title_en: 'Excellence', title_de: 'Exzellenz', title_ru: 'Совершенство', description_en: 'We strive for the highest quality in everything we offer', description_de: 'Wir streben nach höchster Qualität in allem, was wir anbieten', description_ru: 'Мы стремимся к высочайшему качеству во всем' },
    { icon: 'Users', title_en: 'Community', title_de: 'Gemeinschaft', title_ru: 'Сообщество', description_en: 'We support local communities and sustainable tourism', description_de: 'Wir unterstützen lokale Gemeinschaften und nachhaltigen Tourismus', description_ru: 'Мы поддерживаем местные сообщества и устойчивый туризм' },
    { icon: 'Globe', title_en: 'Authenticity', title_de: 'Authentizität', title_ru: 'Аутентичность', description_en: 'We provide genuine cultural experiences, not tourist traps', description_de: 'Wir bieten echte kulturelle Erfahrungen, keine Touristenfallen', description_ru: 'Мы предлагаем подлинные культурные впечатления' },
  ],
  team_title_en: 'Meet Our Team',
  team_title_de: 'Unser Team',
  team_title_ru: 'Наша команда',
  team_subtitle_en: 'The passionate people behind your unforgettable travel experiences',
  team_subtitle_de: 'Die leidenschaftlichen Menschen hinter Ihren unvergesslichen Reiseerlebnissen',
  team_subtitle_ru: 'Увлеченные люди, создающие ваши незабываемые путешествия',
  team_members: [
    { name: 'Akmal Karimov', role_en: 'Founder & CEO', role_de: 'Gründer & CEO', role_ru: 'Основатель и CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { name: 'Dilnoza Yusupova', role_en: 'Operations Manager', role_de: 'Betriebsleiterin', role_ru: 'Операционный директор', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
    { name: 'Sardor Alimov', role_en: 'Head Tour Guide', role_de: 'Leitender Reiseführer', role_ru: 'Главный гид', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
    { name: 'Nodira Rahimova', role_en: 'Customer Relations', role_de: 'Kundenbetreuung', role_ru: 'Связи с клиентами', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80' },
  ],
};

export default function AboutPage() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/about');
        if (response.ok) {
          const data = await response.json();
          // Merge with defaults for any missing fields
          setContent({
            ...defaultContent,
            ...data,
            story_images: data.story_images?.length > 0 ? data.story_images : defaultContent.story_images,
            stats: data.stats?.length > 0 ? data.stats : defaultContent.stats,
            values: data.values?.length > 0 ? data.values : defaultContent.values,
            team_members: data.team_members?.length > 0 ? data.team_members : defaultContent.team_members,
          });
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Helper functions for localized content
  const getLocalizedText = (field: string) => {
    const key = `${field}_${locale}` as keyof AboutContent;
    return (content[key] as string) || (content[`${field}_en` as keyof AboutContent] as string) || '';
  };

  const getStatLabel = (stat: Stat) => {
    return stat[`label_${locale}` as keyof Stat] || stat.label_en;
  };

  const getValueTitle = (value: Value) => {
    return value[`title_${locale}` as keyof Value] || value.title_en;
  };

  const getValueDescription = (value: Value) => {
    return value[`description_${locale}` as keyof Value] || value.description_en;
  };

  const getTeamRole = (member: TeamMember) => {
    return member[`role_${locale}` as keyof TeamMember] || member.role_en;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero */}
      <div
        className="relative h-[400px] flex items-center"
        style={{
          backgroundImage: `url('${content.hero_image || defaultContent.hero_image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container-custom relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('common.about')}</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {getLocalizedText('hero_subtitle')}
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">{getLocalizedText('story_title')}</h2>
              <p className="text-secondary-600 mb-4 leading-relaxed">
                {getLocalizedText('story_paragraph1')}
              </p>
              <p className="text-secondary-600 leading-relaxed">
                {getLocalizedText('story_paragraph2')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {content.story_images.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.alt}
                  className={`rounded-xl h-48 w-full object-cover ${
                    idx === 1 ? 'mt-8' : idx === 2 ? '-mt-8' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {content.stats.length > 0 && (
        <section className="py-16 bg-primary-500">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {content.stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{getStatLabel(stat)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      {content.values.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="section-title text-center">
              {locale === 'en' ? 'Our Values' : locale === 'de' ? 'Unsere Werte' : 'Наши ценности'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {content.values.map((value, idx) => {
                const IconComponent = iconMap[value.icon] || Heart;
                return (
                  <div key={idx} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-primary-500" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                      {getValueTitle(value)}
                    </h3>
                    <p className="text-secondary-600">{getValueDescription(value)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {content.team_members.length > 0 && (
        <section className="py-16 bg-secondary-50">
          <div className="container-custom">
            <h2 className="section-title text-center">{getLocalizedText('team_title')}</h2>
            <p className="section-subtitle text-center max-w-2xl mx-auto">
              {getLocalizedText('team_subtitle')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {content.team_members.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-secondary-800">{member.name}</h3>
                    <p className="text-primary-500">{getTeamRole(member)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
