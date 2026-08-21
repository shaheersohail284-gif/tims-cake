import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
