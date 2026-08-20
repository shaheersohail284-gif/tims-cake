import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const db = new PrismaClient();

async function updateAdmin() {
  const newEmail = 'shaheersohail284@gmail.com';
  const newPassword = 'TimCake@2026';
  const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

  // Delete old admin
  await db.admin.deleteMany();

  // Create new admin
  const admin = await db.admin.create({
    data: {
      email: newEmail,
      password: hashedPassword,
      name: 'Tim',
    },
  });

  console.log('Admin updated successfully!');
  console.log('Email:', admin.email);
  console.log('Password:', newPassword);
}

updateAdmin()
  .catch(console.error)
  .finally(() => db.$disconnect());
