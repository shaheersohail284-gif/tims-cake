import { createClient, Client } from '@libsql/client';

const client: Client = createClient({
  url: 'libsql://tims-cake-db-shaheersohail284-gif.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3OTAwOTQxMTksImlhdCI6MTc4NzUwMjExOSwiaWQiOiIwMWEwMmY2YS03MDAxLTdkOGUtODc3MS1mMGUyOGRmZDcyODEiLCJraWQiOiJtbHVMdXBhLVlVVGlNYmFYaUNXVjhOX05jNnY3NWFXUlpjby1oV18zemFjIiwicmlkIjoiYmFiMTczYzctYjQzNy00NTMzLTk2ZmEtZmY3MjEyOWQ4M2Y3In0.OyoTOz8A5L9aLGgz9CkC3Usat9N_hKp1iopfgRCpRDTm5SL83kmA7wMZ3dXfZMhCyJnuQdrVejX1gfRF41IPAw',
});

// ===================== CAKE QUERIES =====================

export async function getCakes() {
  const result = await client.execute({
    sql: `SELECT id, name, description, prices, image, category, "isAvailable" as isAvailable, "isFeatured" as isFeatured, "createdAt" as createdAt, "updatedAt" as updatedAt FROM Cake WHERE "isAvailable" = 1 ORDER BY "isFeatured" DESC, "createdAt" DESC`,
  });
  return result.rows.map(rowToCake);
}

export async function getCakeById(id: string) {
  const result = await client.execute({
    sql: `SELECT * FROM Cake WHERE id = ?`,
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return rowToCake(result.rows[0]);
}

// ===================== ORDER QUERIES =====================

export async function getOrders() {
  const orders = await client.execute({
    sql: `SELECT * FROM "Order" ORDER BY "createdAt" DESC`,
  });
  const result: any[] = [];
  for (const order of orders.rows) {
    const items = await client.execute({
      sql: `SELECT * FROM OrderItem WHERE "orderId" = ?`,
      args: [order.id as string],
    });
    result.push({ ...rowToOrder(order), items: items.rows.map(rowToOrderItem) });
  }
  return result;
}

export async function getOrderById(id: string) {
  const result = await client.execute({
    sql: `SELECT * FROM "Order" WHERE id = ?`,
    args: [id],
  });
  if (result.rows.length === 0) return null;
  const items = await client.execute({
    sql: `SELECT * FROM OrderItem WHERE "orderId" = ?`,
    args: [id],
  });
  return { ...rowToOrder(result.rows[0]), items: items.rows.map(rowToOrderItem) };
}

export async function createOrder(data: {
  customerName: string; customerEmail: string; customerPhone: string;
  deliveryAddress: string; deliveryDate: string; deliveryTime: string;
  notes: string | null; totalAmount: number;
  items: { cakeId: string; cakeName: string; weight: string; quantity: number; price: number }[];
}) {
  const id = generateId();
  await client.execute({
    sql: `INSERT INTO "Order" (id, "customerName", "customerEmail", "customerPhone", "deliveryAddress", "deliveryDate", "deliveryTime", notes, "totalAmount", status, "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))`,
    args: [id, data.customerName, data.customerEmail, data.customerPhone, data.deliveryAddress, data.deliveryDate, data.deliveryTime, data.notes, data.totalAmount],
  });
  for (const item of data.items) {
    const itemId = generateId();
    await client.execute({
      sql: `INSERT INTO OrderItem (id, "orderId", "cakeId", "cakeName", weight, quantity, price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [itemId, id, item.cakeId, item.cakeName, item.weight, item.quantity, item.price],
    });
  }
  return getOrderById(id);
}

export async function updateOrderStatus(id: string, status: string) {
  await client.execute({
    sql: `UPDATE "Order" SET status = ?, "updatedAt" = datetime('now') WHERE id = ?`,
    args: [status, id],
  });
  return getOrderById(id);
}

export async function countOrders(whereStatus?: string) {
  if (whereStatus) {
    const r = await client.execute({
      sql: `SELECT COUNT(*) as c FROM "Order" WHERE status = ?`,
      args: [whereStatus],
    });
    return Number(r.rows[0].c);
  }
  const r = await client.execute(`SELECT COUNT(*) as c FROM "Order"`);
  return Number(r.rows[0].c);
}

export async function sumOrderRevenue() {
  const r = await client.execute({
    sql: `SELECT COALESCE(SUM("totalAmount"), 0) as total FROM "Order" WHERE status != 'cancelled'`,
  });
  return Number(r.rows[0].total);
}

export async function getRecentOrders(limit: number) {
  const orders = await client.execute({
    sql: `SELECT * FROM "Order" ORDER BY "createdAt" DESC LIMIT ?`,
    args: [limit],
  });
  const result: any[] = [];
  for (const order of orders.rows) {
    const items = await client.execute({
      sql: `SELECT * FROM OrderItem WHERE "orderId" = ?`,
      args: [order.id as string],
    });
    result.push({ ...rowToOrder(order), items: items.rows.map(rowToOrderItem) });
  }
  return result;
}

export async function getOrderStatusBreakdown() {
  const r = await client.execute({
    sql: `SELECT status, COUNT(*) as count FROM "Order" GROUP BY status`,
  });
  return r.rows.map(row => ({ status: row.status as string, _count: Number(row.count) }));
}

// ===================== ADMIN QUERIES =====================

export async function getAdminByEmail(email: string) {
  const result = await client.execute({
    sql: `SELECT * FROM Admin WHERE email = ?`,
    args: [email],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id as string,
    email: row.email as string,
    password: row.password as string,
    name: row.name as string,
  };
}

// ===================== HELPERS =====================

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 25; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function rowToCake(row: any) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    prices: row.prices,
    image: row.image,
    category: row.category,
    isAvailable: Boolean(row.isAvailable),
    isFeatured: Boolean(row.isFeatured),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function rowToOrder(row: any) {
  return {
    id: row.id,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    customerPhone: row.customerPhone,
    deliveryAddress: row.deliveryAddress,
    deliveryDate: row.deliveryDate,
    deliveryTime: row.deliveryTime,
    notes: row.notes,
    totalAmount: Number(row.totalAmount),
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function rowToOrderItem(row: any) {
  return {
    id: row.id,
    orderId: row.orderId,
    cakeId: row.cakeId,
    cakeName: row.cakeName,
    weight: row.weight,
    quantity: Number(row.quantity),
    price: Number(row.price),
  };
}
