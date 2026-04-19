import { OpenAIProvider } from '../services/ai/openai.provider';

describe('OpenAIProvider heuristic extraction', () => {
  const provider = new OpenAIProvider();

  it('extracts invoice-style key value pairs instead of mocked fields', async () => {
    const rawText = [
      'TAX INVOICE',
      'Invoice No: INV-2025-001',
      'Date: 19/04/2026',
      'Vendor: Acme Traders',
      'Total: ₹4,250.00',
    ].join('\n');

    const result = await provider.extractStructuredData(rawText);

    expect(result.documentType).toBe('Invoice');
    expect(result.title).toBe('TAX INVOICE');
    expect(result.fields).toEqual(
      expect.arrayContaining([
        { key: 'Document Type', value: 'Invoice' },
        { key: 'Invoice No', value: 'INV-2025-001' },
        { key: 'Date', value: '19/04/2026' },
        { key: 'Vendor', value: 'Acme Traders' },
        { key: 'Total', value: '₹4,250.00' },
      ]),
    );
    expect(result.fields).not.toEqual(
      expect.arrayContaining([
        { key: 'Summary', value: 'This is a mock AI summary of the text.' },
      ]),
    );
  });

  it('detects identity document patterns and fallback fields', async () => {
    const rawText = [
      'GOVERNMENT OF INDIA',
      'Name: Rahul Kumar',
      'DOB: 12/08/1994',
      'ID No: ABCD123456',
    ].join('\n');

    const result = await provider.extractStructuredData(rawText);

    expect(result.documentType).toBe('Identity Document');
    expect(result.fields).toEqual(
      expect.arrayContaining([
        { key: 'Document Type', value: 'Identity Document' },
        { key: 'Name', value: 'Rahul Kumar' },
        { key: 'DOB', value: '12/08/1994' },
        { key: 'ID No', value: 'ABCD123456' },
      ]),
    );
  });

  it('falls back to extracted text when structured fields are missing', async () => {
    const rawText = 'Unstructured content without obvious labels but with useful words';

    const result = await provider.extractStructuredData(rawText);

    expect(result.documentType).toBe('Document');
    expect(result.fields[0]).toEqual({ key: 'Document Type', value: 'Document' });
    expect(result.fields.some((field) => field.key === 'Extracted Text')).toBe(true);
  });
});
