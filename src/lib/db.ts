import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma requires DATABASE_URL even when using adapter
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./db/dummy.db'
}

const libsql = createClient({
  url: 'libsql://tims-cake-db-shaheersohail284-gif.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3OTAwOTQxMTksImlhdCI6MTc4NzUwMjExOSwiaWQiOiIwMWEwMmY2YS03MDAxLTdkOGUtODc3MS1mMGUyOGRmZDcyODEiLCJraWQiOiJtbHVMdXBhLVlVVGlNYmFYaUNXVjhOX05jNnY3NWFXUlpjby1oV18zemFjIiwicmlkIjoiYmFiMTczYzctYjQzNy00NTMzLTk2ZmEtZmY3MjEyOWQ4M2Y3In0.OyoTOz8A5L9aLGgz9CkC3Usat9N_hKp1iopfgRCpRDTm5SL83kmA7wMZ3dXfZMhCyJnuQdrVejX1gfRF41IPAw',
})
const adapter = new PrismaLibSql(libsql)

export const db =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
