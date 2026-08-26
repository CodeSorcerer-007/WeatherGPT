import { NextRequest, NextResponse } from 'next/server';
import { INDIAN_LOCATIONS, getMockWeatherObservation } from '@/lib/mockData';
import { fetchCurrentWeather } from '@/lib/weatherApi';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get('locationId') || 'chennai';
  const live = searchParams.get('live') === 'true';

  const location =
    INDIAN_LOCATIONS.find((l) => l.id === locationId) || INDIAN_LOCATIONS[0];

  const observation = await fetchCurrentWeather(location, !live);

  return NextResponse.json({
    success: true,
    location,
    data: observation,
    source: live ? 'Open-Meteo Live API' : 'IMD Model Synthetic Feed (Demo Mode)',
  });
}
