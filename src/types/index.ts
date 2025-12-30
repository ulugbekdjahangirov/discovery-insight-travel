export interface Tour {
  id: number;
  slug: string;
  title: {
    en: string;
    de: string;
    ru: string;
  };
  description: {
    en: string;
    de: string;
    ru: string;
  };
  destination: string;
  duration: number;
  price: number;
  images: string[];
  rating: number;
  reviews: number;
  type: 'cultural' | 'adventure' | 'historical' | 'group' | 'private';
  status: 'active' | 'inactive' | 'draft';
  isBestseller: boolean;
  included: {
    en: string[];
    de: string[];
    ru: string[];
  };
  notIncluded: {
    en: string[];
    de: string[];
    ru: string[];
  };
  itinerary: ItineraryDay[];
  groupSize: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItineraryDay {
  day: number;
  title: {
    en: string;
    de: string;
    ru: string;
  };
  description: {
    en: string;
    de: string;
    ru: string;
  };
}

export interface Booking {
  id: string;
  tourId: number;
  tourSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  adults: number;
  children: number;
  startDate: string;
  specialRequests?: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: {
    en: string;
    de: string;
    ru: string;
  };
  excerpt: {
    en: string;
    de: string;
    ru: string;
  };
  content: {
    en: string;
    de: string;
    ru: string;
  };
  image: string;
  category: {
    en: string;
    de: string;
    ru: string;
  };
  author: string;
  publishedAt: Date;
  readTime: number;
  tags: string[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribedAt: Date;
  isActive: boolean;
}
