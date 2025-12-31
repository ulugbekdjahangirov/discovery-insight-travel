import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Tour {
  id: number;
  slug: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  description_en: string;
  description_de: string;
  description_ru: string;
  destination: string;
  duration: number;
  price: number;
  main_image: string;
  gallery_images: string[];
  rating: number;
  reviews: number;
  tour_type: 'cultural' | 'adventure' | 'historical' | 'group' | 'private';
  status: 'active' | 'inactive' | 'draft';
  is_bestseller: boolean;
  included_en: string[];
  included_de: string[];
  included_ru: string[];
  not_included_en: string[];
  not_included_de: string[];
  not_included_ru: string[];
  group_size: string;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: number;
  tour_id: number;
  day_number: number;
  title_en: string;
  title_de: string;
  title_ru: string;
  description_en: string;
  description_de: string;
  description_ru: string;
}

export interface Booking {
  id: number;
  booking_code: string;
  tour_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  adults: number;
  children: number;
  start_date: string;
  special_requests: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}
