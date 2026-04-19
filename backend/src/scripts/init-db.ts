import { storeService } from '../services/store.service';

async function main() {
  await storeService.init();
  console.log('Database initialization complete.');
  process.exit(0);
}

main().catch((error) => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});
