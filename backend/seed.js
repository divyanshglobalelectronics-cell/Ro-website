require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-app';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Categories
    const categories = await Category.insertMany([
      { name: 'Domestic RO', slug: 'domestic-ro', description: 'Home RO purifiers' },
      { name: 'Commercial RO', slug: 'commercial-ro', description: 'Commercial RO systems' },
      { name: 'Accessories', slug: 'accessories', description: 'RO spare parts and accessories' },
    ]);

    const mapBySlug = Object.fromEntries(categories.map(c => [c.slug, c]));

    // Helper to create slugs
    const slugify = (s) =>
      String(s)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const products = [];

    // Domestic RO sample data (10+)
    const domesticTechs = ['RO', 'RO+UV', 'RO+UF', 'UV', 'UF', 'Alkaline RO', 'Copper RO'];
    const domesticCaps = ['8L', '10L', '12L'];
    for (let i = 1; i <= 10; i++) {
      const title = `Domestic Series ${i}`;
      const technology = domesticTechs[i % domesticTechs.length];
      const capacity = domesticCaps[i % domesticCaps.length];
      products.push({
        title,
        slug: slugify(`${mapBySlug['domestic-ro'].slug}-${title}`),
        description: `${title} - Reliable home water purification using ${technology}.`,
        price: 6999 + i * 1000,
        images: [`/images/domestic-${i}.jpg`],
        category: mapBySlug['domestic-ro']._id,
        attributes: { capacity, technology },
        featured: i % 4 === 0,
      });
    }

    // Commercial RO sample data (10+)
    const commercialTechs = ['Industrial RO', 'RO', 'High-Flow RO', 'Reverse Osmosis'];
    const commercialCaps = ['100 LPH', '200 LPH', '500 LPH', '1000 LPH'];
    for (let i = 1; i <= 10; i++) {
      const title = `Commercial Series ${i}`;
      const technology = commercialTechs[i % commercialTechs.length];
      const capacity = commercialCaps[i % commercialCaps.length];
      products.push({
        title,
        slug: slugify(`${mapBySlug['commercial-ro'].slug}-${title}`),
        description: `${title} - Robust commercial-grade purification (${technology}).`,
        price: 39999 + i * 2000,
        images: [`/images/commercial-${i}.jpg`],
        category: mapBySlug['commercial-ro']._id,
        attributes: { capacity, technology },
        featured: i % 5 === 0,
      });
    }

    // Accessories sample data (10+)
    const accessoryNames = [
      'Sediment Filter',
      'RO Membrane',
      'UF Membrane',
      'Alkaline Cartridge',
      'Copper Cartridge',
      'Faucet/Tap',
      'TDS Controller',
      'Pressure Gauge',
      'Booster Pump',
      'Storage Tank',
    ];
    for (let i = 0; i < accessoryNames.length; i++) {
      const title = accessoryNames[i];
      products.push({
        title,
        slug: slugify(`${mapBySlug['accessories'].slug}-${title}-${i}`),
        description: `${title} - Quality accessory compatible with leading purifier models.`,
        price: 199 + i * 150,
        images: [`/images/accessory-${i + 1}.jpg`],
        category: mapBySlug['accessories']._id,
        attributes: {},
        featured: false,
      });
    }

    // Insert generated products
    await Product.insertMany(products);

    console.log(`Seed completed: inserted ${products.length} products across ${categories.length} categories`);
  } catch (err) {
    console.error('Seed failed', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
