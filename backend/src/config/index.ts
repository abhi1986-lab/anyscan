import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  nodeEnv: process.env.NODE_ENV || 'development',
  ocrProviderMode: process.env.OCR_PROVIDER_MODE || 'real',
  aiProvider: process.env.AI_PROVIDER || 'openai',
  uploadDir: process.env.UPLOAD_DIR || 'uploads/',
  dataDir: process.env.DATA_DIR || 'data/',
  persistenceMode: process.env.PERSISTENCE_MODE || 'file',
  databaseUrl: process.env.DATABASE_URL || '',
  maxFileSizeBytes: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10) * 1024 * 1024,
  jobPollIntervalMs: parseInt(process.env.JOB_POLL_INTERVAL_MS || '2000', 10),
  queueConcurrency: parseInt(process.env.QUEUE_CONCURRENCY || '1', 10),
};
