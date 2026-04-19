import { StructuredDocument, StructuredField } from '../../types';

export class NormalizerService {
  normalize(aiOutput: any, rawText: string): StructuredDocument {
    // Ensure document is not null and is an object
    const doc = aiOutput || {};

    // Validate and build fields
    let fields: StructuredField[] = [];
    
    if (Array.isArray(doc.fields)) {
      fields = doc.fields.map((field: any) => ({
        key: field?.key || 'Unknown Key',
        value: field?.value !== null && field?.value !== undefined ? String(field.value) : '',
      }));
    } else if (doc.fields && typeof doc.fields === 'object') {
       // if fields was accidentally returned as an object { key: value }, map to array
       fields = Object.entries(doc.fields).map(([k, v]) => ({
             key: k,
             value: v !== null && v !== undefined ? String(v) : '',
       }));
    }

    return {
      rawText: rawText,
      documentType: doc.documentType || 'Unknown',
      title: doc.title || 'Untitled Document',
      fields: fields,
    };
  }
}

export const normalizerService = new NormalizerService();
