import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { ocrService } from '../services/ocr/ocr.service';
import { aiService } from '../services/ai/ai.service';
import { normalizerService } from '../services/extraction/normalizer.service';

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

      // 1. Send image to OCR -> raw text
      const rawText = await ocrService.processImage(filePath);

      // 2. AI extraction -> structured data
      const aiDocFields = await aiService.extractStructuredData(rawText);

      // 3. Normalize result based on contract
      const result = normalizerService.normalize(aiDocFields, rawText);

      // Return clean JSON response
      res.json(result);
    } catch (error: any) {
      // Forward to generic error handler or return basic structure
      res.status(500).json({
        error: {
          code: 'SERVER_ERROR',
          message: error.message || 'An unexpected error occurred during extraction'
        }
      });
    } finally {
      // 4. Delete temporary file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Failed to delete temp file ${filePath}:`, err);
        });
      }
    }
  }
}

export const extractController = new ExtractController();
