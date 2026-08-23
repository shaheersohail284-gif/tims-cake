import { cookies } from 'next/headers';
import { getAdminByEmail } from '@/lib/db';
import { ADMIN_TOKEN_KEY } from '@/lib/security';

// For simplicity, store active tokens in a module-level Map
const activeTokens = new Map<string, { adminId: string; email: string }>();

export async function getAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_KEY)?.value;
  if (!token) return null;
  const session = activeTokens.get(token);
  if (!session) return null;
  const admin = await getAdminByEmail(session.email);
  return admin;
}

export function createAdminSession(admin: { id: string; email: string }) {
  const token = crypto.randomUUID().replace(/-/g, '');
  activeTokens.set(token, { adminId: admin.id, email: admin.email });
  return token;
}

export function destroyAdminSession(token: string) {
  activeTokens.delete(token);
}
