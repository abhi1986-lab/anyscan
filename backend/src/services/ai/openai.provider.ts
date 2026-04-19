import { IAIExtractor } from './ai.interface';
import { StructuredDocument, StructuredField } from '../../types';

export class OpenAIProvider implements IAIExtractor {
  async extractStructuredData(rawText: string): Promise<StructuredDocument> {
    const cleanedText = rawText.replace(/\r/g, '').trim();
    const lines = cleanedText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const documentType = this.detectDocumentType(cleanedText, lines);
    const title = this.detectTitle(lines, documentType);
    const fields = this.extractFields(cleanedText, lines, documentType);

    return {
      rawText,
      documentType,
      title,
      fields,
    };
  }

  private detectDocumentType(rawText: string, lines: string[]): string {
    const text = `${rawText}\n${lines.join('\n')}`.toLowerCase();

    if (/invoice|tax invoice|bill to|invoice no/.test(text)) return 'Invoice';
    if (/receipt|txn|transaction|paid via/.test(text)) return 'Receipt';
    if (/passport/.test(text)) return 'Passport';
    if (/driving licence|driver license|dl no/.test(text)) return 'Driving License';
    if (/aadhaar|aadhar|government of india|dob|yob/.test(text)) return 'Identity Document';
    if (/bank statement|account number|ifsc|balance/.test(text)) return 'Bank Statement';

    return 'Document';
  }

  private detectTitle(lines: string[], documentType: string): string {
    const candidate = lines.find((line) => line.length >= 3 && /[A-Za-z]/.test(line));
    return candidate || documentType;
  }

  private extractFields(rawText: string, lines: string[], documentType: string): StructuredField[] {
    const fields: StructuredField[] = [];
    const seenKeys = new Set<string>();

    const addField = (key: string, value: string) => {
      const normalizedKey = key.trim();
      const normalizedValue = value.trim();

      if (!normalizedKey || !normalizedValue) return;
      if (normalizedValue.length < 2) return;
      if (seenKeys.has(normalizedKey.toLowerCase())) return;

      seenKeys.add(normalizedKey.toLowerCase());
      fields.push({ key: normalizedKey, value: normalizedValue });
    };

    for (const line of lines) {
      if (fields.length >= 12) break;

      const colonMatch = line.match(/^([A-Za-z][A-Za-z0-9 .\-\/()]{1,40})\s*[:\-]\s*(.+)$/);
      if (colonMatch) {
        addField(colonMatch[1], colonMatch[2]);
        continue;
      }

      const spacedMatch = line.match(/^([A-Za-z][A-Za-z0-9 .\-\/()]{1,30})\s{2,}(.+)$/);
      if (spacedMatch) {
        addField(spacedMatch[1], spacedMatch[2]);
      }
    }

    if (fields.length === 0) {
      const patterns: Array<{ key: string; regex: RegExp }> = [
        { key: 'Document Number', regex: /\b([A-Z0-9]{6,20})\b/ },
        { key: 'Date', regex: /\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})\b/ },
        { key: 'Email', regex: /\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/i },
        { key: 'Phone', regex: /\b(\+?\d[\d\s\-]{7,14}\d)\b/ },
        { key: 'Amount', regex: /(?:₹|Rs\.?|INR|\$|EUR)\s?([0-9,]+(?:\.\d{1,2})?)/i },
      ];

      for (const pattern of patterns) {
        const match = rawText.match(pattern.regex);
        if (match?.[1]) {
          addField(pattern.key, match[1]);
        }
      }
    }

    if (fields.length === 0 && lines.length > 0) {
      addField('Extracted Text', lines.slice(0, 3).join(' | '));
    }

    if (!seenKeys.has('document type')) {
      fields.unshift({ key: 'Document Type', value: documentType });
    }

    return fields.slice(0, 12);
  }
}
