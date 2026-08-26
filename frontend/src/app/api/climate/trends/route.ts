import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CLIMATE_DATA } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationName = searchParams.get('locationName') || 'Chennai';

  return NextResponse.json({
    success: true,
    data: {
      ...MOCK_CLIMATE_DATA,
      locationName,
    },
  });
}
