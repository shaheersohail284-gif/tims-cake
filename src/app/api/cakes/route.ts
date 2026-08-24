import { getCakes } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cakes = await getCakes();
    return NextResponse.json(cakes);
  } catch (e: unknown) {
    return NextResponse.json({ error: 'Failed to fetch cakes', detail: String((e as Error)?.message || e), stack: String((e as Error)?.stack || '') }, { status: 500 });
  }
}
