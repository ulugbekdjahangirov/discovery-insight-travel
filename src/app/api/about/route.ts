import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch about content
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .single();

    if (error) {
      // If no data exists, return default empty structure
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          hero_image: '',
          hero_subtitle_en: '',
          hero_subtitle_de: '',
          hero_subtitle_ru: '',
          story_title_en: 'Our Story',
          story_title_de: 'Unsere Geschichte',
          story_title_ru: 'Наша история',
          story_paragraph1_en: '',
          story_paragraph1_de: '',
          story_paragraph1_ru: '',
          story_paragraph2_en: '',
          story_paragraph2_de: '',
          story_paragraph2_ru: '',
          story_images: [],
          stats: [],
          values: [],
          team_title_en: 'Meet Our Team',
          team_title_de: 'Unser Team',
          team_title_ru: 'Наша команда',
          team_subtitle_en: '',
          team_subtitle_de: '',
          team_subtitle_ru: '',
          team_members: [],
        });
      }
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch about content' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update about content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if record exists
    const { data: existing } = await supabase
      .from('about_content')
      .select('id')
      .single();

    let result;

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('about_content')
        .update({
          hero_image: body.hero_image || '',
          hero_subtitle_en: body.hero_subtitle_en || '',
          hero_subtitle_de: body.hero_subtitle_de || '',
          hero_subtitle_ru: body.hero_subtitle_ru || '',
          story_title_en: body.story_title_en || 'Our Story',
          story_title_de: body.story_title_de || 'Unsere Geschichte',
          story_title_ru: body.story_title_ru || 'Наша история',
          story_paragraph1_en: body.story_paragraph1_en || '',
          story_paragraph1_de: body.story_paragraph1_de || '',
          story_paragraph1_ru: body.story_paragraph1_ru || '',
          story_paragraph2_en: body.story_paragraph2_en || '',
          story_paragraph2_de: body.story_paragraph2_de || '',
          story_paragraph2_ru: body.story_paragraph2_ru || '',
          story_images: body.story_images || [],
          stats: body.stats || [],
          values: body.values || [],
          team_title_en: body.team_title_en || 'Meet Our Team',
          team_title_de: body.team_title_de || 'Unser Team',
          team_title_ru: body.team_title_ru || 'Наша команда',
          team_subtitle_en: body.team_subtitle_en || '',
          team_subtitle_de: body.team_subtitle_de || '',
          team_subtitle_ru: body.team_subtitle_ru || '',
          team_members: body.team_members || [],
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
      }
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('about_content')
        .insert({
          hero_image: body.hero_image || '',
          hero_subtitle_en: body.hero_subtitle_en || '',
          hero_subtitle_de: body.hero_subtitle_de || '',
          hero_subtitle_ru: body.hero_subtitle_ru || '',
          story_title_en: body.story_title_en || 'Our Story',
          story_title_de: body.story_title_de || 'Unsere Geschichte',
          story_title_ru: body.story_title_ru || 'Наша история',
          story_paragraph1_en: body.story_paragraph1_en || '',
          story_paragraph1_de: body.story_paragraph1_de || '',
          story_paragraph1_ru: body.story_paragraph1_ru || '',
          story_paragraph2_en: body.story_paragraph2_en || '',
          story_paragraph2_de: body.story_paragraph2_de || '',
          story_paragraph2_ru: body.story_paragraph2_ru || '',
          story_images: body.story_images || [],
          stats: body.stats || [],
          values: body.values || [],
          team_title_en: body.team_title_en || 'Meet Our Team',
          team_title_de: body.team_title_de || 'Unser Team',
          team_title_ru: body.team_title_ru || 'Наша команда',
          team_subtitle_en: body.team_subtitle_en || '',
          team_subtitle_de: body.team_subtitle_de || '',
          team_subtitle_ru: body.team_subtitle_ru || '',
          team_members: body.team_members || [],
        })
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        return NextResponse.json({ error: 'Failed to create about content' }, { status: 500 });
      }
      result = data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
