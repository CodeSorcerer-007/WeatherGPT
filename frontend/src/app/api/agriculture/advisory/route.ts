import { NextRequest, NextResponse } from 'next/server';
import { MOCK_AGRICULTURE_MATRIX } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const crop = searchParams.get('crop') || 'Paddy';

  const advisory = MOCK_AGRICULTURE_MATRIX[crop] || MOCK_AGRICULTURE_MATRIX['Paddy'];

  return NextResponse.json({
    success: true,
    crop,
    data: advisory,
  });
}
