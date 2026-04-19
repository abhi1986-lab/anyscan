import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  ocrProviderMode: process.env.OCR_PROVIDER_MODE || 'mock',
  maxFileSizeBytes: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10) * 1024 * 1024,
};
