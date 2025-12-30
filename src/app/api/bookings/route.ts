import { NextRequest, NextResponse } from 'next/server';

// Demo bookings - in production, this would come from a database
const bookings: any[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = searchParams.get('limit');

  let filteredBookings = [...bookings];

  if (status && status !== 'all') {
    filteredBookings = filteredBookings.filter((booking) => booking.status === status);
  }

  if (limit) {
    filteredBookings = filteredBookings.slice(0, parseInt(limit));
  }

  return NextResponse.json(filteredBookings);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'startDate', 'adults'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate booking ID
    const bookingId = `BK${String(bookings.length + 1).padStart(3, '0')}`;

    const newBooking = {
      id: bookingId,
      ...body,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In production, save to database
    bookings.push(newBooking);

    // In production, send confirmation email here

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
