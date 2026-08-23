import { getOrders, createOrder, getCakeById } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/auth';
import { rateLimit, sanitizeInput, validateEmail, validatePhone } from '@/lib/security';

export async function GET() {
  try {
    const admin = await getAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(ip, 5, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many order attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      notes,
      items,
    } = body;

    const name = sanitizeInput(customerName, 100);
    const email = sanitizeInput(customerEmail, 200);
    const phone = sanitizeInput(customerPhone, 30);
    const address = sanitizeInput(deliveryAddress, 300);
    const date = sanitizeInput(deliveryDate, 20);
    const time = sanitizeInput(deliveryTime, 20);
    const safeNotes = notes ? sanitizeInput(notes, 1000) : null;

    if (!name || !email || !phone || !address || !date || !time) {
      return NextResponse.json(
        { error: 'All required fields must be filled.' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: 'Please provide a valid phone number.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty.' },
        { status: 400 }
      );
    }

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems: {
      cakeId: string;
      cakeName: string;
      weight: string;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of items) {
      const cake = await getCakeById(item.cakeId);

      if (!cake || !cake.isAvailable) {
        return NextResponse.json(
          { error: `"${item.name}" is no longer available.` },
          { status: 400 }
        );
      }

      // Verify the selected weight + price exists in the cake's price list
      let priceValid = false;
      try {
        const priceList = JSON.parse(cake.prices || '[]');
        priceValid = priceList.some(
          (p: { weight: string; price: number }) =>
            p.weight === item.weight && p.price === item.price
        );
      } catch { /* ignore */ }

      if (!priceValid) {
        return NextResponse.json(
          { error: `Invalid price for "${item.name}" (${item.weight}). Please re-select.` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, Math.min(item.quantity, 20));
      totalAmount += item.price * qty;
      orderItems.push({
        cakeId: cake.id,
        cakeName: item.name,
        weight: item.weight,
        quantity: qty,
        price: item.price,
      });
    }

    const order = await createOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      deliveryAddress: address,
      deliveryDate: date,
      deliveryTime: time,
      notes: safeNotes,
      totalAmount: Math.round(totalAmount * 100) / 100,
      items: orderItems,
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
