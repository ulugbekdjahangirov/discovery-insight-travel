import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tourId = searchParams.get('tour_id');

    let query = supabase
      .from('reviews')
      .select(`
        *,
        tours (
          id,
          slug,
          title_en
        )
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (tourId) {
      query = query.eq('tour_id', parseInt(tourId));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.author_name || !body.rating || !body.comment) {
      return NextResponse.json(
        { error: 'Missing required fields: author_name, rating, comment' },
        { status: 400 }
      );
    }

    const reviewData = {
      tour_id: body.tour_id || null,
      author_name: body.author_name,
      author_email: body.author_email || '',
      author_country: body.author_country || '',
      author_avatar: body.author_avatar || '',
      rating: body.rating,
      title: body.title || '',
      comment: body.comment,
      status: body.status || 'pending',
      source: body.source || 'website',
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
