import { uploadsController } from '../controllers/uploads.controller';
import { storeService } from '../services/store.service';

jest.mock('../services/store.service', () => ({
  storeService: {
    createUpload: jest.fn(),
  },
}));

function mockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('UploadsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when file is missing', async () => {
    const req: any = {};
    const res = mockResponse();

    await uploadsController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'API_ERROR_NO_FILE',
        message: 'No file uploaded',
      },
    });
  });

  it('creates an upload record', async () => {
    (storeService.createUpload as jest.Mock).mockResolvedValue({
      uploadId: 'upl_1',
      path: '/tmp/file.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 123,
    });

    const req: any = {
      file: {
        originalname: 'file.jpg',
        mimetype: 'image/jpeg',
        size: 123,
        path: '/tmp/file.jpg',
      },
    };
    const res = mockResponse();

    await uploadsController.create(req, res);

    expect(storeService.createUpload).toHaveBeenCalledWith({
      originalName: 'file.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 123,
      path: '/tmp/file.jpg',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      uploadId: 'upl_1',
      fileUrl: '/tmp/file.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 123,
    });
  });
});
