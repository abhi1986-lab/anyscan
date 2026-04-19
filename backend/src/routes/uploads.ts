import { FastifyInstance } from 'fastify';
import { uploadFileController } from '../controllers/uploadController.js';

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/uploads', uploadFileController);
}
