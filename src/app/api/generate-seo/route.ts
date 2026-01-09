import { NextRequest, NextResponse } from 'next/server';

interface TourData {
  title: { en: string; de: string; ru: string };
  destination: string;
  duration: number;
  type: string;
  description: { en: string; de: string; ru: string };
  highlights: { en: string; de: string; ru: string };
  included: { en: string[]; de: string[]; ru: string[] };
  itinerary: {
    day: number;
    title: { en: string; de: string; ru: string };
    description: { en: string; de: string; ru: string };
  }[];
  faq: {
    question: { en: string; de: string; ru: string };
    answer: { en: string; de: string; ru: string };
  }[];
}

// SEO templates for different languages
const seoTemplates = {
  en: {
    metaTitleTemplates: [
      '{title} | {duration} Days Tour in {destination}',
      '{title} - Best {type} Tour in {destination}',
      'Explore {destination}: {title} | {duration} Days',
    ],
    metaDescriptionTemplates: [
      'Discover {destination} with our {duration}-day {title}. {highlights_short}. Book now for an unforgettable experience!',
      'Experience the best of {destination} on our {title}. {duration} days of adventure including {included_short}. Reserve your spot today!',
      'Join our {title} in {destination}. {highlights_short}. Perfect {type} tour for {duration} days.',
    ],
    keywordsBase: [
      '{destination} tour',
      '{destination} travel',
      '{type} tour {destination}',
      '{title}',
      '{duration} day tour',
      'best tours {destination}',
      '{destination} vacation',
      '{destination} trip',
    ],
  },
  de: {
    metaTitleTemplates: [
      '{title} | {duration} Tage Tour in {destination}',
      '{title} - Beste {type} Tour in {destination}',
      'Entdecken Sie {destination}: {title} | {duration} Tage',
    ],
    metaDescriptionTemplates: [
      'Entdecken Sie {destination} mit unserer {duration}-tägigen {title}. {highlights_short}. Buchen Sie jetzt für ein unvergessliches Erlebnis!',
      'Erleben Sie das Beste von {destination} bei unserer {title}. {duration} Tage Abenteuer inklusive {included_short}. Reservieren Sie heute!',
      'Begleiten Sie unsere {title} in {destination}. {highlights_short}. Perfekte {type} Tour für {duration} Tage.',
    ],
    keywordsBase: [
      '{destination} Reise',
      '{destination} Tour',
      '{type} Tour {destination}',
      '{title}',
      '{duration} Tage Tour',
      'Beste Touren {destination}',
      '{destination} Urlaub',
      '{destination} Rundreise',
    ],
  },
  ru: {
    metaTitleTemplates: [
      '{title} | {duration} Дней Тур в {destination}',
      '{title} - Лучший {type} тур в {destination}',
      'Откройте {destination}: {title} | {duration} Дней',
    ],
    metaDescriptionTemplates: [
      'Откройте для себя {destination} с нашим {duration}-дневным туром {title}. {highlights_short}. Забронируйте сейчас!',
      'Испытайте лучшее из {destination} в нашем туре {title}. {duration} дней приключений включая {included_short}. Забронируйте сегодня!',
      'Присоединяйтесь к нашему туру {title} в {destination}. {highlights_short}. Идеальный {type} тур на {duration} дней.',
    ],
    keywordsBase: [
      '{destination} тур',
      '{destination} путешествие',
      '{type} тур {destination}',
      '{title}',
      '{duration} дневный тур',
      'лучшие туры {destination}',
      '{destination} отдых',
      '{destination} поездка',
    ],
  },
};

const tourTypeTranslations: Record<string, Record<string, string>> = {
  cultural: { en: 'Cultural', de: 'Kultur', ru: 'Культурный' },
  adventure: { en: 'Adventure', de: 'Abenteuer', ru: 'Приключенческий' },
  historical: { en: 'Historical', de: 'Historisch', ru: 'Исторический' },
  group: { en: 'Group', de: 'Gruppe', ru: 'Групповой' },
  private: { en: 'Private', de: 'Privat', ru: 'Частный' },
};

function replacePlaceholders(
  template: string,
  data: {
    title: string;
    destination: string;
    duration: number;
    type: string;
    highlights_short: string;
    included_short: string;
  }
): string {
  return template
    .replace(/{title}/g, data.title)
    .replace(/{destination}/g, data.destination)
    .replace(/{duration}/g, data.duration.toString())
    .replace(/{type}/g, data.type)
    .replace(/{highlights_short}/g, data.highlights_short)
    .replace(/{included_short}/g, data.included_short);
}

function getShortText(text: any, maxLength: number): string {
  if (!text) return '';
  // Handle arrays (like included items)
  if (Array.isArray(text)) {
    return text.slice(0, 3).join(', ');
  }
  // Ensure text is a string
  const textStr = String(text);
  const sentences = textStr.split(/[.!?]+/).filter(s => s.trim());
  let result = '';
  for (const sentence of sentences) {
    if ((result + sentence).length > maxLength) break;
    result += sentence.trim() + '. ';
  }
  return result.trim() || textStr.substring(0, maxLength);
}

export async function POST(request: NextRequest) {
  try {
    const { tourData, language } = await request.json() as {
      tourData: TourData;
      language: 'en' | 'de' | 'ru';
    };

    if (!tourData || !language) {
      return NextResponse.json(
        { error: 'Missing tourData or language' },
        { status: 400 }
      );
    }

    const templates = seoTemplates[language];
    const title = tourData.title[language] || tourData.title.en || 'Tour';
    const destination = tourData.destination || 'Uzbekistan';
    const duration = tourData.duration || 1;
    const type = tourTypeTranslations[tourData.type]?.[language] || tourData.type;

    // Get short versions for description
    const highlights = tourData.highlights[language] || tourData.highlights.en || '';
    const highlightsShort = getShortText(highlights, 80);

    const included = tourData.included[language] || tourData.included.en || [];
    const includedShort = included.slice(0, 3).join(', ');

    const replacementData = {
      title,
      destination,
      duration,
      type,
      highlights_short: highlightsShort,
      included_short: includedShort,
    };

    // Generate meta title (pick random template)
    const metaTitleTemplate = templates.metaTitleTemplates[
      Math.floor(Math.random() * templates.metaTitleTemplates.length)
    ];
    let metaTitle = replacePlaceholders(metaTitleTemplate, replacementData);
    // Ensure meta title is within 60 characters
    if (metaTitle.length > 60) {
      metaTitle = metaTitle.substring(0, 57) + '...';
    }

    // Generate meta description (pick random template)
    const metaDescTemplate = templates.metaDescriptionTemplates[
      Math.floor(Math.random() * templates.metaDescriptionTemplates.length)
    ];
    let metaDescription = replacePlaceholders(metaDescTemplate, replacementData);
    // Ensure meta description is within 160 characters
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.substring(0, 157) + '...';
    }

    // Generate keywords
    const keywordsSet = new Set<string>();
    templates.keywordsBase.forEach(keyword => {
      const replaced = replacePlaceholders(keyword, replacementData).toLowerCase();
      if (replaced.trim()) {
        keywordsSet.add(replaced.trim());
      }
    });

    // Add keywords from itinerary places
    tourData.itinerary?.forEach(day => {
      const dayTitle = day.title[language] || day.title.en;
      if (dayTitle) {
        // Extract potential place names (words starting with capital)
        const words = dayTitle.split(/\s+/);
        words.forEach(word => {
          if (word.length > 3 && /^[A-Z]/.test(word)) {
            keywordsSet.add(word.toLowerCase());
          }
        });
      }
    });

    const keywords = Array.from(keywordsSet).slice(0, 10).join(', ');

    return NextResponse.json({
      metaTitle,
      metaDescription,
      keywords,
    });
  } catch (error) {
    console.error('Error generating SEO:', error);
    return NextResponse.json(
      { error: 'Failed to generate SEO content' },
      { status: 500 }
    );
  }
}
