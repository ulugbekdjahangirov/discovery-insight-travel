import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch single destination by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { data: destination, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update destination
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const updateData: any = {};

    if (body.name) {
      updateData.name_en = body.name.en || body.name_en;
      updateData.name_de = body.name.de || body.name_de || '';
      updateData.name_ru = body.name.ru || body.name_ru || '';
    }

    if (body.description) {
      updateData.description_en = body.description.en || body.description_en;
      updateData.description_de = body.description.de || body.description_de || '';
      updateData.description_ru = body.description.ru || body.description_ru || '';
    }

    if (body.slug) updateData.slug = body.slug;
    if (body.image) updateData.image = body.image;
    if (body.country) updateData.country = body.country;
    if (body.region) updateData.region = body.region;
    if (body.status) updateData.status = body.status;
    if (body.featured !== undefined) updateData.featured = body.featured;

    const { data: destination, error } = await supabase
      .from('destinations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 });
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 });
  }
}

// DELETE - Delete destination
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 });
  }
}
