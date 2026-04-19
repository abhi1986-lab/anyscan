import app from './app';
import { config } from './config';

const server = app.listen(config.port, () => {
  console.log(`Backend server is running on http://localhost:${config.port}`);
  console.log(`OCR Provider Mode: ${config.ocrProviderMode}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
