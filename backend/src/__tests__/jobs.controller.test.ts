import { jobsController } from '../controllers/jobs.controller';
import { jobQueueService } from '../services/job-queue.service';
import { storeService } from '../services/store.service';

jest.mock('../services/job-queue.service', () => ({
  jobQueueService: {
    enqueue: jest.fn(),
  },
}));

jest.mock('../services/store.service', () => ({
  storeService: {
    getUpload: jest.fn(),
    createJob: jest.fn(),
    getJob: jest.fn(),
    updateJob: jest.fn(),
  },
}));

function mockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('JobsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a job and enqueues it', async () => {
    (storeService.getUpload as jest.Mock).mockResolvedValue({ uploadId: 'upl_1' });
    (storeService.createJob as jest.Mock).mockResolvedValue({ jobId: 'job_1', status: 'queued' });

    const req: any = { body: { uploadId: 'upl_1' } };
    const res = mockResponse();

    await jobsController.create(req, res);

    expect(storeService.getUpload).toHaveBeenCalledWith('upl_1');
    expect(storeService.createJob).toHaveBeenCalledWith('upl_1');
    expect(jobQueueService.enqueue).toHaveBeenCalledWith('job_1');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ jobId: 'job_1', status: 'queued' });
  });

  it('returns 404 when upload is missing on create', async () => {
    (storeService.getUpload as jest.Mock).mockResolvedValue(undefined);

    const req: any = { body: { uploadId: 'upl_missing' } };
    const res = mockResponse();

    await jobsController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'UPLOAD_NOT_FOUND',
        message: 'Upload not found',
      },
    });
  });

  it('returns job status', async () => {
    (storeService.getJob as jest.Mock).mockResolvedValue({
      jobId: 'job_1',
      status: 'ocr_running',
      progress: 55,
      stageMessage: 'Extracting text',
      errorMessage: undefined,
    });

    const req: any = { params: { jobId: 'job_1' } };
    const res = mockResponse();

    await jobsController.getStatus(req, res);

    expect(res.json).toHaveBeenCalledWith({
      jobId: 'job_1',
      status: 'ocr_running',
      progress: 55,
      stageMessage: 'Extracting text',
      errorMessage: undefined,
    });
  });

  it('returns 409 when job result is not ready', async () => {
    (storeService.getJob as jest.Mock).mockResolvedValue({
      jobId: 'job_1',
      status: 'queued',
      result: undefined,
    });

    const req: any = { params: { jobId: 'job_1' } };
    const res = mockResponse();

    await jobsController.getResult(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'JOB_NOT_READY',
        message: 'Job result is not ready yet',
      },
    });
  });
});
