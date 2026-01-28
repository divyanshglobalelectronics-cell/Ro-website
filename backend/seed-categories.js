require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-app';

async function seedCategories() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log(`Categories already exist (${existingCount} found). Skipping seed.`);
      process.exit(0);
    }

    // Categories for RO website
    const categories = await Category.insertMany([
      { 
        name: 'Domestic RO', 
        slug: 'domestic-ro', 
        description: 'Home RO water purifiers for residential use',
        order: 1
      },
      { 
        name: 'Commercial RO', 
        slug: 'commercial-ro', 
        description: 'Commercial RO systems for offices and businesses',
        order: 2
      },
      { 
        name: 'Accessories', 
        slug: 'accessories', 
        description: 'RO spare parts, filters and accessories',
        order: 3
      },
      { 
        name: 'Water Softeners', 
        slug: 'water-softeners', 
        description: 'Water softening systems for hard water treatment',
        order: 4
      },
      { 
        name: 'UV Purifiers', 
        slug: 'uv-purifiers', 
        description: 'UV-based water purification systems',
        order: 5
      }
    ]);

    console.log('Categories seeded successfully:');
    categories.forEach(c => console.log(`- ${c.name} (${c.slug})`));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
