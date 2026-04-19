import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { extractionPipelineService } from '../services/extraction/pipeline.service';

export class ExtractController {
  async extract(req: Request, res: Response, next: NextFunction) {
    let filePath = '';
    try {
      if (!req.file) {
        res.status(400).json({ 
          error: {
            code: 'API_ERROR_NO_FILE',
            message: 'No image file provided'
          }
         });
        return;
      }

      filePath = req.file.path;

      const result = await extractionPipelineService.processImage(filePath);

      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: {
          code: 'SERVER_ERROR',
          message: error.message || 'An unexpected error occurred during extraction'
        }
      });
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Failed to delete temp file ${filePath}:`, err);
        });
      }
    }
  }
}

export const extractController = new ExtractController();
