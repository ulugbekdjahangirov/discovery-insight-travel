import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tourId = searchParams.get('tour_id');

    let query = supabase
      .from('bookings')
      .select(`
        *,
        tours (
          id,
          slug,
          title_en,
          title_ru,
          title_de
        )
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (tourId) {
      query = query.eq('tour_id', parseInt(tourId));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Accept either tour_date or start_date
    const tourDate = body.tour_date || body.start_date;

    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email || !tourDate) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, email, tour_date' },
        { status: 400 }
      );
    }

    const bookingData = {
      tour_id: body.tour_id || null,
      tour_title: body.tour_title || '',
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone || '',
      country: body.country || '',
      pickup_location: body.pickup_location || '',
      tour_date: tourDate,
      start_time: body.start_time || '09:00',
      end_date: body.end_date || null,
      tour_type: body.tour_type || 'private',
      adults: body.adults || 1,
      children: body.children || 0,
      total_price: body.total_price || null,
      currency: body.currency || 'EUR',
      special_requests: body.special_requests || '',
      how_did_you_hear: body.how_did_you_hear || '',
      status: 'pending',
      payment_status: 'unpaid',
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({
        error: 'Failed to create booking',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
