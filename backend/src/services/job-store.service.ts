import { randomUUID } from 'crypto';
import { JobRecord, JobResult, UploadRecord } from '../types/jobs';

const uploads = new Map<string, UploadRecord>();
const jobs = new Map<string, JobRecord>();

export class JobStoreService {
  createUpload(file: { originalName: string; mimeType: string; sizeBytes: number; path: string }): UploadRecord {
    const uploadId = `upl_${randomUUID()}`;
    const record: UploadRecord = {
      uploadId,
      originalName: file.originalName,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      path: file.path,
      createdAt: new Date().toISOString(),
    };
    uploads.set(uploadId, record);
    return record;
  }

  getUpload(uploadId: string): UploadRecord | undefined {
    return uploads.get(uploadId);
  }

  createJob(uploadId: string): JobRecord {
    const jobId = `job_${randomUUID()}`;
    const now = new Date().toISOString();
    const job: JobRecord = {
      jobId,
      uploadId,
      status: 'queued',
      progress: 0,
      stageMessage: 'Queued for processing',
      createdAt: now,
      updatedAt: now,
    };
    jobs.set(jobId, job);
    return job;
  }

  getJob(jobId: string): JobRecord | undefined {
    return jobs.get(jobId);
  }

  updateJob(jobId: string, patch: Partial<JobRecord>): JobRecord | undefined {
    const current = jobs.get(jobId);
    if (!current) return undefined;
    const updated: JobRecord = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    jobs.set(jobId, updated);
    return updated;
  }

  setJobResult(jobId: string, result: JobResult): JobRecord | undefined {
    return this.updateJob(jobId, {
      status: 'completed',
      progress: 100,
      stageMessage: 'Processing complete',
      result,
      errorMessage: undefined,
    });
  }

  failJob(jobId: string, message: string): JobRecord | undefined {
    return this.updateJob(jobId, {
      status: 'failed',
      stageMessage: 'Processing failed',
      errorMessage: message,
    });
  }
}

export const jobStoreService = new JobStoreService();
