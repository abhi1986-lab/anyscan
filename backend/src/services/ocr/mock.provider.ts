import { IOCRProvider } from './ocr.interface';

export class MockOCRProvider implements IOCRProvider {
  async extractText(imagePath: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return `ABC Store
Date: 18/04/2026
Total: 2450
Tax: 18%`;
  }
}
