import "dotenv/config";
import { seedDatabase } from '../../src/lib/db/seed';
async function main() {
  console.log('Running database seed script...');
  const result = await seedDatabase();
  console.log('Seed completed:', result);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
