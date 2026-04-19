import { Request, Response } from 'express';
import { storeService } from '../services/store.service';

export class UploadsController {
  async create(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({
        error: {
          code: 'API_ERROR_NO_FILE',
          message: 'No file uploaded',
        },
      });
    }

    const upload = await storeService.createUpload({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      path: req.file.path,
    });

    return res.status(201).json({
      uploadId: upload.uploadId,
      fileUrl: upload.path,
      mimeType: upload.mimeType,
      sizeBytes: upload.sizeBytes,
    });
  }
}

export const uploadsController = new UploadsController();
