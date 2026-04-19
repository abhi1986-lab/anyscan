import { randomUUID } from 'crypto';
import { JobRecord, JobResult, UploadRecord } from '../types/jobs';
import { persistenceService } from './persistence.service';

export class JobStoreService {
  private uploads = new Map<string, UploadRecord>();
  private jobs = new Map<string, JobRecord>();

  constructor() {
    this.load();
  }

  private load() {
    const state = persistenceService.readState();
    this.uploads = new Map(state.uploads.map((upload) => [upload.uploadId, upload]));
    this.jobs = new Map(state.jobs.map((job) => [job.jobId, job]));
  }

  private persist() {
    const state = persistenceService.readState();
    persistenceService.writeState({
      ...state,
      uploads: Array.from(this.uploads.values()),
      jobs: Array.from(this.jobs.values()),
    });
  }

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
    this.uploads.set(uploadId, record);
    this.persist();
    return record;
  }

  getUpload(uploadId: string): UploadRecord | undefined {
    return this.uploads.get(uploadId);
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
    this.jobs.set(jobId, job);
    this.persist();
    return job;
  }

  getJob(jobId: string): JobRecord | undefined {
    return this.jobs.get(jobId);
  }

  getJobsByStatus(statuses: JobRecord['status'][]): JobRecord[] {
    return Array.from(this.jobs.values()).filter((job) => statuses.includes(job.status));
  }

  updateJob(jobId: string, patch: Partial<JobRecord>): JobRecord | undefined {
    const current = this.jobs.get(jobId);
    if (!current) return undefined;
    const updated: JobRecord = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(jobId, updated);
    this.persist();
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
