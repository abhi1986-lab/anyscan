import { IAIExtractor } from './ai.interface';
import { OpenAIProvider } from './openai.provider';
import { StructuredDocument } from '../../types';
import { config } from '../../config';

export class AIService {
  private provider: IAIExtractor;

  constructor() {
    // We default to OpenAIProvider (with simulated logic) for now. 
    // In the future, this can be switched based on config.aiProvider
    this.provider = new OpenAIProvider();
  }

  async extractStructuredData(rawText: string): Promise<StructuredDocument> {
    return this.provider.extractStructuredData(rawText);
  }
}

export const aiService = new AIService();
