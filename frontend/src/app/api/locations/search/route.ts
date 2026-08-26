import { NextRequest, NextResponse } from 'next/server';
import { searchLocations } from '@/lib/weatherApi';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  const results = searchLocations(q);

  return NextResponse.json({
    success: true,
    total: results.length,
    data: results,
  });
}
