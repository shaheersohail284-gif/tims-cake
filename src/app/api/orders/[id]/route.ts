import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/auth';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'preparing', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['delivered'],
  cancelled: [],
  delivered: [],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status || !VALID_TRANSITIONS[status]) {
      return NextResponse.json(
        { error: 'Invalid status.' },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found.' },
        { status: 404 }
      );
    }

    const allowedNext = VALID_TRANSITIONS[order.status];
    if (!allowedNext.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from "${order.status}" to "${status}".` },
        { status: 400 }
      );
    }

    const updated = await db.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update order.' },
      { status: 500 }
    );
  }
}
