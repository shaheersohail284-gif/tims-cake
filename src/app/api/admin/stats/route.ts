import { countOrders, sumOrderRevenue, getRecentOrders, getOrderStatusBreakdown } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalOrders, pendingOrders, totalRevenue, recentOrders, statusBreakdown] =
      await Promise.all([
        countOrders(),
        countOrders('pending'),
        sumOrderRevenue(),
        getRecentOrders(5),
        getOrderStatusBreakdown(),
      ]);

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      recentOrders,
      statusBreakdown,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch stats.' },
      { status: 500 }
    );
  }
}
