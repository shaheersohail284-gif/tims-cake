import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://tims-cake-db-shaheersohail284-gif.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoiYmM0NmVkZGYtN2RlMi00ODRkLTlmNjQtM2Q0NzdkZGQ2OGQ2IiwiaWQiOiI3MmRkYWM5ZS01YmY5LTRmNTMtOTBlOC03ZjQyZTkzMTU4MmUiLCJyIjoiYXAtc291dGgtMSJ9.HtMIWLBdJqGyvV4xdR9ZwFSY6Y3p1jwIp1kNGE3KGzUlb6IVDHwA2m6s1ZGxiXD6HHYALHGJk3UeX2B-UMfrACg',
});

const ids = [3,4,5,6,8,9,13,16,17,18,20,21,23,25,26,27,28];

async function main() {
  const result = await client.execute({
    sql: `SELECT id, name, image FROM cakes WHERE id IN (${ids.join(',')}) ORDER BY id`,
  });
  for (const row of result.rows) {
    const imgUrl = row.image as string;
    const hasVideo = imgUrl?.includes('video') || imgUrl?.includes('.mp4') || imgUrl?.includes('anim');
    console.log(`ID ${row.id}: ${row.name}`);
    console.log(`  URL: ${imgUrl}`);
    console.log(`  Contains video reference: ${hasVideo}`);
    console.log('');
  }
}

main().catch(console.error);