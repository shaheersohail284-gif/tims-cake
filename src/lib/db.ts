import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

async function createPrismaClient() {
  const { PrismaLibSql } = await import('@prisma/adapter-libsql')
  const { createClient } = await import('@libsql/client')
  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  const adapter = new PrismaLibSql(libsql)
  return new PrismaClient({ adapter })
}

export const db =
  globalForPrisma.prisma ??
  (process.env.TURSO_DATABASE_URL ? await createPrismaClient() : new PrismaClient())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
