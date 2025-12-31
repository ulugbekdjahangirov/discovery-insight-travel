import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET single menu item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching menu:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/menus/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch menu item' }, { status: 500 });
  }
}

// PUT update menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updateData: Record<string, any> = {};

    if (body.name_en !== undefined) updateData.name_en = body.name_en;
    if (body.name_de !== undefined) updateData.name_de = body.name_de;
    if (body.name_ru !== undefined) updateData.name_ru = body.name_ru;
    if (body.url !== undefined) updateData.url = body.url;
    if (body.parent_id !== undefined) updateData.parent_id = body.parent_id;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.order_index !== undefined) updateData.order_index = body.order_index;
    if (body.open_in_new_tab !== undefined) updateData.open_in_new_tab = body.open_in_new_tab;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.status !== undefined) updateData.status = body.status;

    const { data, error } = await supabase
      .from('menus')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating menu:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT /api/menus/[id]:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

// DELETE menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // First delete all children
    await supabase
      .from('menus')
      .delete()
      .eq('parent_id', id);

    // Then delete the parent
    const { error } = await supabase
      .from('menus')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/menus/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
