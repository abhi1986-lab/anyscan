import { FastifyInstance } from 'fastify';
import {
  createJobController,
  getJobController,
  getJobResultController,
  retryJobController,
} from '../controllers/jobController.js';

export async function jobRoutes(app: FastifyInstance) {
  app.post('/jobs', createJobController);
  app.get('/jobs/:jobId', getJobController);
  app.get('/jobs/:jobId/result', getJobResultController);
  app.post('/jobs/:jobId/retry', retryJobController);
}
