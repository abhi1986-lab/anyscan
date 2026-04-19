import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { ocrService } from '../services/ocr/ocr.service';
import { parserService } from '../services/extraction/parser.service';

export class ExtractController {
  async extract(req: Request, res: Response, next: NextFunction) {
    let filePath = '';
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No image file provided' });
        return;
      }

      filePath = req.file.path;

      // 1. Send image to OCR
      const rawText = await ocrService.processImage(filePath);

      // 2. Parse text into structured JSON
      const result = parserService.parse(rawText);

      // Return clean response
      res.json(result);
    } catch (error) {
      next(error);
    } finally {
      // 3. Delete temporary file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Failed to delete temp file ${filePath}:`, err);
        });
      }
    }
  }
}

export const extractController = new ExtractController();
