import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch single category with tours count
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { data: category, error } = await supabase
      .from('tour_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Get tours count for this category
    const { count } = await supabase
      .from('tours')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    return NextResponse.json({ ...category, tours_count: count || 0 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const updateData: any = {};

    if (body.slug) updateData.slug = body.slug;
    if (body.name) {
      updateData.name_en = body.name.en;
      updateData.name_de = body.name.de || '';
      updateData.name_ru = body.name.ru || '';
    }
    if (body.description) {
      updateData.description_en = body.description.en || '';
      updateData.description_de = body.description.de || '';
      updateData.description_ru = body.description.ru || '';
    }
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.displayOrder !== undefined) updateData.display_order = body.displayOrder;
    if (body.showInMenu !== undefined) updateData.show_in_menu = body.showInMenu;
    if (body.status) updateData.status = body.status;
    if (body.image !== undefined) updateData.image = body.image;

    const { data, error } = await supabase
      .from('tour_categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // First, unlink all tours from this category
    await supabase
      .from('tours')
      .update({ category_id: null })
      .eq('category_id', id);

    // Then delete the category
    const { error } = await supabase
      .from('tour_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
