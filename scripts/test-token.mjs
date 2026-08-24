import { createClient } from '@libsql/client';
const c = createClient({
  url: 'libsql://tims-cake-db-shaheersohail284-gif.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODc1NjU5MDksImlkIjoiMDFhMDJmNmEtNzAwMS03ZDhlLTg3NzEtZjBlMjhkZmQ3MjgxIiwia2lkIjoibWx1THVwYS1ZVVRpTWJhWGlDV1Y4Tl9OYzZ2NzVhV1JaY28taFdfM3phYyIsInJpZCI6ImJhYjE3M2M3LWI0MzctNDUzMy05NmZhLWZmNzIxMjlkODNmNyJ9.OVYuH4oDqm6d91cDn9nkZVXlFhfVxtY9hekKGwwNiMia-vthWs-dAVssoK4-lSBYAIAELRQtSEqtNCtsI-xAAA'
});
try {
  // Check Cake table schema
  const schema = await c.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='Cake'");
  console.log('Cake schema:', schema.rows[0].sql);
  console.log('---');
  
  // Check Order table schema
  const orderSchema = await c.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='Order'");
  console.log('Order schema:', orderSchema.rows[0].sql);
  console.log('---');
  
  // Check Admin table schema
  const adminSchema = await c.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='Admin'");
  console.log('Admin schema:', adminSchema.rows[0].sql);
  console.log('---');
  
  // Try querying with correct table name
  const r = await c.execute('SELECT COUNT(*) as cnt FROM Cake');
  console.log('Cake count:', r.rows[0].cnt);
  
  // Also check Prisma schema to understand the intended naming
} catch(e) {
  console.log('ERROR:', e.message);
}