import { config } from '../../config';
import { IOCRProvider } from './ocr.interface';
import { MockOCRProvider } from './mock.provider';
import { RealOCRProvider } from './real.provider';

export class OCRService {
  private provider: IOCRProvider;

  constructor() {
    if (config.ocrProviderMode === 'real') {
      this.provider = new RealOCRProvider();
    } else {
      this.provider = new MockOCRProvider();
    }
  }

  async processImage(imagePath: string): Promise<string> {
    return this.provider.extractText(imagePath);
  }
}

export const ocrService = new OCRService();
