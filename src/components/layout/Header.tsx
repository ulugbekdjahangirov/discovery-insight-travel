'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Globe, User } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n';

interface Destination {
  id: number;
  slug: string;
  name_en: string;
  name_de: string;
  name_ru: string;
  status: string;
}

// Fallback destinations when API fails or no data
const fallbackDestinations = [
  { id: 1, slug: 'uzbekistan', name_en: 'Uzbekistan', name_de: 'Usbekistan', name_ru: 'Узбекистан', status: 'active' },
  { id: 2, slug: 'kazakhstan', name_en: 'Kazakhstan', name_de: 'Kasachstan', name_ru: 'Казахстан', status: 'active' },
  { id: 3, slug: 'kyrgyzstan', name_en: 'Kyrgyzstan', name_de: 'Kirgisistan', name_ru: 'Кыргызстан', status: 'active' },
  { id: 4, slug: 'tajikistan', name_en: 'Tajikistan', name_de: 'Tadschikistan', name_ru: 'Таджикистан', status: 'active' },
  { id: 5, slug: 'turkmenistan', name_en: 'Turkmenistan', name_de: 'Turkmenistan', name_ru: 'Туркменистан', status: 'active' },
  { id: 6, slug: 'silk-road', name_en: 'Silk Road', name_de: 'Seidenstraße', name_ru: 'Шелковый путь', status: 'active' },
];

export default function Header() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>(fallbackDestinations);

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations?status=active');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setDestinations(data);
          }
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
        // Keep fallback data on error
      }
    };

    fetchDestinations();
  }, []);

  const switchLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsLangOpen(false);
  };

  // Get localized name
  const getName = (dest: Destination) => {
    return dest[`name_${locale}`] || dest.name_en;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-secondary-800 text-white py-2">
        <div className="container-custom flex justify-between items-center text-sm">
          <div className="hidden md:flex items-center gap-4">
            <span>Mon-Fri: 9:00 - 18:00</span>
            <span>|</span>
            <span>+998 90 123 45 67</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 hover:text-primary-400 transition-colors"
              >
                <Globe size={16} />
                <span>{localeNames[locale as Locale]}</span>
                <ChevronDown size={14} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[120px]">
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
            <Link href={`/${locale}/login`} className="flex items-center gap-1 hover:text-primary-400">
              <User size={16} />
              <span>{t('common.login')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-secondary-800">Discovery</span>
              <span className="font-bold text-xl text-primary-500"> Insight</span>
              <p className="text-xs text-secondary-500 -mt-1">Travel</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href={`/${locale}`} className="nav-link">
              {t('common.home')}
            </Link>

            {/* Destinations Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDestOpen(!isDestOpen)}
                className="nav-link flex items-center gap-1"
              >
                {t('navigation.destinations')}
                <ChevronDown size={16} />
              </button>
              {isDestOpen && (
                <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[180px]">
                  {destinations.map((dest) => (
                    <Link
                      key={dest.id}
                      href={`/${locale}/tours?destination=${dest.slug}`}
                      className="block px-4 py-2 text-secondary-700 hover:bg-primary-50 hover:text-primary-500"
                      onClick={() => setIsDestOpen(false)}
                    >
                      {getName(dest)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/${locale}/tours`} className="nav-link">
              {t('common.tours')}
            </Link>
            <Link href={`/${locale}/blog`} className="nav-link">
              {t('common.blog')}
            </Link>
            <Link href={`/${locale}/about`} className="nav-link">
              {t('common.about')}
            </Link>
            <Link href={`/${locale}/contact`} className="nav-link">
              {t('common.contact')}
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href={`/${locale}/tours`} className="btn-primary">
              {t('common.booking')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-secondary-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              <Link href={`/${locale}`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.home')}
              </Link>

              {/* Mobile Destinations */}
              <div className="pl-4 border-l-2 border-primary-200">
                <p className="text-sm font-medium text-secondary-500 mb-2">{t('navigation.destinations')}</p>
                {destinations.map((dest) => (
                  <Link
                    key={dest.id}
                    href={`/${locale}/tours?destination=${dest.slug}`}
                    className="block py-1 text-secondary-600 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {getName(dest)}
                  </Link>
                ))}
              </div>

              <Link href={`/${locale}/tours`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.tours')}
              </Link>
              <Link href={`/${locale}/blog`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.blog')}
              </Link>
              <Link href={`/${locale}/about`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.about')}
              </Link>
              <Link href={`/${locale}/contact`} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('common.contact')}
              </Link>
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
