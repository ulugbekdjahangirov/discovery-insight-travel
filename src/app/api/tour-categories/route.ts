import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all tour categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const showInMenu = searchParams.get('show_in_menu');
    const slug = searchParams.get('slug');

    let query = supabase
      .from('tour_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (slug) {
      query = query.eq('slug', slug);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (showInMenu === 'true') {
      query = query.eq('show_in_menu', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name?.en || !body.slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name.en, slug' },
        { status: 400 }
      );
    }

    const categoryData = {
      slug: body.slug,
      name_en: body.name.en,
      name_de: body.name.de || '',
      name_ru: body.name.ru || '',
      description_en: body.description?.en || '',
      description_de: body.description?.de || '',
      description_ru: body.description?.ru || '',
      icon: body.icon || 'map',
      display_order: body.displayOrder || 0,
      show_in_menu: body.showInMenu ?? true,
      status: body.status || 'active',
      image: body.image || '',
    };

    const { data, error } = await supabase
      .from('tour_categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
