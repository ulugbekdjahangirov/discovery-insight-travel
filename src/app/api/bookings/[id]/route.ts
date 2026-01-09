import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch single booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { data, error } = await supabase
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
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const updateData: any = {};

    if (body.tour_id !== undefined) updateData.tour_id = body.tour_id;
    if (body.first_name) updateData.first_name = body.first_name;
    if (body.last_name) updateData.last_name = body.last_name;
    if (body.email) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.tour_date) updateData.tour_date = body.tour_date;
    if (body.tour_type) updateData.tour_type = body.tour_type;
    if (body.adults !== undefined) updateData.adults = body.adults;
    if (body.children !== undefined) updateData.children = body.children;
    if (body.total_price !== undefined) updateData.total_price = body.total_price;
    if (body.currency) updateData.currency = body.currency;
    if (body.special_requests !== undefined) updateData.special_requests = body.special_requests;
    if (body.status) updateData.status = body.status;
    if (body.payment_status) updateData.payment_status = body.payment_status;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE - Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
