import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch single tour by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { data: tour, error } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Get itineraries
    const { data: itineraries } = await supabase
      .from('itineraries')
      .select('*')
      .eq('tour_id', id)
      .order('day_number');

    return NextResponse.json({ ...tour, itineraries: itineraries || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update tour
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Prepare update data
    const updateData: any = {};

    if (body.title) {
      updateData.title_en = body.title.en || body.title_en;
      updateData.title_de = body.title.de || body.title_de || '';
      updateData.title_ru = body.title.ru || body.title_ru || '';
    }

    if (body.description) {
      updateData.description_en = body.description.en || body.description_en;
      updateData.description_de = body.description.de || body.description_de || '';
      updateData.description_ru = body.description.ru || body.description_ru || '';
    }

    // Direct fields
    if (body.slug) updateData.slug = body.slug;
    if (body.destination) updateData.destination = body.destination;
    if (body.duration) updateData.duration = body.duration;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.main_image || body.mainImage) updateData.main_image = body.main_image || body.mainImage;
    if (body.gallery_images || body.galleryImages) updateData.gallery_images = body.gallery_images || body.galleryImages;
    if (body.tour_type || body.type) updateData.tour_type = body.tour_type || body.type;
    if (body.status) updateData.status = body.status;
    if (body.is_bestseller !== undefined || body.isBestseller !== undefined) {
      updateData.is_bestseller = body.is_bestseller ?? body.isBestseller;
    }
    if (body.group_size || body.groupSize) updateData.group_size = body.group_size || body.groupSize;

    // Included/Not included
    if (body.included) {
      updateData.included_en = body.included.en || [];
      updateData.included_de = body.included.de || [];
      updateData.included_ru = body.included.ru || [];
    }
    if (body.notIncluded) {
      updateData.not_included_en = body.notIncluded.en || [];
      updateData.not_included_de = body.notIncluded.de || [];
      updateData.not_included_ru = body.notIncluded.ru || [];
    }

    // Update tour
    const { data: tour, error } = await supabase
      .from('tours')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
    }

    // Update itineraries if provided
    if (body.itinerary && body.itinerary.length > 0) {
      // Delete existing itineraries
      await supabase.from('itineraries').delete().eq('tour_id', id);

      // Insert new itineraries
      const itineraryData = body.itinerary.map((day: any) => ({
        tour_id: parseInt(id),
        day_number: day.day || day.day_number,
        title_en: day.title?.en || day.title_en || '',
        title_de: day.title?.de || day.title_de || '',
        title_ru: day.title?.ru || day.title_ru || '',
        description_en: day.description?.en || day.description_en || '',
        description_de: day.description?.de || day.description_de || '',
        description_ru: day.description?.ru || day.description_ru || '',
      }));

      await supabase.from('itineraries').insert(itineraryData);
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
  }
}

// DELETE - Delete tour
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Delete itineraries first (cascade should handle this, but just in case)
    await supabase.from('itineraries').delete().eq('tour_id', id);

    // Delete tour
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
  }
}
