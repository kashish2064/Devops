import 'dotenv/config';
import { connectDB } from './config/db.js';
import Template from './models/Template.js';

// Same 15 designs as src/lib/studio/templates.ts on the frontend
const templates = [
  { id: 'timeless', name: 'Timeless Romance', category: 'Minimal', style: 'border' },
  { id: 'garden', name: 'Garden of Love', category: 'Floral', style: 'floral' },
  { id: 'golden', name: 'Golden Hour', category: 'Luxury', style: 'photo' },
  { id: 'sage', name: 'Sage & Serenity', category: 'Modern', style: 'sage' },
  { id: 'royal', name: 'Royal Vows', category: 'Traditional', style: 'wine' },
  { id: 'blush', name: 'Blush Reverie', category: 'Floral', style: 'blush' },
  { id: 'arch', name: 'The Ivory Arch', category: 'Minimal', style: 'arch' },
  { id: 'modern', name: 'Simply Together', category: 'Modern', style: 'modern' },
  { id: 'nepali', name: 'शुभ विवाह', category: 'Nepali', style: 'nepali' },
  { id: 'linen', name: 'Written in Linen', category: 'Minimal', style: 'linen' },
  { id: 'botanical', name: 'Wildflower Poetry', category: 'Floral', style: 'botanical' },
  { id: 'midnight', name: 'Midnight in Paris', category: 'Luxury', style: 'night' },
  { id: 'portrait', name: 'A Moment Forever', category: 'Modern', style: 'split' },
  { id: 'heritage', name: 'Heritage & Hearts', category: 'South Asian', style: 'wine' },
  { id: 'eternal', name: 'An Eternal Promise', category: 'Traditional', style: 'border' },
];

async function seed() {
  await connectDB();
  console.log('Seeding templates...');
  for (const t of templates) {
    await Template.findOneAndUpdate(
      { id: t.id },
      { ...t, active: true },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
  const count = await Template.countDocuments();
  console.log(`Done. ${count} templates in database.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
