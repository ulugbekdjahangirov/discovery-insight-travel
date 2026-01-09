import { NextRequest, NextResponse } from 'next/server';

// POST - Generate SEO content using AI
export async function POST(request: NextRequest) {
  try {
    const { title, content, locale = 'en' } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const languageNames: Record<string, string> = {
      en: 'English',
      de: 'German',
      ru: 'Russian',
    };

    const prompt = `You are an SEO expert for a travel agency website. Generate SEO metadata for a blog post.

Title: ${title}
${content ? `Content excerpt: ${content.substring(0, 500)}` : ''}

Generate the following in ${languageNames[locale] || 'English'}:
1. meta_title: An SEO-optimized title (50-60 characters)
2. meta_description: A compelling meta description (150-160 characters)
3. keywords: 5-8 relevant keywords separated by commas
4. og_title: Open Graph title for social sharing
5. og_description: Open Graph description for social sharing (slightly longer, more engaging)

Respond ONLY with a valid JSON object in this exact format:
{
  "meta_title": "...",
  "meta_description": "...",
  "keywords": "keyword1, keyword2, keyword3, ...",
  "og_title": "...",
  "og_description": "..."
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json({ error: 'Failed to generate SEO content' }, { status: 500 });
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content;

    if (!generatedText) {
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }

    // Parse the JSON response
    try {
      const seoData = JSON.parse(generatedText);
      return NextResponse.json(seoData);
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedText);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
