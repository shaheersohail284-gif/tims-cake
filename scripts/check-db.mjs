import { createClient } from '@libsql/client';

const c = createClient({
  url: 'libsql://tims-cake-db-shaheersohail284-gif.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODc1NjU5MDksImlkIjoiMDFhMDJmNmEtNzAwMS03ZDhlLTg3NzEtZjBlMjhkZmQ3MjgxIiwia2lkIjoibWx1THVwYS1ZVVRpTWJhWGlDV1Y4Tl9OYzZ2NzVhV1JaY28taFdfM3phYyIsInJpZCI6ImJhYjE3M2M3LWI0MzctNDUzMy05NmZhLWZmNzIxMjlkODNmNyJ9.OVYuH4oDqm6d91cDn9nkZVXlFhfVxtY9hekKGwwNiMia-vthWs-dAVssoK4-lSBYAIAELRQtSEqtNCtsI-xAAA',
});

async function main() {
  const cakes = await c.execute('SELECT id, name FROM Cake LIMIT 3');
  console.log('Cake query works! Found', cakes.rows.length, 'cakes');
  cakes.rows.forEach(r => console.log(' -', r.name));

  const orders = await c.execute('SELECT COUNT(*) as cnt FROM "Order"');
  console.log('Order query works! Count:', orders.rows[0].cnt);

  const admins = await c.execute('SELECT COUNT(*) as cnt FROM Admin');
  console.log('Admin query works! Count:', admins.rows[0].cnt);
}

main().catch(e => console.log('Error:', e.message));
