-- About Content Table for managing About Us page
-- First drop existing table if exists
DROP TABLE IF EXISTS about_content;

CREATE TABLE about_content (
  id SERIAL PRIMARY KEY,

  -- Hero Section
  hero_image TEXT DEFAULT '',
  hero_subtitle_en TEXT DEFAULT '',
  hero_subtitle_de TEXT DEFAULT '',
  hero_subtitle_ru TEXT DEFAULT '',

  -- Our Story Section
  story_title_en TEXT DEFAULT 'Our Story',
  story_title_de TEXT DEFAULT 'Unsere Geschichte',
  story_title_ru TEXT DEFAULT 'Наша история',
  story_paragraph1_en TEXT DEFAULT '',
  story_paragraph1_de TEXT DEFAULT '',
  story_paragraph1_ru TEXT DEFAULT '',
  story_paragraph2_en TEXT DEFAULT '',
  story_paragraph2_de TEXT DEFAULT '',
  story_paragraph2_ru TEXT DEFAULT '',
  story_images JSONB DEFAULT '[]'::jsonb,

  -- Stats Section
  stats JSONB DEFAULT '[]'::jsonb,

  -- Values Section
  values JSONB DEFAULT '[]'::jsonb,

  -- Team Section
  team_title_en TEXT DEFAULT 'Meet Our Team',
  team_title_de TEXT DEFAULT 'Unser Team',
  team_title_ru TEXT DEFAULT 'Наша команда',
  team_subtitle_en TEXT DEFAULT '',
  team_subtitle_de TEXT DEFAULT '',
  team_subtitle_ru TEXT DEFAULT '',
  team_members JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert test content
INSERT INTO about_content (
  hero_image,
  hero_subtitle_en,
  hero_subtitle_de,
  hero_subtitle_ru,
  story_title_en,
  story_title_de,
  story_title_ru,
  story_paragraph1_en,
  story_paragraph1_de,
  story_paragraph1_ru,
  story_paragraph2_en,
  story_paragraph2_de,
  story_paragraph2_ru,
  story_images,
  stats,
  values,
  team_title_en,
  team_title_de,
  team_title_ru,
  team_subtitle_en,
  team_subtitle_de,
  team_subtitle_ru,
  team_members
) VALUES (
  'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=2000&q=80',
  'Discover the story behind Discovery Insight Travel - your trusted partner for authentic Central Asian adventures since 2009',
  'Entdecken Sie die Geschichte von Discovery Insight Travel - Ihr vertrauenswürdiger Partner für authentische zentralasiatische Abenteuer seit 2009',
  'Узнайте историю Discovery Insight Travel - вашего надежного партнера по аутентичным путешествиям в Центральную Азию с 2009 года',
  'Our Story',
  'Unsere Geschichte',
  'Наша история',
  'Discovery Insight Travel was founded in 2009 in Tashkent, Uzbekistan with a passionate mission: to share the incredible beauty, rich history, and warm hospitality of Central Asia with travelers from around the world. What began as a small family business has grown into one of the most respected tour operators in the region, known for our authentic experiences and personalized service.',
  'Discovery Insight Travel wurde 2009 in Taschkent, Usbekistan, mit einer leidenschaftlichen Mission gegründet: die unglaubliche Schönheit, reiche Geschichte und herzliche Gastfreundschaft Zentralasiens mit Reisenden aus aller Welt zu teilen. Was als kleines Familienunternehmen begann, ist zu einem der angesehensten Reiseveranstalter der Region geworden, bekannt für authentische Erlebnisse und persönlichen Service.',
  'Discovery Insight Travel была основана в 2009 году в Ташкенте, Узбекистан, с увлеченной миссией: делиться невероятной красотой, богатой историей и теплым гостеприимством Центральной Азии с путешественниками со всего мира. То, что начиналось как небольшой семейный бизнес, превратилось в одного из самых уважаемых туроператоров региона, известного подлинными впечатлениями и персонализированным сервисом.',
  'Our team consists of passionate travel experts, certified guides, and local specialists who share a deep love for Central Asia. We believe in sustainable tourism that benefits local communities while preserving the unique cultural heritage of the Silk Road. Every tour we create is designed to provide meaningful connections with local people, authentic culinary experiences, and unforgettable memories.',
  'Unser Team besteht aus leidenschaftlichen Reiseexperten, zertifizierten Guides und lokalen Spezialisten, die eine tiefe Liebe für Zentralasien teilen. Wir glauben an nachhaltigen Tourismus, der lokalen Gemeinschaften zugutekommt und das einzigartige kulturelle Erbe der Seidenstraße bewahrt. Jede Tour, die wir erstellen, ist darauf ausgerichtet, bedeutungsvolle Verbindungen mit der lokalen Bevölkerung, authentische kulinarische Erlebnisse und unvergessliche Erinnerungen zu bieten.',
  'Наша команда состоит из увлеченных экспертов по путешествиям, сертифицированных гидов и местных специалистов, которые разделяют глубокую любовь к Центральной Азии. Мы верим в устойчивый туризм, который приносит пользу местным сообществам и сохраняет уникальное культурное наследие Шелкового пути. Каждый тур, который мы создаем, предназначен для значимых связей с местными жителями, аутентичных кулинарных впечатлений и незабываемых воспоминаний.',
  '[
    {"url": "https://images.unsplash.com/photo-1580742314666-5bf5b15c94c0?auto=format&fit=crop&w=600&q=80", "alt": "Registan Square Samarkand"},
    {"url": "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=600&q=80", "alt": "Bukhara Old City"},
    {"url": "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=600&q=80", "alt": "Samarkand Architecture"},
    {"url": "https://images.unsplash.com/photo-1590595906931-81120976ec5d?auto=format&fit=crop&w=600&q=80", "alt": "Khiva Minaret"}
  ]'::jsonb,
  '[
    {"value": "15+", "label_en": "Years of Experience", "label_de": "Jahre Erfahrung", "label_ru": "Лет опыта"},
    {"value": "10,000+", "label_en": "Happy Travelers", "label_de": "Zufriedene Reisende", "label_ru": "Довольных туристов"},
    {"value": "150+", "label_en": "Unique Tours", "label_de": "Einzigartige Touren", "label_ru": "Уникальных туров"},
    {"value": "4.9", "label_en": "Average Rating", "label_de": "Durchschnittsbewertung", "label_ru": "Средняя оценка"}
  ]'::jsonb,
  '[
    {
      "icon": "Heart",
      "title_en": "Passion",
      "title_de": "Leidenschaft",
      "title_ru": "Страсть",
      "description_en": "We are deeply passionate about Central Asia and it reflects in every tour we design. Our love for the region drives us to create exceptional experiences.",
      "description_de": "Wir sind zutiefst leidenschaftlich für Zentralasien und das spiegelt sich in jeder Tour wider, die wir gestalten. Unsere Liebe zur Region treibt uns an, außergewöhnliche Erlebnisse zu schaffen.",
      "description_ru": "Мы глубоко увлечены Центральной Азией, и это отражается в каждом туре, который мы создаем. Наша любовь к региону побуждает нас создавать исключительные впечатления."
    },
    {
      "icon": "Award",
      "title_en": "Excellence",
      "title_de": "Exzellenz",
      "title_ru": "Совершенство",
      "description_en": "We maintain the highest standards in everything we do - from selecting the best hotels to training our guides. Quality is never compromised.",
      "description_de": "Wir halten die höchsten Standards in allem, was wir tun - von der Auswahl der besten Hotels bis zur Schulung unserer Guides. Qualität wird nie kompromittiert.",
      "description_ru": "Мы поддерживаем высочайшие стандарты во всем, что делаем - от выбора лучших отелей до обучения наших гидов. Качество никогда не страдает."
    },
    {
      "icon": "Users",
      "title_en": "Community",
      "title_de": "Gemeinschaft",
      "title_ru": "Сообщество",
      "description_en": "We support local communities through sustainable tourism practices. Your travels directly benefit local artisans, families, and businesses.",
      "description_de": "Wir unterstützen lokale Gemeinschaften durch nachhaltige Tourismuspraktiken. Ihre Reisen kommen direkt lokalen Handwerkern, Familien und Unternehmen zugute.",
      "description_ru": "Мы поддерживаем местные сообщества через устойчивые туристические практики. Ваши путешествия напрямую приносят пользу местным ремесленникам, семьям и предприятиям."
    },
    {
      "icon": "Globe",
      "title_en": "Authenticity",
      "title_de": "Authentizität",
      "title_ru": "Подлинность",
      "description_en": "We provide genuine cultural experiences, not tourist traps. Meet real families, taste authentic cuisine, and discover hidden gems off the beaten path.",
      "description_de": "Wir bieten echte kulturelle Erfahrungen, keine Touristenfallen. Treffen Sie echte Familien, probieren Sie authentische Küche und entdecken Sie verborgene Schätze abseits der ausgetretenen Pfade.",
      "description_ru": "Мы предоставляем подлинные культурные впечатления, а не туристические ловушки. Познакомьтесь с настоящими семьями, попробуйте аутентичную кухню и откройте для себя скрытые жемчужины вдали от проторенных дорог."
    }
  ]'::jsonb,
  'Meet Our Expert Team',
  'Lernen Sie unser Expertenteam kennen',
  'Познакомьтесь с нашей командой экспертов',
  'Our dedicated team of travel professionals is committed to making your Central Asian adventure truly unforgettable',
  'Unser engagiertes Team von Reiseprofis ist bestrebt, Ihr zentralasiatisches Abenteuer wirklich unvergesslich zu machen',
  'Наша преданная команда туристических профессионалов стремится сделать ваше центральноазиатское приключение по-настоящему незабываемым',
  '[
    {
      "name": "Akmal Karimov",
      "role_en": "Founder & CEO",
      "role_de": "Gründer & CEO",
      "role_ru": "Основатель и CEO",
      "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      "name": "Dilnoza Yusupova",
      "role_en": "Operations Director",
      "role_de": "Betriebsdirektorin",
      "role_ru": "Операционный директор",
      "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
    },
    {
      "name": "Sardor Alimov",
      "role_en": "Head Tour Guide",
      "role_de": "Leitender Reiseführer",
      "role_ru": "Главный гид",
      "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
    },
    {
      "name": "Nodira Rahimova",
      "role_en": "Customer Relations Manager",
      "role_de": "Kundenbeziehungsmanagerin",
      "role_ru": "Менеджер по работе с клиентами",
      "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80"
    }
  ]'::jsonb
);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_about_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_about_content_timestamp ON about_content;
CREATE TRIGGER update_about_content_timestamp
  BEFORE UPDATE ON about_content
  FOR EACH ROW
  EXECUTE FUNCTION update_about_content_timestamp();
