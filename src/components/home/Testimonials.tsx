'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Michael Schmidt',
    country: 'Germany',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    tour: 'Classic Uzbekistan Tour',
    text: {
      en: 'An absolutely incredible experience! The guides were knowledgeable and passionate. Samarkand exceeded all my expectations.',
      de: 'Ein absolut unglaubliches Erlebnis! Die Guides waren kompetent und leidenschaftlich. Samarkand hat alle meine Erwartungen übertroffen.',
      ru: 'Абсолютно невероятный опыт! Гиды были знающими и увлеченными. Самарканд превзошел все мои ожидания.',
    },
  },
  {
    id: 2,
    name: 'Elena Ivanova',
    country: 'Russia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    tour: 'Silk Road Adventure',
    text: {
      en: 'The Silk Road tour was the trip of a lifetime. Every detail was perfectly organized. Highly recommended!',
      de: 'Die Seidenstraßen-Tour war die Reise meines Lebens. Jedes Detail war perfekt organisiert. Sehr empfehlenswert!',
      ru: 'Тур по Шелковому пути стал путешествием всей моей жизни. Каждая деталь была идеально организована. Очень рекомендую!',
    },
  },
  {
    id: 3,
    name: 'John Williams',
    country: 'UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    tour: 'Kazakhstan Nomad Experience',
    text: {
      en: 'Staying with nomad families was an authentic and touching experience. The landscapes of Kazakhstan are breathtaking.',
      de: 'Der Aufenthalt bei Nomadenfamilien war ein authentisches und berührendes Erlebnis. Die Landschaften Kasachstans sind atemberaubend.',
      ru: 'Проживание с семьями кочевников было подлинным и трогательным опытом. Пейзажи Казахстана захватывают дух.',
    },
  },
];

export default function Testimonials() {
  const locale = useLocale() as 'en' | 'de' | 'ru';
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-primary-500">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {locale === 'en' && 'What Our Travelers Say'}
            {locale === 'de' && 'Was unsere Reisenden sagen'}
            {locale === 'ru' && 'Что говорят наши путешественники'}
          </h2>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
            <Quote className="text-primary-200 mb-4" size={48} />

            <p className="text-xl md:text-2xl text-secondary-700 mb-8 leading-relaxed">
              {testimonials[currentIndex].text[locale]}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-secondary-800">{testimonials[currentIndex].name}</h4>
                  <p className="text-secondary-500 text-sm">{testimonials[currentIndex].country}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            <p className="text-primary-500 font-medium mt-4">{testimonials[currentIndex].tour}</p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
