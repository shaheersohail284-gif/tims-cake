import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const db = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const cakes = [
  {
    name: 'Classic Chocolate Dream',
    description: 'Rich, velvety chocolate layers with a decadent ganache finish. A timeless favorite.',
    price: 35,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
    category: 'classic',
    isFeatured: true,
  },
  {
    name: 'Garden Strawberry Delight',
    description: 'Light vanilla sponge layered with fresh strawberries and whipped cream frosting.',
    price: 38,
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=400&fit=crop',
    category: 'seasonal',
    isFeatured: false,
  },
  {
    name: 'Madagascar Vanilla Bean',
    description: 'Three layers of fragrant vanilla bean cake with Swiss meringue buttercream.',
    price: 32,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=400&fit=crop',
    category: 'classic',
    isFeatured: false,
  },
  {
    name: 'Red Velvet Elegance',
    description: 'Signature red velvet with cream cheese frosting and white chocolate shavings.',
    price: 42,
    image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600&h=400&fit=crop',
    category: 'signature',
    isFeatured: true,
  },
  {
    name: 'Sunshine Lemon Cake',
    description: 'Bright lemon sponge with lemon curd filling and a tangy glaze. Perfect for spring.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&h=400&fit=crop',
    category: 'seasonal',
    isFeatured: false,
  },
  {
    name: 'Spiced Carrot Cake',
    description: 'Moist carrot cake with walnuts, cinnamon, and luscious cream cheese frosting.',
    price: 36,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12571?w=600&h=400&fit=crop',
    category: 'classic',
    isFeatured: false,
  },
  {
    name: 'Black Forest Gateau',
    description: 'German-inspired chocolate cake with cherries, whipped cream, and chocolate shavings.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=400&fit=crop',
    category: 'premium',
    isFeatured: true,
  },
  {
    name: 'New York Cheesecake',
    description: 'Creamy, dense cheesecake with a buttery graham cracker crust and berry compote.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&h=400&fit=crop',
    category: 'premium',
    isFeatured: false,
  },
  {
    name: 'Wild Blueberry Bliss',
    description: 'Tender almond cake with wild blueberry filling and a delicate lemon glaze.',
    price: 44,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=400&fit=crop',
    category: 'seasonal',
    isFeatured: false,
  },
  {
    name: 'Classic Tiramisu Cake',
    description: 'Coffee-soaked layers with mascarpone cream and a dusting of cocoa powder.',
    price: 48,
    image: 'https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=600&h=400&fit=crop',
    category: 'signature',
    isFeatured: false,
  },
  {
    name: 'Tropical Coconut Cloud',
    description: 'Light coconut sponge with coconut cream filling and toasted coconut flakes.',
    price: 34,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop',
    category: 'classic',
    isFeatured: false,
  },
  {
    name: 'Golden Caramel Drip Cake',
    description: 'Salted caramel layers with toffee bits and a stunning caramel drip finish.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
    category: 'premium',
    isFeatured: true,
  },
];

async function main() {
  console.log('Seeding database...');

  const adminPassword = hashPassword('admin123');
  const admin = await db.admin.upsert({
    where: { email: 'admin@timscake.com' },
    update: {},
    create: {
      email: 'admin@timscake.com',
      password: adminPassword,
      name: 'Tim',
    },
  });
  console.log('Admin created:', admin.email);

  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.cake.deleteMany();

  for (const cake of cakes) {
    await db.cake.create({ data: cake });
  }
  console.log(cakes.length, 'cakes created');

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
