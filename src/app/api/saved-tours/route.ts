import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Helper to get or create session ID
function getSessionId(request: NextRequest): string {
  const cookieSessionId = request.cookies.get('session_id')?.value;
  return cookieSessionId || uuidv4();
}

// GET - Get saved tours for current session or all stats for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stats = searchParams.get('stats');
    const tourId = searchParams.get('tour_id');

    // Admin stats - get all saved tours with counts
    if (stats === 'true') {
      const { data, error } = await supabase
        .from('saved_tours')
        .select(`
          id,
          tour_id,
          session_id,
          ip_address,
          created_at,
          tours (
            id,
            slug,
            title_en,
            title_de,
            title_ru,
            main_image,
            destination
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
      }

      // Group by tour and count
      const tourStats: Record<number, { tour: any; count: number; saves: any[] }> = {};

      data?.forEach((item: any) => {
        const tid = item.tour_id;
        if (!tourStats[tid]) {
          tourStats[tid] = {
            tour: item.tours,
            count: 0,
            saves: []
          };
        }
        tourStats[tid].count++;
        tourStats[tid].saves.push({
          id: item.id,
          session_id: item.session_id,
          ip_address: item.ip_address,
          created_at: item.created_at
        });
      });

      return NextResponse.json({
        total_saves: data?.length || 0,
        tours: Object.values(tourStats).sort((a, b) => b.count - a.count)
      });
    }

    // Check if specific tour is saved by current session
    if (tourId) {
      const sessionId = getSessionId(request);

      const { data, error } = await supabase
        .from('saved_tours')
        .select('id')
        .eq('tour_id', tourId)
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error:', error);
      }

      return NextResponse.json({ isSaved: !!data });
    }

    // Get all saved tours for current session
    const sessionId = getSessionId(request);

    const { data, error } = await supabase
      .from('saved_tours')
      .select(`
        id,
        tour_id,
        created_at,
        tours (
          id,
          slug,
          title_en,
          title_de,
          title_ru,
          main_image,
          destination,
          price,
          duration
        )
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch saved tours' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save a tour
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tour_id } = body;

    if (!tour_id) {
      return NextResponse.json({ error: 'tour_id is required' }, { status: 400 });
    }

    const sessionId = getSessionId(request);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_tours')
      .select('id')
      .eq('tour_id', tour_id)
      .eq('session_id', sessionId)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'Already saved', id: existing.id });
    }

    // Save the tour
    const { data, error } = await supabase
      .from('saved_tours')
      .insert({
        tour_id,
        session_id: sessionId,
        ip_address: ip,
        user_agent: userAgent
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save tour' }, { status: 500 });
    }

    // Update saves_count in tours table
    await supabase.rpc('increment_saves_count', { tour_id_param: tour_id });

    // Set session cookie
    const response = NextResponse.json(data);
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });

    return response;
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Unsave a tour
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tour_id');

    if (!tourId) {
      return NextResponse.json({ error: 'tour_id is required' }, { status: 400 });
    }

    const sessionId = getSessionId(request);

    const { error } = await supabase
      .from('saved_tours')
      .delete()
      .eq('tour_id', tourId)
      .eq('session_id', sessionId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to unsave tour' }, { status: 500 });
    }

    // Decrement saves_count in tours table
    await supabase.rpc('decrement_saves_count', { tour_id_param: parseInt(tourId) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
