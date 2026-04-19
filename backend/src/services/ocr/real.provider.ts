import { IOCRProvider } from './ocr.interface';
import Tesseract from 'tesseract.js';

export class RealOCRProvider implements IOCRProvider {
  async extractText(imagePath: string): Promise<string> {
    try {
      const result = await Tesseract.recognize(imagePath, 'eng');
      return result.data.text;
    } catch (error) {
      console.error('Tesseract OCR failed:', error);
      throw new Error('Real OCR processing failed');
    }
  }
}
