import { Router } from 'express';
import { extractController } from '../controllers/extract.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.post('/extract', upload.single('image'), extractController.extract);

export default router;
