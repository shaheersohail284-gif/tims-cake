import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, validateEmail, sanitizeInput } from '@/lib/security';
import { createAdminSession } from '@/lib/auth';
import { ADMIN_TOKEN_KEY } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const safeEmail = sanitizeInput(email, 200).toLowerCase();

    if (!validateEmail(safeEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    const admin = await db.admin.findUnique({ where: { email: safeEmail } });

    if (!admin || !verifyPassword(password, admin.password)) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = createAdminSession({ id: admin.id, email: admin.email });

    const response = NextResponse.json({
      name: admin.name,
      email: admin.email,
    });

    response.cookies.set(ADMIN_TOKEN_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Login failed.' },
      { status: 500 }
    );
  }
}

function verifyPassword(password: string, hash: string): boolean {
  const inputHash = hashPassword(password);
  return inputHash === hash;
}
