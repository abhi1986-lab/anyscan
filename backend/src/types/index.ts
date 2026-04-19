export interface StructuredField {
  key: string;
  value: string;
}

export interface StructuredDocument {
  rawText: string;
  documentType: string;
  title: string;
  fields: StructuredField[];
}
