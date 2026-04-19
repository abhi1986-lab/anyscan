import { createJob, getJobResult, getJobStatus, retryJob } from '../src/services/jobService';

const originalFetch = global.fetch;

describe('jobService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('creates a job', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ jobId: 'job_1', status: 'queued' }),
    });

    await expect(createJob('upl_1')).resolves.toEqual({ jobId: 'job_1', status: 'queued' });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/v1/jobs',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns job status', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ jobId: 'job_1', status: 'ocr_running', progress: 55 }),
    });

    await expect(getJobStatus('job_1')).resolves.toEqual({ jobId: 'job_1', status: 'ocr_running', progress: 55 });
  });

  it('returns job result', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ jobId: 'job_1', documentType: 'Invoice', confidence: 0.9, rawText: 'x', fields: [] }),
    });

    await expect(getJobResult('job_1')).resolves.toEqual({
      jobId: 'job_1',
      documentType: 'Invoice',
      confidence: 0.9,
      rawText: 'x',
      fields: [],
    });
  });

  it('retries a job', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ jobId: 'job_1', status: 'queued' }),
    });

    await expect(retryJob('job_1')).resolves.toEqual({ jobId: 'job_1', status: 'queued' });
  });

  it('throws on failed createJob response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    await expect(createJob('upl_1')).rejects.toThrow('Job creation failed');
  });
});
