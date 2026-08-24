import { createClient, type Client } from '@libsql/client'

const db: Client = createClient({
  url: 'libsql://tims-cake-db-shaheersohail284-gif.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoiYmM0NmVkZGYtN2RlMi00ODRkLTlmNjQtM2Q0NzdkZGQ2OGQ2IiwiaWQiOiI3MmRkYWM5ZS01YmY5LTRmNTMtOTBlOC03ZjQyZTkzMTU4MmUiLCJyIjoiYXAtc291dGgtMSJ9.HtMIWLBdJqGyvV4xdR9ZwFSY6Y3p1jwIp1kNGE3KGzUlb6IVDHwA2m6s1ZGxiXD6HHYALHGJk3UeX2B-UMfrACg',
})

export { db, type Client }

export async function getCakes() {
  const result = await db.execute('SELECT * FROM cakes ORDER BY createdAt DESC')
  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    prices: JSON.parse(row.prices as string),
    image: row.image as string,
    category: row.category as string,
    isFeatured: (row.isFeatured as number) === 1,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }))
}

export async function getCakeById(id: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM cakes WHERE id = ?',
    args: [id],
  })
  if (result.rows.length === 0) return null
  const row = result.rows[0]
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    prices: JSON.parse(row.prices as string),
    image: row.image as string,
    category: row.category as string,
    isFeatured: (row.isFeatured as number) === 1,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }
}

export async function getOrders() {
  const result = await db.execute('SELECT * FROM orders ORDER BY createdAt DESC')
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
    sql: 'SELECT * FROM orders WHERE id = ?',
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
    sql: 'INSERT INTO orders (id, customerName, customerPhone, customerAddress, items, totalAmount, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    args: [id, data.customerName, data.customerPhone, data.customerAddress, JSON.stringify(data.items), data.totalAmount, 'pending', now, now],
  })
  return getOrderById(id)
}

export async function updateOrderStatus(id: string, status: string) {
  const now = new Date().toISOString()
  await db.execute({
    sql: 'UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?',
    args: [status, now, id],
  })
  return getOrderById(id)
}

export async function countOrders() {
  const result = await db.execute('SELECT COUNT(*) as count FROM orders')
  return result.rows[0].count as number
}

export async function sumOrderRevenue() {
  const result = await db.execute('SELECT COALESCE(SUM(totalAmount), 0) as total FROM orders')
  return result.rows[0].total as number
}

export async function getRecentOrders(limit: number) {
  const result = await db.execute({
    sql: 'SELECT * FROM orders ORDER BY createdAt DESC LIMIT ?',
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
  const result = await db.execute('SELECT status, COUNT(*) as count FROM orders GROUP BY status')
  return result.rows.map(row => ({
    status: row.status as string,
    count: row.count as number,
  }))
}

export async function getAdminByEmail(email: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM admins WHERE email = ?',
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
