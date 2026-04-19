import { uploadFile } from '../src/services/uploadService';

const originalFetch = global.fetch;
const OriginalFormData = global.FormData;

class MockFormData {
  entries: Array<{ key: string; value: unknown; fileName?: string }> = [];

  append(key: string, value: unknown, fileName?: string) {
    this.entries.push({ key, value, fileName });
  }
}

describe('uploadService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    // @ts-expect-error test override
    global.FormData = MockFormData;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    global.FormData = OriginalFormData;
  });

  it('uploads a file after fetching the local blob', async () => {
    const blob = { mock: 'blob' };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ blob: async () => blob })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uploadId: 'upl_1', fileUrl: '/tmp/doc.jpg', mimeType: 'image/jpeg', sizeBytes: 100 }),
      });

    await expect(uploadFile('file:///tmp/doc.jpg')).resolves.toEqual({
      uploadId: 'upl_1',
      fileUrl: '/tmp/doc.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 100,
    });

    expect(global.fetch).toHaveBeenNthCalledWith(1, 'file:///tmp/doc.jpg');
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3000/v1/uploads',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws when upload request fails', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ blob: async () => ({}) })
      .mockResolvedValueOnce({ ok: false });

    await expect(uploadFile('file:///tmp/doc.jpg')).rejects.toThrow('Upload failed');
  });
});
