import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }

    return NextResponse.json(posts || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const postData = {
      slug: body.slug,
      title_en: body.title?.en || body.title_en || '',
      title_de: body.title?.de || body.title_de || '',
      title_ru: body.title?.ru || body.title_ru || '',
      excerpt_en: body.excerpt?.en || body.excerpt_en || '',
      excerpt_de: body.excerpt?.de || body.excerpt_de || '',
      excerpt_ru: body.excerpt?.ru || body.excerpt_ru || '',
      content_en: body.content?.en || body.content_en || '',
      content_de: body.content?.de || body.content_de || '',
      content_ru: body.content?.ru || body.content_ru || '',
      image: body.image || '',
      gallery: body.gallery || [],
      author: body.author || '',
      category: body.category || '',
      tags: body.tags || [],
      status: body.status || 'draft',
      // SEO fields
      meta_title_en: body.meta_title_en || '',
      meta_title_de: body.meta_title_de || '',
      meta_title_ru: body.meta_title_ru || '',
      meta_description_en: body.meta_description_en || '',
      meta_description_de: body.meta_description_de || '',
      meta_description_ru: body.meta_description_ru || '',
      keywords_en: body.keywords_en || '',
      keywords_de: body.keywords_de || '',
      keywords_ru: body.keywords_ru || '',
      og_title_en: body.og_title_en || '',
      og_title_de: body.og_title_de || '',
      og_title_ru: body.og_title_ru || '',
      og_description_en: body.og_description_en || '',
      og_description_de: body.og_description_de || '',
      og_description_ru: body.og_description_ru || '',
    };

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
