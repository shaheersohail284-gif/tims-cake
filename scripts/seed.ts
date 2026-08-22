import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const db = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const cakes = [
  // 1 - Independence Day themed (reel)
  {
    name: 'Azadi Celebration Cake',
    description: 'Patriotic flag cake featuring Pakistan\'s green and white frosting with crescent moon and star detailing, perfect for Independence Day celebrations.',
    price: 3500,
    image: '/cakes/cake_01.jpg',
    category: 'seasonal',
    isFeatured: true,
  },
  // 2 - Bride to Be (post)
  {
    name: 'Bridal Bliss Bouquet',
    description: 'Elegant purple buttercream cake adorned with a "Bride to Be" topper, silhouette figurine, and delicate lit candles for the perfect bridal shower.',
    price: 5500,
    image: '/cakes/cake_02.jpg',
    category: 'premium',
    isFeatured: true,
  },
  // 3 - Father's Day (post)
  {
    name: 'Best Dad Ever Cake',
    description: 'Sophisticated blue fondant cake with "BEST DAD EVER" lettering and elegant white pearl dot accents, a heartfelt Father\'s Day tribute.',
    price: 3800,
    image: '/cakes/cake_03.jpg',
    category: 'seasonal',
    isFeatured: false,
  },
  // 4 - Chocolate rosettes (post)
  {
    name: 'Chocolate Rosette Dream',
    description: 'Rich chocolate fudge cake beautifully finished with hand-piped chocolate frosting rosettes, a timeless classic for any celebration.',
    price: 3200,
    image: '/cakes/cake_04.jpg',
    category: 'classic',
    isFeatured: false,
  },
  // 5 - Marble with gold (post)
  {
    name: 'Golden Marble Swirl',
    description: 'Luxurious chocolate marble cake with white frosting swirls and edible gold dragees, blending elegance with indulgence.',
    price: 4200,
    image: '/cakes/cake_05.jpg',
    category: 'premium',
    isFeatured: true,
  },
  // 6 - Eid themed (post)
  {
    name: 'Eid Moonlight Garden',
    description: 'Stunning floral buttercream cake with a golden crescent moon, Arabic calligraphy, and handcrafted sugar flowers for a blessed Eid celebration.',
    price: 5000,
    image: '/cakes/cake_06.jpg',
    category: 'seasonal',
    isFeatured: true,
  },
  // 7 - Husband game cake (post)
  {
    name: 'Husband Material Cake',
    description: 'Playful white buttercream cake with gold leaf, a tic-tac-toe game board, blue hearts, and pearl sprinkles — a fun anniversary or birthday surprise.',
    price: 3800,
    image: '/cakes/cake_07.jpg',
    category: 'signature',
    isFeatured: false,
  },
  // 8 - Mother's Day (reel)
  {
    name: 'Mama\'s Garden Party',
    description: 'Cheerful yellow buttercream cake decorated with white daisy flowers and a sweet "MOM" text, the perfect Mother\'s Day centerpiece.',
    price: 3500,
    image: '/cakes/cake_08.jpg',
    category: 'seasonal',
    isFeatured: false,
  },
  // 9 - Anniversary (reel)
  {
    name: 'Golden Anniversary Rose',
    description: 'Breathtaking two-tier white fondant cake with gold leaf accents, red roses, baby\'s breath, and a "Happy Anniversary" topper.',
    price: 7500,
    image: '/cakes/cake_09.jpg',
    category: 'premium',
    isFeatured: true,
  },
  // 10 - Eid floral (reel)
  {
    name: 'Eid Blossom Elegance',
    description: 'Refined floral buttercream cake featuring purple flowers with golden crescent moon and Arabic calligraphy, celebrating Eid in style.',
    price: 4800,
    image: '/cakes/cake_10.jpg',
    category: 'seasonal',
    isFeatured: false,
  },
  // 11 - Chocolate candy birthday (reel)
  {
    name: 'Candy Bar Chocolate Tower',
    description: 'Decadent chocolate fudge cake loaded with candy bars, truffles, and a gleaming gold "Happy Birthday" topper for the ultimate chocoholic.',
    price: 4500,
    image: '/cakes/cake_11.jpg',
    category: 'signature',
    isFeatured: false,
  },
  // 12 - Welcome to family (reel)
  {
    name: 'Welcome to the Family',
    description: 'Heartwarming vanilla buttercream cake with "WELCOME TO THE FAMILY" in red frosting, red rosettes, and white piped borders for new beginnings.',
    price: 4000,
    image: '/cakes/cake_12.jpg',
    category: 'signature',
    isFeatured: false,
  },
  // 13 - Brand/logo cake (reel)
  {
    name: 'Tim\'s Signature Round',
    description: 'Classic round cake featuring the Tim\'s Cake logo — a signature centerpiece that represents our brand\'s homemade quality and love.',
    price: 3000,
    image: '/cakes/cake_13.jpg',
    category: 'classic',
    isFeatured: false,
  },
  // 14 - White pearl birthday (reel)
  {
    name: 'Pearl & Gold Birthday Cake',
    description: 'Sophisticated white buttercream cake with pearl accents, a gold candle, and delicate piped frosting details for an elegant birthday.',
    price: 3800,
    image: '/cakes/cake_14.jpg',
    category: 'classic',
    isFeatured: false,
  },
  // 15 - Gift box cake (reel)
  {
    name: 'Golden Gift Box Cake',
    description: 'Whimsical gift box cake with gold fondant wrapping and a cream satin ribbon, the perfect present disguised as a cake.',
    price: 4500,
    image: '/cakes/cake_15.jpg',
    category: 'signature',
    isFeatured: true,
  },
  // 16 - Bridal orange (reel)
  {
    name: 'Sunset Bridal Cake',
    description: 'Gorgeous floral buttercream cake with orange rosettes, peach sugar flowers, pearls, and "Bride to Be" gold lettering for a dreamy bridal shower.',
    price: 5500,
    image: '/cakes/cake_16.jpg',
    category: 'premium',
    isFeatured: true,
  },
  // 17 - Alveena birthday (post)
  {
    name: 'Hearts & Birthday Wishes',
    description: 'Charming white frosted cake with red icing hearts and personalized "Happy Birthday Alveena" text, made with love for a special day.',
    price: 3200,
    image: '/cakes/cake_17.jpg',
    category: 'classic',
    isFeatured: false,
  },
  // 18 - Wedding Umrah Mubarak (post)
  {
    name: 'Umrah Mubarak Blessing Cake',
    description: 'Rich chocolate fudge cake with red circular candies and a white cloud-shaped plaque reading "Umrah Mubarak" — a blessed wedding tribute.',
    price: 5000,
    image: '/cakes/cake_18.jpg',
    category: 'premium',
    isFeatured: true,
  },
  // 19 - Miss you cake (reel)
  {
    name: 'Missing You Fondant Cake',
    description: 'Tender white buttercream cake with "Miss You" lettering and elegant Persian script, a heartfelt way to express love across distances.',
    price: 3500,
    image: '/cakes/cake_19.jpg',
    category: 'signature',
    isFeatured: false,
  },
  // 20 - Eid Mubarak roses (reel)
  {
    name: 'Eid Roses & Gold Cake',
    description: 'Exquisite floral white fondant cake with pink roses, greenery, gold beading, and an "Eid Mubarak" plaque for a festive celebration.',
    price: 5500,
    image: '/cakes/cake_20.jpg',
    category: 'seasonal',
    isFeatured: true,
  },
  // 21 - Mayoon cake (reel)
  {
    name: 'Mayoon Celebration Cake',
    description: 'Vibrant green fondant cake decorated with sugar roses, traditional bangles, and "Mubarak Ho Mayoon" text — a stunning pre-wedding centerpiece.',
    price: 6000,
    image: '/cakes/cake_21.jpg',
    category: 'premium',
    isFeatured: false,
  },
  // 22 - Birthday with baby's breath (reel)
  {
    name: 'Baby\'s Breath Birthday Cake',
    description: 'Elegant white frosted cake with a gold "Happy Birthday" topper, delicate baby\'s breath flowers, and pearl accents for a refined celebration.',
    price: 4000,
    image: '/cakes/cake_22.jpg',
    category: 'classic',
    isFeatured: false,
  },
  // 23 - Brownie (reel)
  {
    name: 'Chocolate Brownie Fudge Cake',
    description: 'Intensely rich chocolate brownie cake with a beautiful drizzled chocolate pattern on top — pure indulgence for chocolate lovers.',
    price: 2800,
    image: '/cakes/cake_23.jpg',
    category: 'classic',
    isFeatured: false,
  },
  // 24 - Semi-naked with gold (reel)
  {
    name: 'Gilded Semi-Naked Cake',
    description: 'Trendy semi-naked vanilla buttercream cake with white rosettes, baby\'s breath, gold leaf flakes, and gold dragees — effortlessly elegant.',
    price: 4500,
    image: '/cakes/cake_24.jpg',
    category: 'signature',
    isFeatured: true,
  },
  // 25 - Graduation cake (post)
  {
    name: 'Congrats Graduation Cake',
    description: 'Festive white frosted graduation cake complete with a graduation cap topper, "Congrats" text, pearls, and gold leaf flakes.',
    price: 4000,
    image: '/cakes/cake_25.jpg',
    category: 'seasonal',
    isFeatured: false,
  },
  // 26 - Wedding white (post)
  {
    name: 'Wedding Ivory & Gold Cake',
    description: 'Refined white fondant wedding cake with pearl accents, dried baby\'s breath, gold wire details, and elegant fabric-like draping.',
    price: 8000,
    image: '/cakes/cake_26.jpg',
    category: 'premium',
    isFeatured: true,
  },
  // 27 - Pink birthday (post)
  {
    name: 'Pink Blush Birthday Cake',
    description: 'Sweet pink buttercream cake with white frosting dots and a delicate piped border, a cheerful choice for birthday celebrations.',
    price: 3000,
    image: '/cakes/cake_27.jpg',
    category: 'classic',
    isFeatured: false,
  },
  // 28 - Eid with sheep (post)
  {
    name: 'Eid Mubarak Pastoral Cake',
    description: 'Adorable white frosted cake featuring a cute sheep topper, pink and teal rosettes, and "Eid Mubarak" text — a charming Eid treat.',
    price: 4200,
    image: '/cakes/cake_28.jpg',
    category: 'seasonal',
    isFeatured: false,
  },
  // 29 - Candyland 1st birthday (post)
  {
    name: 'Candyland First Birthday',
    description: 'Whimsical candyland-themed cake with marshmallow pops, a number 1 candle, lollipops, and colorful candy decorations for a first birthday bash.',
    price: 5000,
    image: '/cakes/cake_29.jpg',
    category: 'signature',
    isFeatured: true,
  },
  // 30 - Drip cake (post)
  {
    name: 'Pink Drip Wonder Cake',
    description: 'Show-stopping drip cake with pink icing drizzle, marshmallow towers, swirled frosting, candles, and chocolate truffles — a birthday masterpiece.',
    price: 4800,
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
