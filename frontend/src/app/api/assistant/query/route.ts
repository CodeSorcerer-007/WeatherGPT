import { NextRequest, NextResponse } from 'next/server';
import { processGroundedQuery } from '@/lib/aiEngine';
import { INDIAN_LOCATIONS } from '@/lib/mockData';
import { LanguageCode, PersonaType } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, locationId, language = 'en', persona = 'citizen' } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const location =
      INDIAN_LOCATIONS.find((l) => l.id === locationId) || INDIAN_LOCATIONS[0];

    const result = processGroundedQuery(
      query,
      location,
      language as LanguageCode,
      persona as PersonaType
    );

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process AI weather query', details: error.message },
      { status: 500 }
    );
  }
}
