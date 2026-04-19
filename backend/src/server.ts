import app from './app';
import { config } from './config';
import { jobQueueService } from './services/job-queue.service';
import { storeService } from './services/store.service';

async function bootstrap() {
  await storeService.init();
  await jobQueueService.start();

  const server = app.listen(config.port, () => {
    console.log(`Backend server is running on http://localhost:${config.port}`);
    console.log(`OCR Provider Mode: ${config.ocrProviderMode}`);
    console.log(`Persistence Mode: ${config.persistenceMode}`);
    console.log(`Queue Concurrency: ${config.queueConcurrency}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap backend:', error);
  process.exit(1);
});
