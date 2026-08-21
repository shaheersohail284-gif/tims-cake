import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cakes = await db.cake.findMany({
      where: { isAvailable: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(cakes);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch cakes' }, { status: 500 });
  }
}
