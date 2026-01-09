import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData = {
      slug: body.slug,
      title_en: body.title_en || '',
      title_de: body.title_de || '',
      title_ru: body.title_ru || '',
      excerpt_en: body.excerpt_en || '',
      excerpt_de: body.excerpt_de || '',
      excerpt_ru: body.excerpt_ru || '',
      content_en: body.content_en || '',
      content_de: body.content_de || '',
      content_ru: body.content_ru || '',
      image: body.image || '',
      gallery: body.gallery || [],
      author: body.author || '',
      category: body.category || '',
      status: body.status || 'draft',
      updated_at: new Date().toISOString(),
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
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
