export interface RawExtractionResult {
  text: string;
}

export interface ExtractedLineItem {
  name: string;
  quantity: string;
  price: string;
  amount: string;
}

export interface ExtractedFields {
  vendor: string;
  date: string;
  totalAmount: string;
  tax: string;
}

export interface StructuredExtraction {
  rawText: string;
  documentType: string;
  fields: ExtractedFields;
  lineItems: ExtractedLineItem[];
}
