import app from './app';
import { config } from './config';
import { jobQueueService } from './services/job-queue.service';

jobQueueService.start();

const server = app.listen(config.port, () => {
  console.log(`Backend server is running on http://localhost:${config.port}`);
  console.log(`OCR Provider Mode: ${config.ocrProviderMode}`);
  console.log(`Queue Concurrency: ${config.queueConcurrency}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
