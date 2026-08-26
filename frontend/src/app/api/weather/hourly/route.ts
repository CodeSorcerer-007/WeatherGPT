import { NextRequest, NextResponse } from 'next/server';
import { INDIAN_LOCATIONS, generateHourlyForecast } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get('locationId') || 'chennai';

  const location =
    INDIAN_LOCATIONS.find((l) => l.id === locationId) || INDIAN_LOCATIONS[0];

  const hourly = generateHourlyForecast(location.id);

  return NextResponse.json({
    success: true,
    location,
    data: hourly,
  });
}
