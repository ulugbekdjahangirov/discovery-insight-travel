import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all tours or filter by params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');

    let query = supabase.from('tours').select('*');

    // Filter by slug (for single tour)
    if (slug) {
      const { data, error } = await query.eq('slug', slug).single();
      if (error) {
        return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
      }

      // Get itineraries for this tour
      const { data: itineraries } = await supabase
        .from('itineraries')
        .select('*')
        .eq('tour_id', data.id)
        .order('day_number');

      // Get reviews for this tour
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('tour_id', data.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      // Calculate average rating
      let avgRating = 0;
      if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
        avgRating = Math.round((totalRating / reviews.length) * 10) / 10;
      }

      return NextResponse.json({
        ...data,
        itineraries: itineraries || [],
        reviews: reviews || [],
        rating: avgRating || data.rating || 0,
        reviews_count: reviews?.length || 0,
      });
    }

    // Filter by destination
    if (destination) {
      query = query.ilike('destination', `%${destination}%`);
    }

    // Filter by type
    if (type) {
      query = query.eq('tour_type', type);
    }

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by category (slug)
    if (category) {
      // First get the category ID from slug
      const { data: categoryData } = await supabase
        .from('tour_categories')
        .select('id')
        .eq('slug', category)
        .single();

      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    // Order by created_at
    query = query.order('created_at', { ascending: false });

    // Limit results
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
    }

    // Fetch review stats for each tour
    if (data && data.length > 0) {
      const tourIds = data.map((t: any) => t.id);

      // Get reviews for all tours at once
      const { data: reviews } = await supabase
        .from('reviews')
        .select('tour_id, rating')
        .in('tour_id', tourIds)
        .eq('status', 'approved');

      // Calculate average rating and count for each tour
      const reviewStats: Record<number, { avgRating: number; count: number }> = {};

      if (reviews) {
        reviews.forEach((review: any) => {
          if (!reviewStats[review.tour_id]) {
            reviewStats[review.tour_id] = { avgRating: 0, count: 0, total: 0 } as any;
          }
          (reviewStats[review.tour_id] as any).total += review.rating;
          reviewStats[review.tour_id].count += 1;
        });

        // Calculate averages
        Object.keys(reviewStats).forEach((tourId) => {
          const stats = reviewStats[parseInt(tourId)] as any;
          stats.avgRating = Math.round((stats.total / stats.count) * 10) / 10;
        });
      }

      // Add review stats to tours
      const toursWithReviews = data.map((tour: any) => ({
        ...tour,
        rating: reviewStats[tour.id]?.avgRating || tour.rating || 0,
        reviews_count: reviewStats[tour.id]?.count || tour.reviews || 0,
      }));

      return NextResponse.json(toursWithReviews);
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new tour
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title?.en || !body.destination || !body.price) {
      return NextResponse.json(
        { error: 'Missing required fields: title.en, destination, price' },
        { status: 400 }
      );
    }

    // Process gallery images - handle both old format (string[]) and new format ({ url, alt }[])
    let galleryImages = [];
    if (body.galleryImages && Array.isArray(body.galleryImages)) {
      galleryImages = body.galleryImages.map((img: any) =>
        typeof img === 'string' ? { url: img, alt: '' } : img
      );
    } else if (body.images && body.images.length > 1) {
      galleryImages = body.images.slice(1).map((url: string) => ({ url, alt: '' }));
    }

    // Process route images - handle both old format (string[]) and new format ({ url, alt }[])
    let routeImages = [];
    if (body.routeImages && Array.isArray(body.routeImages)) {
      routeImages = body.routeImages.map((img: any) =>
        typeof img === 'string' ? { url: img, alt: '' } : img
      );
    }

    // Prepare tour data for Supabase
    const tourData = {
      slug: body.slug || body.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title_en: body.title.en,
      title_de: body.title.de || '',
      title_ru: body.title.ru || '',
      description_en: body.description?.en || '',
      description_de: body.description?.de || '',
      description_ru: body.description?.ru || '',
      destination: body.destination,
      category_id: body.categoryId || null,
      duration: body.duration || 1,
      price: body.price,
      main_image: body.mainImage || body.images?.[0] || '',
      main_image_alt: body.mainImageAlt || '',
      gallery_images: galleryImages,
      route_images: routeImages,
      tour_type: body.type || 'cultural',
      status: body.status || 'draft',
      is_bestseller: body.isBestseller || false,
      enable_private_tour: body.enablePrivateTour ?? true,
      enable_group_tour: body.enableGroupTour ?? false,
      private_tour_prices: body.privateTourPrices || [],
      group_tour_prices: body.groupTourPrices || [],
      // Convert highlights to array (handle both string and array formats)
      highlights_en: Array.isArray(body.highlights?.en)
        ? body.highlights.en
        : (body.highlights?.en?.split?.(/[\n\r]+/).filter((s: string) => s.trim()) || []),
      highlights_de: Array.isArray(body.highlights?.de)
        ? body.highlights.de
        : (body.highlights?.de?.split?.(/[\n\r]+/).filter((s: string) => s.trim()) || []),
      highlights_ru: Array.isArray(body.highlights?.ru)
        ? body.highlights.ru
        : (body.highlights?.ru?.split?.(/[\n\r]+/).filter((s: string) => s.trim()) || []),
      included_en: body.included?.en || [],
      included_de: body.included?.de || [],
      included_ru: body.included?.ru || [],
      not_included_en: body.notIncluded?.en || [],
      not_included_de: body.notIncluded?.de || [],
      not_included_ru: body.notIncluded?.ru || [],
      group_size: body.groupSize || '2-10',
      rating: 0,
      reviews: 0,
      faq: body.faq || [],
      // SEO fields
      seo_meta_title_en: body.seo?.metaTitle?.en || '',
      seo_meta_title_de: body.seo?.metaTitle?.de || '',
      seo_meta_title_ru: body.seo?.metaTitle?.ru || '',
      seo_meta_description_en: body.seo?.metaDescription?.en || '',
      seo_meta_description_de: body.seo?.metaDescription?.de || '',
      seo_meta_description_ru: body.seo?.metaDescription?.ru || '',
      seo_keywords_en: body.seo?.keywords?.en || '',
      seo_keywords_de: body.seo?.keywords?.de || '',
      seo_keywords_ru: body.seo?.keywords?.ru || '',
      seo_og_image: body.seo?.ogImage || body.mainImage || '',
      seo_canonical_url: body.seo?.canonicalUrl || '',
    };

    // Insert tour
    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .insert(tourData)
      .select()
      .single();

    if (tourError) {
      console.error('Supabase insert error:', tourError);
      return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
    }

    // Insert itineraries if provided
    if (body.itinerary && body.itinerary.length > 0) {
      const itineraryData = body.itinerary.map((day: any) => ({
        tour_id: tour.id,
        day_number: day.day,
        title_en: day.title?.en || '',
        title_de: day.title?.de || '',
        title_ru: day.title?.ru || '',
        description_en: day.description?.en || '',
        description_de: day.description?.de || '',
        description_ru: day.description?.ru || '',
        image: day.image || '',
      }));

      const { error: itineraryError } = await supabase
        .from('itineraries')
        .insert(itineraryData);

      if (itineraryError) {
        console.error('Itinerary insert error:', itineraryError);
        // Don't fail the whole request, tour is already created
      }
    }

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}
