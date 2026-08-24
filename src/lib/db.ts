import { createClient, type Client } from '@libsql/client'

const db: Client = createClient({
  url: 'libsql://tims-cake-db-shaheersohail284-gif.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODc1NjU5MDksImlkIjoiMDFhMDJmNmEtNzAwMS03ZDhlLTg3NzEtZjBlMjhkZmQ3MjgxIiwia2lkIjoibWx1THVwYS1ZVVRpTWJhWGlDV1Y4Tl9OYzZ2NzVhV1JaY28taFdfM3phYyIsInJpZCI6ImJhYjE3M2M3LWI0MzctNDUzMy05NmZhLWZmNzIxMjlkODNmNyJ9.OVYuH4oDqm6d91cDn9nkZVXlFhfVxtY9hekKGwwNiMia-vthWs-dAVssoK4-lSBYAIAELRQtSEqtNCtsI-xAAA',
})

export { db, type Client }

export async function getCakes() {
  const result = await db.execute('SELECT * FROM Cake ORDER BY createdAt DESC')
  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    prices: row.prices as string,
    image: row.image as string,
    images: JSON.parse(row.images as string || '[]'),
    category: row.category as string,
    isFeatured: (row.isFeatured as number) === 1,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }))
}

export async function getCakeById(id: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM Cake WHERE id = ?',
    args: [id],
  })
  if (result.rows.length === 0) return null
  const row = result.rows[0]
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    prices: row.prices as string,
    image: row.image as string,
    images: JSON.parse(row.images as string || '[]'),
    category: row.category as string,
    isFeatured: (row.isFeatured as number) === 1,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }
}

export async function getOrders() {
  const result = await db.execute('SELECT * FROM "Order" ORDER BY createdAt DESC')
  return result.rows.map(row => ({
    id: row.id as string,
    customerName: row.customerName as string,
    customerPhone: row.customerPhone as string,
    customerAddress: row.customerAddress as string,
    items: JSON.parse(row.items as string),
    totalAmount: row.totalAmount as number,
    status: row.status as string,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }))
}

export async function getOrderById(id: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM "Order" WHERE id = ?',
    args: [id],
  })
  if (result.rows.length === 0) return null
  const row = result.rows[0]
  return {
    id: row.id as string,
    customerName: row.customerName as string,
    customerPhone: row.customerPhone as string,
    customerAddress: row.customerAddress as string,
    items: JSON.parse(row.items as string),
    totalAmount: row.totalAmount as number,
    status: row.status as string,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }
}

export async function createOrder(data: {
  customerName: string
  customerPhone: string
  customerAddress: string
  items: unknown[]
  totalAmount: number
}) {
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  await db.execute({
    sql: 'INSERT INTO "Order" (id, customerName, customerPhone, customerAddress, items, totalAmount, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    args: [id, data.customerName, data.customerPhone, data.customerAddress, JSON.stringify(data.items), data.totalAmount, 'pending', now, now],
  })
  return getOrderById(id)
}

export async function updateOrderStatus(id: string, status: string) {
  const now = new Date().toISOString()
  await db.execute({
    sql: 'UPDATE "Order" SET status = ?, updatedAt = ? WHERE id = ?',
    args: [status, now, id],
  })
  return getOrderById(id)
}

export async function countOrders() {
  const result = await db.execute('SELECT COUNT(*) as count FROM "Order"')
  return result.rows[0].count as number
}

export async function sumOrderRevenue() {
  const result = await db.execute('SELECT COALESCE(SUM(totalAmount), 0) as total FROM "Order"')
  return result.rows[0].total as number
}

export async function getRecentOrders(limit: number) {
  const result = await db.execute({
    sql: 'SELECT * FROM "Order" ORDER BY createdAt DESC LIMIT ?',
    args: [limit],
  })
  return result.rows.map(row => ({
    id: row.id as string,
    customerName: row.customerName as string,
    customerPhone: row.customerPhone as string,
    customerAddress: row.customerAddress as string,
    items: JSON.parse(row.items as string),
    totalAmount: row.totalAmount as number,
    status: row.status as string,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }))
}

export async function getOrderStatusBreakdown() {
  const result = await db.execute('SELECT status, COUNT(*) as count FROM "Order" GROUP BY status')
  return result.rows.map(row => ({
    status: row.status as string,
    count: row.count as number,
  }))
}

export async function getAdminByEmail(email: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM Admin WHERE email = ?',
    args: [email],
  })
  if (result.rows.length === 0) return null
  const row = result.rows[0]
  return {
    id: row.id as string,
    email: row.email as string,
    password: row.password as string,
    name: row.name as string,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }
}
