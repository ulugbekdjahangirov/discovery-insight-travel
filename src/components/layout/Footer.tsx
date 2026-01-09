'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  const quickLinks = [
    { key: 'home', href: '' },
    { key: 'tours', href: '/tours' },
    { key: 'about', href: '/about' },
    { key: 'blog', href: '/blog' },
    { key: 'contact', href: '/contact' },
  ];

  const tourCategories = [
    { key: 'cultural', href: '/tours?type=cultural' },
    { key: 'adventure', href: '/tours?type=adventure' },
    { key: 'historical', href: '/tours?type=historical' },
    { key: 'group', href: '/tours?type=group' },
    { key: 'private', href: '/tours?type=private' },
  ];

  return (
    <footer className="bg-secondary-800 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="Discovery Insight Travel"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
              <div>
                <span className="font-bold text-xl">Discovery</span>
                <span className="font-bold text-xl text-primary-500"> Insight</span>
                <p className="text-xs text-secondary-400 -mt-1">Travel</p>
              </div>
            </div>
            <p className="text-secondary-300 mb-4">{t('footer.description')}</p>
            <div className="flex gap-4">
              <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-secondary-300 hover:text-primary-500 transition-colors"
                  >
                    {t(`common.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tour Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.tourCategories')}</h3>
            <ul className="space-y-2">
              {tourCategories.map((cat) => (
                <li key={cat.key}>
                  <Link
                    href={`/${locale}${cat.href}`}
                    className="text-secondary-300 hover:text-primary-500 transition-colors"
                  >
                    {t(`navigation.${cat.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactInfo')}</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-secondary-300">
                <MapPin size={18} className="text-primary-500" />
                <span>Tashkent, Uzbekistan</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-300">
                <Phone size={18} className="text-primary-500" />
                <span>+998 93 348 42 08</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-300">
                <Mail size={18} className="text-primary-500" />
                <span>info@discoveryinsight.uz</span>
              </li>
            </ul>

            <h4 className="font-semibold mb-2">{t('footer.newsletter')}</h4>
            <p className="text-secondary-400 text-sm mb-3">{t('footer.newsletterText')}</p>
            <form className="flex">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="flex-grow px-4 py-2 rounded-l-lg text-secondary-800 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary-500 px-4 py-2 rounded-r-lg hover:bg-primary-600 transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-700">
        <div className="container-custom py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-400 text-sm">
            &copy; {new Date().getFullYear()} Discovery Insight Travel. {t('footer.rights')}.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href={`/${locale}/privacy`} className="text-secondary-400 hover:text-primary-500">
              {t('footer.privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="text-secondary-400 hover:text-primary-500">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
