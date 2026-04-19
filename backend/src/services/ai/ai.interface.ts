import { StructuredDocument } from '../../types';

export interface IAIExtractor {
  extractStructuredData(rawText: string): Promise<StructuredDocument>;
}
