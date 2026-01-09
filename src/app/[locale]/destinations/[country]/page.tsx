import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Calendar, Users, Star, ArrowRight, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Country data with translations and descriptions
const countryData: Record<string, {
  name: { en: string; de: string; ru: string };
  description: { en: string; de: string; ru: string };
  image: string;
  highlights: { en: string[]; de: string[]; ru: string[] };
}> = {
  uzbekistan: {
    name: { en: 'Uzbekistan', de: 'Usbekistan', ru: 'Узбекистан' },
    description: {
      en: 'Uzbekistan is the heart of the ancient Silk Road, featuring stunning Islamic architecture, vibrant bazaars, and rich cultural heritage. Explore the legendary cities of Samarkand, Bukhara, and Khiva.',
      de: 'Usbekistan ist das Herz der alten Seidenstraße mit atemberaubender islamischer Architektur, lebhaften Basaren und reichem kulturellen Erbe. Erkunden Sie die legendären Städte Samarkand, Buchara und Chiwa.',
      ru: 'Узбекистан — сердце древнего Шёлкового пути с потрясающей исламской архитектурой, яркими базарами и богатым культурным наследием. Исследуйте легендарные города Самарканд, Бухару и Хиву.'
    },
    image: '/images/destinations/uzbekistan.jpg',
    highlights: {
      en: ['Registan Square in Samarkand', 'Historic Old Town of Bukhara', 'Itchan Kala in Khiva', 'Chorsu Bazaar in Tashkent'],
      de: ['Registan-Platz in Samarkand', 'Historische Altstadt von Buchara', 'Itchan Kala in Chiwa', 'Chorsu-Basar in Taschkent'],
      ru: ['Площадь Регистан в Самарканде', 'Исторический старый город Бухары', 'Ичан-Кала в Хиве', 'Базар Чорсу в Ташкенте']
    }
  },
  kazakhstan: {
    name: { en: 'Kazakhstan', de: 'Kasachstan', ru: 'Казахстан' },
    description: {
      en: 'Kazakhstan is the largest landlocked country in the world, offering diverse landscapes from the Caspian Sea to the Altai Mountains. Experience modern cities, ancient petroglyphs, and vast steppes.',
      de: 'Kasachstan ist das größte Binnenland der Welt und bietet vielfältige Landschaften vom Kaspischen Meer bis zum Altai-Gebirge. Erleben Sie moderne Städte, antike Petroglyphen und weite Steppen.',
      ru: 'Казахстан — крупнейшая страна, не имеющая выхода к морю, с разнообразными ландшафтами от Каспийского моря до Алтайских гор. Откройте современные города, древние петроглифы и бескрайние степи.'
    },
    image: '/images/destinations/kazakhstan.jpg',
    highlights: {
      en: ['Charyn Canyon', 'Almaty and Big Almaty Lake', 'Astana modern architecture', 'Turkestan historical sites'],
      de: ['Charyn-Schlucht', 'Almaty und der Große Almaty-See', 'Moderne Architektur in Astana', 'Historische Stätten in Turkestan'],
      ru: ['Чарынский каньон', 'Алматы и Большое Алматинское озеро', 'Современная архитектура Астаны', 'Исторические места Туркестана']
    }
  },
  kyrgyzstan: {
    name: { en: 'Kyrgyzstan', de: 'Kirgisistan', ru: 'Кыргызстан' },
    description: {
      en: 'Kyrgyzstan is a mountain paradise with stunning alpine lakes, nomadic traditions, and pristine nature. Discover Issyk-Kul Lake, experience yurt stays, and trek through the Tien Shan mountains.',
      de: 'Kirgisistan ist ein Bergparadies mit atemberaubenden Alpenseen, nomadischen Traditionen und unberührter Natur. Entdecken Sie den Issyk-Kul-See, erleben Sie Jurtenübernachtungen und wandern Sie durch das Tien-Shan-Gebirge.',
      ru: 'Кыргызстан — горный рай с потрясающими альпийскими озёрами, кочевыми традициями и нетронутой природой. Откройте озеро Иссык-Куль, остановитесь в юртах и совершите поход по горам Тянь-Шань.'
    },
    image: '/images/destinations/kyrgyzstan.jpg',
    highlights: {
      en: ['Issyk-Kul Lake', 'Song Kol alpine lake', 'Ala Archa National Park', 'Traditional yurt camps'],
      de: ['Issyk-Kul-See', 'Song-Kul-Alpensee', 'Ala-Artscha-Nationalpark', 'Traditionelle Jurtencamps'],
      ru: ['Озеро Иссык-Куль', 'Высокогорное озеро Сон-Куль', 'Национальный парк Ала-Арча', 'Традиционные юрточные лагеря']
    }
  },
  tajikistan: {
    name: { en: 'Tajikistan', de: 'Tadschikistan', ru: 'Таджикистан' },
    description: {
      en: 'Tajikistan is a land of towering peaks and ancient fortresses. Home to the Pamir Mountains, it offers breathtaking scenery, the famous Pamir Highway, and warm hospitality.',
      de: 'Tadschikistan ist ein Land der hohen Gipfel und alten Festungen. Es beherbergt das Pamir-Gebirge und bietet atemberaubende Landschaften, den berühmten Pamir Highway und herzliche Gastfreundschaft.',
      ru: 'Таджикистан — страна высоких вершин и древних крепостей. Здесь находятся Памирские горы, захватывающие пейзажи, знаменитый Памирский тракт и тёплое гостеприимство.'
    },
    image: '/images/destinations/tajikistan.jpg',
    highlights: {
      en: ['Pamir Highway', 'Iskanderkul Lake', 'Fann Mountains', 'Ancient Penjikent ruins'],
      de: ['Pamir Highway', 'Iskanderkul-See', 'Fann-Gebirge', 'Antike Ruinen von Pandschakent'],
      ru: ['Памирский тракт', 'Озеро Искандеркуль', 'Фанские горы', 'Древние руины Пенджикента']
    }
  },
  turkmenistan: {
    name: { en: 'Turkmenistan', de: 'Turkmenistan', ru: 'Туркменистан' },
    description: {
      en: 'Turkmenistan is one of the most mysterious countries in Central Asia. Discover the ancient ruins of Merv, the Darvaza Gas Crater, and the marble-clad capital Ashgabat.',
      de: 'Turkmenistan ist eines der geheimnisvollsten Länder Zentralasiens. Entdecken Sie die antiken Ruinen von Merw, den Darvaza-Gaskrater und die marmorverkleidete Hauptstadt Aschgabat.',
      ru: 'Туркменистан — одна из самых загадочных стран Центральной Азии. Откройте древние руины Мерва, газовый кратер Дарваза и мраморную столицу Ашхабад.'
    },
    image: '/images/destinations/turkmenistan.jpg',
    highlights: {
      en: ['Darvaza Gas Crater (Door to Hell)', 'Ancient Merv UNESCO site', 'Ashgabat white marble city', 'Kunya-Urgench ruins'],
      de: ['Darvaza-Gaskrater (Tor zur Hölle)', 'Antikes Merw UNESCO-Stätte', 'Aschgabat weiße Marmorstadt', 'Ruinen von Köneurgentsch'],
      ru: ['Газовый кратер Дарваза (Врата ада)', 'Древний Мерв — объект ЮНЕСКО', 'Ашхабад — город из белого мрамора', 'Руины Куня-Ургенча']
    }
  },
  'silk-road': {
    name: { en: 'Silk Road', de: 'Seidenstraße', ru: 'Шёлковый путь' },
    description: {
      en: 'The Silk Road was an ancient network of trade routes connecting East and West. Our multi-country tours follow the footsteps of merchants through Uzbekistan, Tajikistan, Kyrgyzstan, and beyond.',
      de: 'Die Seidenstraße war ein antikes Netzwerk von Handelsrouten, das Ost und West verband. Unsere Länder übergreifenden Touren folgen den Spuren der Händler durch Usbekistan, Tadschikistan, Kirgisistan und darüber hinaus.',
      ru: 'Шёлковый путь — древняя сеть торговых путей, соединявших Восток и Запад. Наши туры по нескольким странам следуют по стопам купцов через Узбекистан, Таджикистан, Кыргызстан и далее.'
    },
    image: '/images/destinations/silk-road.jpg',
    highlights: {
      en: ['Multi-country adventures', 'Historic trading cities', 'Caravanserais and bazaars', 'Cultural exchanges'],
      de: ['Mehrlänger-Abenteuer', 'Historische Handelsstädte', 'Karawansereien und Basare', 'Kultureller Austausch'],
      ru: ['Приключения по нескольким странам', 'Исторические торговые города', 'Караван-сараи и базары', 'Культурный обмен']
    }
  }
};

// Generate static params for all countries
export async function generateStaticParams() {
  return Object.keys(countryData).map((country) => ({
    country,
  }));
}

// Generate metadata
export async function generateMetadata({ params }: { params: { locale: string; country: string } }): Promise<Metadata> {
  const country = countryData[params.country];
  if (!country) return { title: 'Not Found' };

  const locale = params.locale as 'en' | 'de' | 'ru';
  return {
    title: `${country.name[locale] || country.name.en} Tours | Discovery Insight Travel`,
    description: country.description[locale] || country.description.en,
  };
}

// Fetch destinations for country directly from Supabase
async function getDestinationsForCountry(country: string) {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('country', country)
      .eq('status', 'active')
      .order('name_en', { ascending: true });

    if (error) {
      console.error('Error fetching destinations:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

// Fetch tours - for now get featured/active tours (tours don't have country column)
async function getToursForCountry(country: string) {
  try {
    // Tours are linked to destinations, not directly to countries
    // For now, just fetch featured/active tours
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export default async function CountryDestinationPage({
  params,
}: {
  params: { locale: string; country: string };
}) {
  const country = countryData[params.country];

  if (!country) {
    notFound();
  }

  const locale = params.locale as 'en' | 'de' | 'ru';
  const [destinations, tours] = await Promise.all([
    getDestinationsForCountry(params.country),
    getToursForCountry(params.country)
  ]);

  // Translations
  const translations = {
    en: {
      highlights: 'Highlights',
      placesToVisit: 'Places to Visit',
      popularTours: 'Popular Tours',
      viewAllTours: 'View All Tours',
      noTours: 'Tours coming soon!',
      noDestinations: 'Destinations coming soon!',
      days: 'days',
      from: 'From',
      viewDetails: 'View Details',
      bookNow: 'Book Now',
      exploreTours: 'Explore Tours',
    },
    de: {
      highlights: 'Höhepunkte',
      placesToVisit: 'Orte zu besuchen',
      popularTours: 'Beliebte Touren',
      viewAllTours: 'Alle Touren ansehen',
      noTours: 'Touren kommen bald!',
      noDestinations: 'Reiseziele kommen bald!',
      days: 'Tage',
      from: 'Ab',
      viewDetails: 'Details ansehen',
      bookNow: 'Jetzt buchen',
      exploreTours: 'Touren erkunden',
    },
    ru: {
      highlights: 'Основные моменты',
      placesToVisit: 'Места для посещения',
      popularTours: 'Популярные туры',
      viewAllTours: 'Смотреть все туры',
      noTours: 'Туры скоро появятся!',
      noDestinations: 'Направления скоро появятся!',
      days: 'дней',
      from: 'От',
      viewDetails: 'Подробнее',
      bookNow: 'Забронировать',
      exploreTours: 'Посмотреть туры',
    },
  };

  const t = translations[locale] || translations.en;

  // Helper to get localized destination name
  const getDestName = (dest: any) => {
    return dest[`name_${locale}`] || dest.name_en || dest.name;
  };

  const getDestDescription = (dest: any) => {
    return dest[`description_${locale}`] || dest.description_en || dest.description || '';
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${country.image}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {country.name[locale] || country.name.en}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
              {country.description[locale] || country.description.en}
            </p>
          </div>
        </div>
      </section>

      {/* Destinations/Places Section */}
      {destinations.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-secondary-800 mb-8 text-center">
              {t.placesToVisit}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest: any) => (
                <Link
                  key={dest.id}
                  href={`/${locale}/tours?destination=${dest.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-secondary-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    {dest.image ? (
                      <img
                        src={dest.image}
                        alt={getDestName(dest)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <Building2 size={48} className="text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {getDestName(dest)}
                      </h3>
                      {dest.region && (
                        <p className="text-white/80 text-sm flex items-center gap-1">
                          <MapPin size={14} />
                          {dest.region}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-secondary-600 text-sm line-clamp-2 mb-3">
                      {getDestDescription(dest)}
                    </p>
                    <span className="text-primary-500 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t.exploreTours}
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights Section */}
      <section className={`py-16 ${destinations.length > 0 ? 'bg-secondary-50' : 'bg-white'}`}>
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-secondary-800 mb-8 text-center">
            {t.highlights}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(country.highlights[locale] || country.highlights.en).map((highlight, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-secondary-100"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-white" size={24} />
                </div>
                <p className="font-medium text-secondary-800">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-secondary-800">
              {t.popularTours}
            </h2>
            <Link
              href={`/${locale}/tours?country=${params.country}`}
              className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
            >
              {t.viewAllTours}
              <ArrowRight size={18} />
            </Link>
          </div>

          {tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.slice(0, 6).map((tour: any) => (
                <div
                  key={tour.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={tour.images?.[0] || '/images/placeholder-tour.jpg'}
                      alt={tour.title?.[locale] || tour.title?.en || 'Tour'}
                      className="w-full h-full object-cover"
                    />
                    {tour.featured && (
                      <span className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-secondary-800 mb-2">
                      {tour.title?.[locale] || tour.title?.en || 'Tour'}
                    </h3>
                    <div className="flex items-center gap-4 text-secondary-500 text-sm mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {tour.duration} {t.days}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {tour.group_size || '2-12'}
                      </span>
                      {tour.rating && (
                        <span className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-500" />
                          {tour.rating}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-secondary-500 text-sm">{t.from}</span>
                        <span className="text-2xl font-bold text-primary-500 ml-1">
                          ${tour.price}
                        </span>
                      </div>
                      <Link
                        href={`/${locale}/tours/${tour.slug}`}
                        className="btn-primary py-2 px-4 text-sm"
                      >
                        {t.viewDetails}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <MapPin size={48} className="mx-auto text-secondary-300 mb-4" />
              <p className="text-secondary-500 text-lg">{t.noTours}</p>
              <Link
                href={`/${locale}/contact`}
                className="btn-primary mt-4 inline-block"
              >
                {t.bookNow}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500">
        <div className="container-custom text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {locale === 'en' && `Ready to explore ${country.name.en}?`}
            {locale === 'de' && `Bereit, ${country.name.de} zu erkunden?`}
            {locale === 'ru' && `Готовы исследовать ${country.name.ru}?`}
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            {locale === 'en' && 'Contact us to plan your perfect Central Asian adventure.'}
            {locale === 'de' && 'Kontaktieren Sie uns, um Ihr perfektes Zentralasien-Abenteuer zu planen.'}
            {locale === 'ru' && 'Свяжитесь с нами, чтобы спланировать идеальное путешествие по Центральной Азии.'}
          </p>
          <Link href={`/${locale}/contact`} className="bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-secondary-100 transition-colors inline-block">
            {locale === 'en' && 'Get in Touch'}
            {locale === 'de' && 'Kontakt aufnehmen'}
            {locale === 'ru' && 'Связаться с нами'}
          </Link>
        </div>
      </section>
    </div>
  );
}
