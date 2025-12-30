import { Tour, Booking, BlogPost } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Tours API
export async function getTours(params?: {
  destination?: string;
  type?: string;
  limit?: number;
}): Promise<Tour[]> {
  const searchParams = new URLSearchParams();
  if (params?.destination) searchParams.set('destination', params.destination);
  if (params?.type) searchParams.set('type', params.type);
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  const res = await fetch(`${API_URL}/tours?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch tours');
  return res.json();
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const res = await fetch(`${API_URL}/tours/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createTour(tour: Partial<Tour>): Promise<Tour> {
  const res = await fetch(`${API_URL}/tours`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tour),
  });
  if (!res.ok) throw new Error('Failed to create tour');
  return res.json();
}

export async function updateTour(id: number, tour: Partial<Tour>): Promise<Tour> {
  const res = await fetch(`${API_URL}/tours/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tour),
  });
  if (!res.ok) throw new Error('Failed to update tour');
  return res.json();
}

export async function deleteTour(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/tours/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete tour');
}

// Bookings API
export async function createBooking(booking: Partial<Booking>): Promise<Booking> {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
}

export async function getBookings(params?: {
  status?: string;
  limit?: number;
}): Promise<Booking[]> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  const res = await fetch(`${API_URL}/bookings?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function updateBookingStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<Booking> {
  const res = await fetch(`${API_URL}/bookings/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update booking status');
  return res.json();
}

// Blog API
export async function getBlogPosts(params?: {
  category?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  const res = await fetch(`${API_URL}/blog?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  return res.json();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_URL}/blog/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

// Contact API
export async function sendContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to send message');
}

// Newsletter API
export async function subscribeToNewsletter(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Failed to subscribe');
}
