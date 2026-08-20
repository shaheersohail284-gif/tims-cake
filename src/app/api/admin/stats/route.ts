import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalOrders, pendingOrders, revenueResult, recentOrders, statusBreakdown] =
      await Promise.all([
        db.order.count(),
        db.order.count({ where: { status: 'pending' } }),
        db.order.aggregate({
          _sum: { totalAmount: true },
          where: { status: { not: 'cancelled' } },
        }),
        db.order.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { items: true },
        }),
        db.order.groupBy({
          by: ['status'],
          _count: true,
        }),
      ]);

    const totalRevenue = revenueResult._sum.totalAmount || 0;

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      recentOrders,
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s.status,
        count: s._count,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch stats.' },
      { status: 500 }
    );
  }
}
