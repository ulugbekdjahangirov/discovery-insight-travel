'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function HeroSection() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">{t('hero.subtitle')}</p>

          {/* Search Box */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination */}
              <div className="flex items-center gap-3 p-3 border border-secondary-200 rounded-lg">
                <MapPin className="text-primary-500" size={24} />
                <div className="flex-grow">
                  <label className="text-xs text-secondary-500 block">
                    {t('navigation.destinations')}
                  </label>
                  <select className="w-full text-secondary-800 font-medium focus:outline-none bg-transparent">
                    <option value="">{t('navigation.uzbekistan')}</option>
                    <option value="kazakhstan">{t('navigation.kazakhstan')}</option>
                    <option value="kyrgyzstan">{t('navigation.kyrgyzstan')}</option>
                    <option value="tajikistan">{t('navigation.tajikistan')}</option>
                    <option value="silk-road">{t('navigation.silkRoad')}</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 p-3 border border-secondary-200 rounded-lg">
                <Calendar className="text-primary-500" size={24} />
                <div className="flex-grow">
                  <label className="text-xs text-secondary-500 block">Date</label>
                  <input
                    type="date"
                    className="w-full text-secondary-800 font-medium focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center gap-3 p-3 border border-secondary-200 rounded-lg">
                <Users className="text-primary-500" size={24} />
                <div className="flex-grow">
                  <label className="text-xs text-secondary-500 block">{t('booking.travelers')}</label>
                  <select className="w-full text-secondary-800 font-medium focus:outline-none bg-transparent">
                    <option>1 Person</option>
                    <option>2 Persons</option>
                    <option>3-5 Persons</option>
                    <option>6+ Persons</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button className="btn-primary flex items-center justify-center gap-2">
                <Search size={20} />
                <span>{t('common.search')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center pt-2">
          <div className="w-1 h-3 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
