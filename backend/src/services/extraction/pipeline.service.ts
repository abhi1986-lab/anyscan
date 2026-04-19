import { ocrService } from '../ocr/ocr.service';
import { aiService } from '../ai/ai.service';
import { normalizerService } from './normalizer.service';
import { StructuredDocument } from '../../types';

export interface ExtractionPipelineHooks {
  onPreprocessing?: () => Promise<void> | void;
  onOCRRunning?: () => Promise<void> | void;
  onAIExtracting?: () => Promise<void> | void;
}

export class ExtractionPipelineService {
  async processImage(filePath: string, hooks?: ExtractionPipelineHooks): Promise<StructuredDocument> {
    await hooks?.onPreprocessing?.();
    await hooks?.onOCRRunning?.();
    const rawText = await ocrService.processImage(filePath);

    await hooks?.onAIExtracting?.();
    const aiDocFields = await aiService.extractStructuredData(rawText);

    return normalizerService.normalize(aiDocFields, rawText);
  }
}

export const extractionPipelineService = new ExtractionPipelineService();
