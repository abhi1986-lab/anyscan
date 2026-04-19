import { normalizerService } from '../services/extraction/normalizer.service';

describe('NormalizerService', () => {
  it('normalizes array-based fields', () => {
    const result = normalizerService.normalize(
      {
        documentType: 'Invoice',
        title: 'April Invoice',
        fields: [
          { key: 'Invoice Number', value: 101 },
          { key: 'Total', value: '200' },
        ],
      },
      'raw text',
    );

    expect(result).toEqual({
      rawText: 'raw text',
      documentType: 'Invoice',
      title: 'April Invoice',
      fields: [
        { key: 'Invoice Number', value: '101' },
        { key: 'Total', value: '200' },
      ],
    });
  });

  it('normalizes object-based fields', () => {
    const result = normalizerService.normalize(
      {
        fields: {
          Vendor: 'Acme',
          Total: 400,
        },
      },
      'ocr text',
    );

    expect(result.fields).toEqual([
      { key: 'Vendor', value: 'Acme' },
      { key: 'Total', value: '400' },
    ]);
    expect(result.documentType).toBe('Unknown');
    expect(result.title).toBe('Untitled Document');
  });

  it('handles empty or malformed fields gracefully', () => {
    const result = normalizerService.normalize({ fields: [{ value: null }] }, 'ocr text');

    expect(result.fields).toEqual([{ key: 'Unknown Key', value: '' }]);
  });
});
