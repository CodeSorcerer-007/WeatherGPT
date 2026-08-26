import { NextRequest, NextResponse } from 'next/server';
import { MOCK_ALERTS } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationName = searchParams.get('locationName')?.toLowerCase();

  let alerts = MOCK_ALERTS;
  if (locationName) {
    alerts = alerts.filter(
      (a) =>
        a.locationName.toLowerCase().includes(locationName) ||
        a.affectedAreas.some((area) => area.toLowerCase().includes(locationName))
    );
  }

  return NextResponse.json({
    success: true,
    data: alerts,
    total: alerts.length,
  });
}
