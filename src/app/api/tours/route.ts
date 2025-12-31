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

      return NextResponse.json({ ...data, itineraries: itineraries || [] });
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
      duration: body.duration || 1,
      price: body.price,
      main_image: body.images?.[0] || body.mainImage || '',
      gallery_images: body.images?.slice(1) || body.galleryImages || [],
      tour_type: body.type || 'cultural',
      status: body.status || 'draft',
      is_bestseller: body.isBestseller || false,
      included_en: body.included?.en || [],
      included_de: body.included?.de || [],
      included_ru: body.included?.ru || [],
      not_included_en: body.notIncluded?.en || [],
      not_included_de: body.notIncluded?.de || [],
      not_included_ru: body.notIncluded?.ru || [],
      group_size: body.groupSize || '2-10',
      rating: 0,
      reviews: 0,
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
