import { Request, Response } from 'express';
import { z } from 'zod';
import { jobRunnerService } from '../services/job-runner.service';
import { jobStoreService } from '../services/job-store.service';

const createJobSchema = z.object({
  uploadId: z.string().min(1),
});

export class JobsController {
  async create(req: Request, res: Response) {
    const parsed = createJobSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'uploadId is required',
        },
      });
    }

    const upload = jobStoreService.getUpload(parsed.data.uploadId);
    if (!upload) {
      return res.status(404).json({
        error: {
          code: 'UPLOAD_NOT_FOUND',
          message: 'Upload not found',
        },
      });
    }

    const job = jobStoreService.createJob(parsed.data.uploadId);
    await jobRunnerService.enqueue(job.jobId);

    return res.status(201).json({
      jobId: job.jobId,
      status: job.status,
    });
  }

  getStatus(req: Request, res: Response) {
    const job = jobStoreService.getJob(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job not found',
        },
      });
    }

    return res.json({
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      stageMessage: job.stageMessage,
      errorMessage: job.errorMessage,
    });
  }

  getResult(req: Request, res: Response) {
    const job = jobStoreService.getJob(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job not found',
        },
      });
    }

    if (job.status !== 'completed' || !job.result) {
      return res.status(409).json({
        error: {
          code: 'JOB_NOT_READY',
          message: 'Job result is not ready yet',
        },
      });
    }

    return res.json(job.result);
  }

  async retry(req: Request, res: Response) {
    const job = jobStoreService.getJob(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job not found',
        },
      });
    }

    const upload = jobStoreService.getUpload(job.uploadId);
    if (!upload) {
      return res.status(404).json({
        error: {
          code: 'UPLOAD_NOT_FOUND',
          message: 'Upload not found for retry',
        },
      });
    }

    jobStoreService.updateJob(job.jobId, {
      status: 'queued',
      progress: 0,
      stageMessage: 'Queued for retry',
      errorMessage: undefined,
      result: undefined,
    });

    await jobRunnerService.enqueue(job.jobId);

    return res.json({
      jobId: job.jobId,
      status: 'queued',
    });
  }
}

export const jobsController = new JobsController();
