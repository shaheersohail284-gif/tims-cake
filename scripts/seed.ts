import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const db = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

type PriceEntry = { weight: string; price: number };

// Pricing tiers: classic, premium, seasonal, signature
const CLASSIC_PRICES: PriceEntry[] = [
  { weight: '1 lb', price: 1200 },
  { weight: '2 lb', price: 2200 },
  { weight: '3 lb', price: 3200 },
  { weight: '5 lb', price: 5000 },
];

const PREMIUM_PRICES: PriceEntry[] = [
  { weight: '1 lb', price: 1800 },
  { weight: '2 lb', price: 3200 },
  { weight: '3 lb', price: 4500 },
  { weight: '5 lb', price: 7000 },
];

const SEASONAL_PRICES: PriceEntry[] = [
  { weight: '1 lb', price: 1400 },
  { weight: '2 lb', price: 2500 },
  { weight: '3 lb', price: 3500 },
  { weight: '5 lb', price: 5500 },
];

const SIGNATURE_PRICES: PriceEntry[] = [
  { weight: '1 lb', price: 1600 },
  { weight: '2 lb', price: 2800 },
  { weight: '3 lb', price: 4000 },
  { weight: '5 lb', price: 6200 },
];

function pricesForCategory(category: string): string {
  const map: Record<string, PriceEntry[]> = {
    classic: CLASSIC_PRICES,
    premium: PREMIUM_PRICES,
    seasonal: SEASONAL_PRICES,
    signature: SIGNATURE_PRICES,
  };
  return JSON.stringify(map[category] || CLASSIC_PRICES);
}

const cakes = [
  {
    name: 'Azadi Celebration Cake',
    description: 'Patriotic flag cake featuring Pakistan\'s green and white frosting with crescent moon and star detailing, perfect for Independence Day celebrations.',
    prices: pricesForCategory('seasonal'),
    image: '/cakes/cake_01.jpg',
    category: 'seasonal',
    isFeatured: true,
  },
  {
    name: 'Bridal Bliss Bouquet',
    description: 'Elegant purple buttercream cake adorned with a "Bride to Be" topper, silhouette figurine, and delicate lit candles for the perfect bridal shower.',
    prices: pricesForCategory('premium'),
    image: '/cakes/cake_02.jpg',
    category: 'premium',
    isFeatured: true,
  },
  {
    name: 'Best Dad Ever Cake',
    description: 'Sophisticated blue fondant cake with "BEST DAD EVER" lettering and elegant white pearl dot accents, a heartfelt Father\'s Day tribute.',
    prices: pricesForCategory('seasonal'),
    image: '/cakes/cake_03.jpg',
    category: 'seasonal',
    isFeatured: false,
  },
  {
    name: 'Chocolate Rosette Dream',
    description: 'Rich chocolate fudge cake beautifully finished with hand-piped chocolate frosting rosettes, a timeless classic for any celebration.',
    prices: pricesForCategory('classic'),
    image: '/cakes/cake_04.jpg',
    category: 'classic',
    isFeatured: false,
  },
  {
    name: 'Golden Marble Swirl',
    description: 'Luxurious chocolate marble cake with white frosting swirls and edible gold dragees, blending elegance with indulgence.',
    prices: pricesForCategory('premium'),
    image: '/cakes/cake_05.jpg',
    category: 'premium',
    isFeatured: true,
  },
  {
    name: 'Eid Moonlight Garden',
    description: 'Stunning floral buttercream cake with a golden crescent moon, Arabic calligraphy, and handcrafted sugar flowers for a blessed Eid celebration.',
    prices: pricesForCategory('seasonal'),
    image: '/cakes/cake_06.jpg',
    category: 'seasonal',
    isFeatured: true,
  },
  {
    name: 'Husband Material Cake',
    description: 'Playful white buttercream cake with gold leaf, a tic-tac-toe game board, blue hearts, and pearl sprinkles — a fun anniversary or birthday surprise.',
    prices: pricesForCategory('signature'),
    image: '/cakes/cake_07.jpg',
    category: 'signature',
    isFeatured: false,
  },
  {
    name: 'Mama\'s Garden Party',
    description: 'Cheerful yellow buttercream cake decorated with white daisy flowers and a sweet "MOM" text, the perfect Mother\'s Day centerpiece.',
    prices: pricesForCategory('seasonal'),
    image: '/cakes/cake_08.jpg',
    category: 'seasonal',
    isFeatured: false,
  },
  {
    name: 'Golden Anniversary Rose',
    description: 'Breathtaking two-tier white fondant cake with gold leaf accents, red roses, baby\'s breath, and a "Happy Anniversary" topper.',
    prices: pricesForCategory('premium'),
    image: '/cakes/cake_09.jpg',
    category: 'premium',
    isFeatured: true,
  },
  {
    name: 'Eid Blossom Elegance',
    description: 'Refined floral buttercream cake featuring purple flowers with golden crescent moon and Arabic calligraphy, celebrating Eid in style.',
    prices: pricesForCategory('seasonal'),
    image: '/cakes/cake_10.jpg',
    category: 'seasonal',
    isFeatured: false,
  },
  {
    name: 'Candy Bar Chocolate Tower',
    description: 'Decadent chocolate fudge cake loaded with candy bars, truffles, and a gleaming gold "Happy Birthday" topper for the ultimate chocoholic.',
    prices: pricesForCategory('signature'),
    image: '/cakes/cake_11.jpg',
    category: 'signature',
    isFeatured: false,
  },
  {
    name: 'Welcome to the Family',
    description: 'Heartwarming vanilla buttercream cake with "WELCOME TO THE FAMILY" in red frosting, red rosettes, and white piped borders for new beginnings.',
    prices: pricesForCategory('signature'),
    image: '/cakes/cake_12.jpg',
    category: 'signature',
    isFeatured: false,
  },
  {
    name: 'Tim\'s Signature Round',
    description: 'Classic round cake featuring the Tim\'s Cake logo — a signature centerpiece that represents our brand\'s homemade quality and love.',
    prices: pricesForCategory('classic'),
    image: '/cakes/cake_13.jpg',
    category: 'classic',
    isFeatured: false,
  },
  {
    name: 'Pearl & Gold Birthday Cake',
    description: 'Sophisticated white buttercream cake with pearl accents, a gold candle, and delicate piped frosting details for an elegant birthday.',
    prices: pricesForCategory('classic'),
    image: '/cakes/cake_14.jpg',
    category: 'classic',
    isFeatured: false,
  },
  {
    name: 'Golden Gift Box Cake',
    description: 'Whimsical gift box cake with gold fondant wrapping and a cream satin ribbon, the perfect present disguised as a cake.',
    prices: pricesForCategory('signature'),
    image: '/cakes/cake_15.jpg',
    category: 'signature',
    isFeatured: true,
  },
  {
    name: 'Sunset Bridal Cake',
    description: 'Gorgeous floral buttercream cake with orange rosettes, peach sugar flowers, pearls, and "Bride to Be" gold lettering for a dreamy bridal shower.',
    prices: pricesForCategory('premium'),
    image: '/cakes/cake_16.jpg',
    category: 'premium',
    isFeatured: true,
  },
  {
    name: 'Hearts & Birthday Wishes',
    description: 'Charming white frosted cake with red icing hearts and personalized "Happy Birthday Alveena" text, made with love for a special day.',
    prices: pricesForCategory('classic'),
    image: '/cakes/cake_17.jpg',
    category: 'classic',
    isFeatured: false,
  },
  {
    name: 'Umrah Mubarak Blessing Cake',
    description: 'Rich chocolate fudge cake with red circular candies and a white cloud-shaped plaque reading "Umrah Mubarak" — a blessed wedding tribute.',
    prices: pricesForCategory('premium'),
    image: '/cakes/cake_18.jpg',
    category: 'premium',
    isFeatured: true,
  },
  {
    name: 'Missing You Fondant Cake',
    description: 'Tender white buttercream cake with "Miss You" lettering and elegant Persian script, a heartfelt way to express love across distances.',
    prices: pricesForCategory('signature'),
    image: '/cakes/cake_19.jpg',
    category: 'signature',
    isFeatured: false,
  },
  {
    name: 'Eid Roses & Gold Cake',
    description: 'Exquisite floral white fondant cake with pink roses, greenery, gold beading, and an "Eid Mubarak" plaque for a festive celebration.',
    prices: pricesForCategory('seasonal'),
    image: '/cakes/cake_20.jpg',
    category: 'seasonal',
    isFeatured: true,
  },
  {
    name: 'Mayoon Celebration Cake',
    description: 'Vibrant green fondant cake decorated with sugar roses, traditional bangles, and "Mubarak Ho Mayoon" text — a stunning pre-wedding centerpiece.',
    prices: pricesForCategory('premium'),
    image: '/cakes/cake_21.jpg',
    category: 'premium',
    isFeatured: false,
  },
  {
    name: 'Baby\'s Breath Birthday Cake',
    description: 'Elegant white frosted cake with a gold "Happy Birthday" topper, delicate baby\'s breath flowers, and pearl accents for a refined celebration.',
    prices: pricesForCategory('classic'),
    image: '/cakes/cake_22.jpg',
    category: 'classic',
    isFeatured: false,
  },
  {
    name: 'Chocolate Brownie Fudge Cake',
    description: 'Intensely rich chocolate brownie cake with a beautiful drizzled chocolate pattern on top — pure indulgence for chocolate lovers.',
    prices: pricesForCategory('classic'),
    image: '/cakes/cake_23.jpg',
    category: 'classic',
    isFeatured: false,
  },
  {
    name: 'Gilded Semi-Naked Cake',
    description: 'Trendy semi-naked vanilla buttercream cake with white rosettes, baby\'s breath, gold leaf flakes, and gold dragees — effortlessly elegant.',
    prices: pricesForCategory('signature'),
    image: '/cakes/cake_24.jpg',
    category: 'signature',
    isFeatured: true,
  },
  {
    name: 'Congrats Graduation Cake',
    description: 'Festive white frosted graduation cake complete with a graduation cap topper, "Congrats" text, pearls, and gold leaf flakes.',
    prices: pricesForCategory('seasonal'),
    image: '/cakes/cake_25.jpg',
    category: 'seasonal',
    isFeatured: false,
  },
  {
    name: 'Wedding Ivory & Gold Cake',
    description: 'Refined white fondant wedding cake with pearl accents, dried baby\'s breath, gold wire details, and elegant fabric-like draping.',
    prices: pricesForCategory('premium'),
    image: '/cakes/cake_26.jpg',
    category: 'premium',
    isFeatured: true,
  },
  {
    name: 'Pink Blush Birthday Cake',
    description: 'Sweet pink buttercream cake with white frosting dots and a delicate piped border, a cheerful choice for birthday celebrations.',
    prices: pricesForCategory('classic'),
    image: '/cakes/cake_27.jpg',
    category: 'classic',
    isFeatured: false,
  },
  {
    name: 'Eid Mubarak Pastoral Cake',
    description: 'Adorable white frosted cake featuring a cute sheep topper, pink and teal rosettes, and "Eid Mubarak" text — a charming Eid treat.',
    prices: pricesForCategory('seasonal'),
    image: '/cakes/cake_28.jpg',
    category: 'seasonal',
    isFeatured: false,
  },
  {
    name: 'Candyland First Birthday',
    description: 'Whimsical candyland-themed cake with marshmallow pops, a number 1 candle, lollipops, and colorful candy decorations for a first birthday bash.',
    prices: pricesForCategory('signature'),
    image: '/cakes/cake_29.jpg',
    category: 'signature',
    isFeatured: true,
  },
  {
    name: 'Pink Drip Wonder Cake',
    description: 'Show-stopping drip cake with pink icing drizzle, marshmallow towers, swirled frosting, candles, and chocolate truffles — a birthday masterpiece.',
    prices: pricesForCategory('signature'),
    image: '/cakes/cake_30.jpg',
    category: 'signature',
    isFeatured: false,
  },
];

async function main() {
  console.log('Seeding database...');

  const adminPassword = hashPassword('TimCake@2026');
  const admin = await db.admin.upsert({
    where: { email: 'shaheersohail284@gmail.com' },
    update: {},
    create: {
      email: 'shaheersohail284@gmail.com',
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
