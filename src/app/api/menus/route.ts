import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all menus (with optional location filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const status = searchParams.get('status');

    let query = supabase
      .from('menus')
      .select('*')
      .order('order_index', { ascending: true });

    if (location) {
      query = query.eq('location', location);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching menus:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Organize into tree structure (supports 3 levels)
    const menuItems = data || [];

    // Helper function to build tree recursively
    const buildTree = (items: any[], parentId: number | null = null): any[] => {
      return items
        .filter(item => item.parent_id === parentId)
        .sort((a, b) => a.order_index - b.order_index)
        .map(item => ({
          ...item,
          children: buildTree(items, item.id)
        }));
    };

    const menuTree = buildTree(menuItems, null);

    return NextResponse.json(menuTree);
  } catch (error) {
    console.error('Error in GET /api/menus:', error);
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 });
  }
}

// POST create new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const menuData = {
      name_en: body.name_en || '',
      name_de: body.name_de || '',
      name_ru: body.name_ru || '',
      url: body.url || '',
      parent_id: body.parent_id || null,
      location: body.location || 'header',
      order_index: body.order_index || 0,
      open_in_new_tab: body.open_in_new_tab || false,
      icon: body.icon || '',
      status: body.status || 'active',
    };

    const { data, error } = await supabase
      .from('menus')
      .insert([menuData])
      .select()
      .single();

    if (error) {
      console.error('Error creating menu:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/menus:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}
