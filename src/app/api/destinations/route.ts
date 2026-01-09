import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all destinations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const country = searchParams.get('country');

    let query = supabase
      .from('destinations')
      .select('*')
      .order('name_en', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    if (country) {
      query = query.eq('country', country);
    }

    const { data: destinations, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
    }

    return NextResponse.json(destinations || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new destination
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const destinationData = {
      slug: body.slug,
      name_en: body.name?.en || body.name_en || '',
      name_de: body.name?.de || body.name_de || '',
      name_ru: body.name?.ru || body.name_ru || '',
      description_en: body.description?.en || body.description_en || '',
      description_de: body.description?.de || body.description_de || '',
      description_ru: body.description?.ru || body.description_ru || '',
      image: body.image || '',
      country: body.country || '',
      region: body.region || '',
      status: body.status || 'active',
      featured: body.featured || false,
      tours_count: 0,
    };

    const { data: destination, error } = await supabase
      .from('destinations')
      .insert(destinationData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
    }

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
  }
}
