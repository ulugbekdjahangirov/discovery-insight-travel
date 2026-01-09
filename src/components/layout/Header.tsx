'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n';

// Static destinations menu
const destinationCountries = [
  { slug: 'uzbekistan', name: { en: 'Uzbekistan', de: 'Usbekistan', ru: 'Узбекистан' } },
  { slug: 'kazakhstan', name: { en: 'Kazakhstan', de: 'Kasachstan', ru: 'Казахстан' } },
  { slug: 'kyrgyzstan', name: { en: 'Kyrgyzstan', de: 'Kirgisistan', ru: 'Кыргызстан' } },
  { slug: 'tajikistan', name: { en: 'Tajikistan', de: 'Tadschikistan', ru: 'Таджикистан' } },
  { slug: 'turkmenistan', name: { en: 'Turkmenistan', de: 'Turkmenistan', ru: 'Туркменистан' } },
  { slug: 'silk-road', name: { en: 'Silk Road', de: 'Seidenstraße', ru: 'Шёлковый путь' } },
];

interface TourCategory {
  id: number;
  slug: string;
  name_en: string;
  name_de: string;
  name_ru: string;
  icon: string;
  show_in_menu: boolean;
}

interface Tour {
  id: number;
  slug: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  category_id: number | null;
}

// Default categories (used until database is set up)
const defaultCategories: TourCategory[] = [
  { id: 1, slug: 'homestays-hiking', name_en: 'Homestays & Hiking', name_de: 'Gastfamilien & Wandern', name_ru: 'Проживание и Походы', icon: 'home', show_in_menu: true },
  { id: 2, slug: 'trekking', name_en: 'Trekking', name_de: 'Trekking', name_ru: 'Треккинг', icon: 'mountain', show_in_menu: true },
  { id: 3, slug: 'horse-riding', name_en: 'Horse Riding', name_de: 'Reiten', name_ru: 'Конные туры', icon: 'accessibility', show_in_menu: true },
  { id: 4, slug: 'adventure-tours', name_en: 'Adventure Tours', name_de: 'Abenteuerreisen', name_ru: 'Приключенческие туры', icon: 'compass', show_in_menu: true },
  { id: 5, slug: 'cultural-tours', name_en: 'Cultural Tours', name_de: 'Kulturreisen', name_ru: 'Культурные туры', icon: 'landmark', show_in_menu: true },
  { id: 6, slug: 'day-trips', name_en: 'Day Trips', name_de: 'Tagesausflüge', name_ru: 'Однодневные туры', icon: 'sun', show_in_menu: true },
];

export default function Header() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [tourCategories, setTourCategories] = useState<TourCategory[]>(defaultCategories);
  const [tours, setTours] = useState<Tour[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch tour categories and tours for menu
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and tours in parallel
        const [categoriesRes, toursRes] = await Promise.all([
          fetch('/api/tour-categories?status=active&show_in_menu=true'),
          fetch('/api/tours?status=active')
        ]);

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          if (data && data.length > 0) {
            setTourCategories(data);
          }
        }

        if (toursRes.ok) {
          const toursData = await toursRes.json();
          setTours(toursData || []);
        }
      } catch (error) {
        // Use default categories if API fails
        console.log('Using default categories');
      }
    };
    fetchData();
  }, []);

  // Get localized category name
  const getCategoryName = (category: TourCategory) => {
    return category[`name_${locale}`] || category.name_en;
  };

  // Get localized tour title
  const getTourTitle = (tour: Tour) => {
    return tour[`title_${locale}`] || tour.title_en;
  };

  // Get tours for a specific category
  const getToursByCategory = (categoryId: number) => {
    return tours.filter(tour => tour.category_id === categoryId);
  };

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    if (isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangOpen]);

  const switchLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsLangOpen(false);
  };

  // Get localized country name
  const getCountryName = (country: typeof destinationCountries[0]) => {
    return country.name[locale] || country.name.en;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-secondary-800 text-white py-2">
        <div className="container-custom flex justify-between items-center text-sm">
          <div className="hidden md:flex items-center gap-4">
            <span className="font-semibold">Discovery Insight Travel</span>
            <span>|</span>
            <span>+998 93 348 42 08</span>
          </div>
          <div className="flex items-center gap-4 ml-auto md:hidden">
            <span>+998 93 348 42 08</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Discovery Insight Travel"
              width={50}
              height={50}
              className="h-12 w-auto"
              priority
            />
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-secondary-800">Discovery </span>
              <span className="font-bold text-lg text-primary-500">Insight</span>
              <p className="text-xs text-secondary-400 -mt-0.5">Travel</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-3">
            <Link href={`/${locale}`} className="nav-link text-sm">
              {t('common.home')}
            </Link>

            {/* Destinations Dropdown - Static countries */}
            <div
              className="relative group"
              onMouseEnter={() => setIsDestOpen(true)}
              onMouseLeave={() => setIsDestOpen(false)}
            >
              <button className="nav-link text-sm flex items-center gap-1">
                {t('navigation.destinations')}
                <ChevronDown size={14} className={`transition-transform ${isDestOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDestOpen && (
                <div className="absolute left-0 top-full pt-1 z-50">
                  <div className="bg-white rounded-lg shadow-lg py-2 min-w-[200px] border border-secondary-100">
                    {destinationCountries.map((country) => (
                      <Link
                        key={country.slug}
                        href={`/${locale}/destinations/${country.slug}`}
                        className="block px-4 py-2.5 text-secondary-700 hover:bg-primary-50 hover:text-primary-500 transition-colors cursor-pointer"
                        onClick={() => setIsDestOpen(false)}
                      >
                        {getCountryName(country)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tour Categories from Database with Dropdown */}
            {tourCategories.map((category) => {
              const categoryTours = getToursByCategory(category.id);
              const hasDropdown = categoryTours.length > 0;

              return (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setActiveCategoryId(category.id)}
                  onMouseLeave={() => setActiveCategoryId(null)}
                >
                  <Link
                    href={`/${locale}/tours?category=${category.slug}`}
                    className="nav-link text-sm whitespace-nowrap flex items-center gap-1"
                  >
                    {getCategoryName(category)}
                    {hasDropdown && (
                      <ChevronDown size={12} className={`transition-transform ${activeCategoryId === category.id ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {/* Dropdown for tours in this category */}
                  {hasDropdown && activeCategoryId === category.id && (
                    <div className="absolute left-0 top-full pt-1 z-50">
                      <div className="bg-white rounded-lg shadow-lg py-2 min-w-[250px] border border-secondary-100">
                        {categoryTours.slice(0, 5).map((tour) => (
                          <Link
                            key={tour.id}
                            href={`/${locale}/tours/${tour.slug}`}
                            className="block px-4 py-2.5 text-secondary-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                            onClick={() => setActiveCategoryId(null)}
                          >
                            {getTourTitle(tour)}
                          </Link>
                        ))}
                        {categoryTours.length > 5 && (
                          <Link
                            href={`/${locale}/tours?category=${category.slug}`}
                            className="block px-4 py-2.5 text-primary-500 font-medium border-t border-secondary-100 hover:bg-primary-50 transition-colors"
                            onClick={() => setActiveCategoryId(null)}
                          >
                            {locale === 'en' ? `View all ${categoryTours.length} tours →` :
                             locale === 'de' ? `Alle ${categoryTours.length} Touren ansehen →` :
                             `Посмотреть все ${categoryTours.length} туров →`}
                          </Link>
                        )}
                        {categoryTours.length <= 5 && (
                          <Link
                            href={`/${locale}/tours?category=${category.slug}`}
                            className="block px-4 py-2.5 text-primary-500 font-medium border-t border-secondary-100 hover:bg-primary-50 transition-colors"
                            onClick={() => setActiveCategoryId(null)}
                          >
                            {locale === 'en' ? 'View all →' :
                             locale === 'de' ? 'Alle ansehen →' :
                             'Смотреть все →'}
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <Link href={`/${locale}/about`} className="nav-link text-sm">
              {t('common.about')}
            </Link>
            <Link href={`/${locale}/contact`} className="nav-link text-sm">
              {t('common.contact')}
            </Link>
          </div>

          {/* Language Switcher & CTA Button */}
          <div className="hidden xl:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 text-sm text-secondary-600 hover:text-primary-500 transition-colors"
              >
                <Globe size={16} />
                <span>{localeNames[locale as Locale]}</span>
                <ChevronDown size={12} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[120px] z-50 border border-secondary-100">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={`block w-full text-left px-4 py-2 text-secondary-700 hover:bg-primary-50 hover:text-primary-500 ${
                        locale === loc ? 'bg-primary-50 text-primary-500' : ''
                      }`}
                    >
                      {localeNames[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/${locale}/tours`} className="btn-primary text-sm px-4 py-2">
              {t('common.booking')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 text-secondary-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="xl:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              <Link href={`/${locale}`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.home')}
              </Link>

              {/* Mobile Destinations */}
              <div>
                <p className="text-sm font-medium text-secondary-500 mb-2">{t('navigation.destinations')}</p>
                <div className="pl-4 border-l-2 border-primary-200 space-y-1">
                  {destinationCountries.map((country) => (
                    <Link
                      key={country.slug}
                      href={`/${locale}/destinations/${country.slug}`}
                      className="block py-1 text-secondary-600 hover:text-primary-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {getCountryName(country)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Tour Categories with Tours */}
              {tourCategories.map((category) => {
                const categoryTours = getToursByCategory(category.id);
                return (
                  <div key={category.id}>
                    <Link
                      href={`/${locale}/tours?category=${category.slug}`}
                      className="text-sm font-medium text-secondary-700 hover:text-primary-500 block py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {getCategoryName(category)}
                    </Link>
                    {categoryTours.length > 0 && (
                      <div className="pl-4 border-l-2 border-primary-200 space-y-1 mb-2">
                        {categoryTours.slice(0, 3).map((tour) => (
                          <Link
                            key={tour.id}
                            href={`/${locale}/tours/${tour.slug}`}
                            className="block py-1 text-sm text-secondary-500 hover:text-primary-500"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {getTourTitle(tour)}
                          </Link>
                        ))}
                        {categoryTours.length > 3 && (
                          <Link
                            href={`/${locale}/tours?category=${category.slug}`}
                            className="block py-1 text-sm text-primary-500"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            +{categoryTours.length - 3} {locale === 'en' ? 'more' : locale === 'de' ? 'mehr' : 'ещё'}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link href={`/${locale}/about`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.about')}
              </Link>
              <Link href={`/${locale}/contact`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.contact')}
              </Link>
              {/* Mobile Language Switcher */}
              <div className="border-t pt-4 mt-2">
                <p className="text-sm font-medium text-secondary-500 mb-2">{t('common.language') || 'Language'}</p>
                <div className="flex gap-2">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        switchLocale(loc);
                        setIsMenuOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        locale === loc
                          ? 'bg-primary-500 text-white'
                          : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                      }`}
                    >
                      {localeNames[loc]}
                    </button>
                  ))}
                </div>
              </div>

              <Link href={`/${locale}/tours`} className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>
                {t('common.booking')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
