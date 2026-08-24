import { createClient } from '@libsql/client';

const c = createClient({
  url: 'libsql://tims-cake-db-shaheersohail284-gif.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODc1NjU5MDksImlkIjoiMDFhMDJmNmEtNzAwMS03ZDhlLTg3NzEtZjBlMjhkZmQ3MjgxIiwia2lkIjoibWx1THVwYS1ZVVRpTWJhWGlDV1Y4Tl9OYzZ2NzVhV1JaY28taFdfM3phYyIsInJpZCI6ImJhYjE3M2M3LWI0MzctNDUzMy05NmZhLWZmNzIxMjlkODNmNyJ9.OVYuH4oDqm6d91cDn9nkZVXlFhfVxtY9hekKGwwNiMia-vthWs-dAVssoK4-lSBYAIAELRQtSEqtNCtsI-xAAA'
});

// Find the Hearts & Birthday Wishes cake
const r = await c.execute({sql: "SELECT id, name FROM Cake WHERE name LIKE '%Hearts%'", args: []});
console.log('Found:', r.rows);

if (r.rows.length > 0) {
  const id = r.rows[0].id;
  await c.execute({
    sql: 'UPDATE Cake SET image = ?, images = ? WHERE id = ?',
    args: ['/cakes/hearts-bday-1.jpg', JSON.stringify(['/cakes/hearts-bday-2.jpg', '/cakes/hearts-bday-3.jpg']), id]
  });
  console.log('Updated cake:', id);
} else {
  console.log('Cake not found!');
}
