import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch single review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        tours (
          id,
          slug,
          title_en
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const updateData: any = {};

    if (body.tour_id !== undefined) updateData.tour_id = body.tour_id;
    if (body.author_name) updateData.author_name = body.author_name;
    if (body.author_email !== undefined) updateData.author_email = body.author_email;
    if (body.author_country !== undefined) updateData.author_country = body.author_country;
    if (body.author_avatar !== undefined) updateData.author_avatar = body.author_avatar;
    if (body.rating) updateData.rating = body.rating;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.comment) updateData.comment = body.comment;
    if (body.status) updateData.status = body.status;
    if (body.source) updateData.source = body.source;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

// DELETE - Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
