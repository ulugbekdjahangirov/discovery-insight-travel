import { NextRequest, NextResponse } from 'next/server';

// Demo data - in production, this would come from a database
const tours = [
  {
    id: 1,
    slug: 'classic-uzbekistan',
    title: { en: 'Classic Uzbekistan Tour', de: 'Klassische Usbekistan Reise', ru: 'Классический тур по Узбекистану' },
    destination: 'Uzbekistan',
    duration: 8,
    price: 1299,
    rating: 4.9,
    reviews: 124,
    type: 'cultural',
    status: 'active',
    isBestseller: true,
  },
  {
    id: 2,
    slug: 'silk-road-adventure',
    title: { en: 'Silk Road Adventure', de: 'Seidenstraße Abenteuer', ru: 'Приключение на Шелковом пути' },
    destination: 'Central Asia',
    duration: 14,
    price: 2499,
    rating: 4.8,
    reviews: 89,
    type: 'adventure',
    status: 'active',
    isBestseller: true,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination');
  const type = searchParams.get('type');
  const limit = searchParams.get('limit');

  let filteredTours = [...tours];

  if (destination) {
    filteredTours = filteredTours.filter(
      (tour) => tour.destination.toLowerCase() === destination.toLowerCase()
    );
  }

  if (type) {
    filteredTours = filteredTours.filter((tour) => tour.type === type);
  }

  if (limit) {
    filteredTours = filteredTours.slice(0, parseInt(limit));
  }

  return NextResponse.json(filteredTours);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.destination || !body.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, save to database
    const newTour = {
      id: tours.length + 1,
      slug: body.title.en.toLowerCase().replace(/\s+/g, '-'),
      ...body,
      rating: 0,
      reviews: 0,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(newTour, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create tour' },
      { status: 500 }
    );
  }
}
