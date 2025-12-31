'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Globe, User } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n';

interface MenuItem {
  id: number;
  name_en: string;
  name_de: string;
  name_ru: string;
  url: string;
  parent_id: number | null;
  location: string;
  order_index: number;
  open_in_new_tab: boolean;
  status: string;
  children?: MenuItem[];
}

// Fallback menus when API fails or no data
const fallbackMenus: MenuItem[] = [
  { id: 1, name_en: 'Home', name_de: 'Startseite', name_ru: 'Главная', url: '/', parent_id: null, location: 'header', order_index: 0, open_in_new_tab: false, status: 'active', children: [] },
  { id: 2, name_en: 'Destinations', name_de: 'Reiseziele', name_ru: 'Направления', url: '/destinations', parent_id: null, location: 'header', order_index: 1, open_in_new_tab: false, status: 'active', children: [] },
  { id: 3, name_en: 'Tours', name_de: 'Reisen', name_ru: 'Туры', url: '/tours', parent_id: null, location: 'header', order_index: 2, open_in_new_tab: false, status: 'active', children: [] },
  { id: 4, name_en: 'Blog', name_de: 'Blog', name_ru: 'Блог', url: '/blog', parent_id: null, location: 'header', order_index: 3, open_in_new_tab: false, status: 'active', children: [] },
  { id: 5, name_en: 'About', name_de: 'Über uns', name_ru: 'О нас', url: '/about', parent_id: null, location: 'header', order_index: 4, open_in_new_tab: false, status: 'active', children: [] },
  { id: 6, name_en: 'Contact', name_de: 'Kontakt', name_ru: 'Контакты', url: '/contact', parent_id: null, location: 'header', order_index: 5, open_in_new_tab: false, status: 'active', children: [] },
];

export default function Header() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>(fallbackMenus);

  // Fetch menus from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus?location=header&status=active');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setMenus(data);
          }
        }
      } catch (error) {
        console.error('Error fetching menus:', error);
        // Keep fallback data on error
      }
    };

    fetchMenus();
  }, []);

  const switchLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsLangOpen(false);
  };

  // Get localized name
  const getMenuName = (item: MenuItem) => {
    const key = `name_${locale}` as keyof MenuItem;
    return (item[key] as string) || item.name_en;
  };

  // Build full URL with locale
  const getFullUrl = (url: string) => {
    if (!url) return `/${locale}`;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `/${locale}${url}`;
    return `/${locale}/${url}`;
  };

  // Toggle dropdown
  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
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
            {menus.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openDropdown === item.id;

              if (hasChildren) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.id)}
                    onMouseLeave={() => { setOpenDropdown(null); setOpenSubmenu(null); }}
                  >
                    <Link
                      href={getFullUrl(item.url)}
                      className="nav-link flex items-center gap-1"
                    >
                      {getMenuName(item)}
                      <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </Link>
                    {isOpen && (
                      <div className="absolute left-0 top-full pt-2">
                        <div className="bg-white rounded-lg shadow-lg py-2 min-w-[200px] border border-secondary-100">
                          {item.children!.map((child) => {
                            const hasSubChildren = child.children && child.children.length > 0;
                            const isSubOpen = openSubmenu === child.id;

                            if (hasSubChildren) {
                              return (
                                <div
                                  key={child.id}
                                  className="relative"
                                  onMouseEnter={() => setOpenSubmenu(child.id)}
                                  onMouseLeave={() => setOpenSubmenu(null)}
                                >
                                  <div className="flex items-center justify-between px-4 py-2 text-secondary-700 hover:bg-primary-50 hover:text-primary-500 cursor-pointer transition-colors">
                                    <span>{getMenuName(child)}</span>
                                    <ChevronDown size={14} className="-rotate-90" />
                                  </div>
                                  {isSubOpen && (
                                    <div className="absolute left-full top-0 ml-1">
                                      <div className="bg-white rounded-lg shadow-lg py-2 min-w-[180px] border border-secondary-100">
                                        {child.children!.map((subChild) => (
                                          <Link
                                            key={subChild.id}
                                            href={getFullUrl(subChild.url)}
                                            target={subChild.open_in_new_tab ? '_blank' : undefined}
                                            rel={subChild.open_in_new_tab ? 'noopener noreferrer' : undefined}
                                            className="block px-4 py-2 text-secondary-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                                            onClick={() => { setOpenDropdown(null); setOpenSubmenu(null); }}
                                          >
                                            {getMenuName(subChild)}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            return (
                              <Link
                                key={child.id}
                                href={getFullUrl(child.url)}
                                target={child.open_in_new_tab ? '_blank' : undefined}
                                rel={child.open_in_new_tab ? 'noopener noreferrer' : undefined}
                                className="block px-4 py-2 text-secondary-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {getMenuName(child)}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={getFullUrl(item.url)}
                  target={item.open_in_new_tab ? '_blank' : undefined}
                  rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
                  className="nav-link"
                >
                  {getMenuName(item)}
                </Link>
              );
            })}
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
              {menus.map((item) => {
                const hasChildren = item.children && item.children.length > 0;

                if (hasChildren) {
                  return (
                    <div key={item.id}>
                      <p className="text-sm font-medium text-secondary-500 mb-2">{getMenuName(item)}</p>
                      <div className="pl-4 border-l-2 border-primary-200">
                        {item.children!.map((child) => (
                          <Link
                            key={child.id}
                            href={getFullUrl(child.url)}
                            target={child.open_in_new_tab ? '_blank' : undefined}
                            rel={child.open_in_new_tab ? 'noopener noreferrer' : undefined}
                            className="block py-1 text-secondary-600 hover:text-primary-500"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {getMenuName(child)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={getFullUrl(item.url)}
                    target={item.open_in_new_tab ? '_blank' : undefined}
                    rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {getMenuName(item)}
                  </Link>
                );
              })}
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
