import { getCakes } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cakes = await getCakes();
    return NextResponse.json(cakes);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch cakes' }, { status: 500 });
  }
}
