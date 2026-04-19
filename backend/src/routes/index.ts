import { Router } from 'express';
import { extractController } from '../controllers/extract.controller';
import { jobsController } from '../controllers/jobs.controller';
import { uploadsController } from '../controllers/uploads.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.post('/extract', upload.single('image'), extractController.extract);

router.post('/v1/uploads', upload.single('file'), uploadsController.create);
router.post('/v1/jobs', jobsController.create);
router.get('/v1/jobs/:jobId', jobsController.getStatus);
router.get('/v1/jobs/:jobId/result', jobsController.getResult);
router.post('/v1/jobs/:jobId/retry', jobsController.retry);

export default router;
