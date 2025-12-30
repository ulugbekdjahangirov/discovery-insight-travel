import { useTranslations } from 'next-intl';
import HeroSection from '@/components/home/HeroSection';
import FeaturedTours from '@/components/home/FeaturedTours';
import Destinations from '@/components/home/Destinations';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedTours />
      <Destinations />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}
