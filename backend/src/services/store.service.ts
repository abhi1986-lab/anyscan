import { randomUUID } from 'crypto';
import { config } from '../config';
import { JobRecord, JobResult, JobStatus, UploadRecord } from '../types/jobs';
import { jobStoreService as fileStoreService } from './job-store.service';
import { PostgresStoreService } from './postgres-store.service';

export class StoreService {
  private postgresStore?: PostgresStoreService;

  constructor() {
    if (config.persistenceMode === 'postgres') {
      this.postgresStore = new PostgresStoreService();
    }
  }

  async init() {
    if (this.postgresStore) {
      await this.postgresStore.init();
    }
  }

  async createUpload(file: { originalName: string; mimeType: string; sizeBytes: number; path: string }): Promise<UploadRecord> {
    if (this.postgresStore) {
      return this.postgresStore.createUpload({
        uploadId: `upl_${randomUUID()}`,
        ...file,
      });
    }

    return fileStoreService.createUpload(file);
  }

  async getUpload(uploadId: string): Promise<UploadRecord | undefined> {
    if (this.postgresStore) {
      return this.postgresStore.getUpload(uploadId);
    }

    return fileStoreService.getUpload(uploadId);
  }

  async createJob(uploadId: string): Promise<JobRecord> {
    if (this.postgresStore) {
      return this.postgresStore.createJob({
        jobId: `job_${randomUUID()}`,
        uploadId,
        status: 'queued',
        progress: 0,
        stageMessage: 'Queued for processing',
      });
    }

    return fileStoreService.createJob(uploadId);
  }

  async getJob(jobId: string): Promise<JobRecord | undefined> {
    if (this.postgresStore) {
      return this.postgresStore.getJob(jobId);
    }

    return fileStoreService.getJob(jobId);
  }

  async getJobsByStatus(statuses: JobStatus[]): Promise<JobRecord[]> {
    if (this.postgresStore) {
      return this.postgresStore.getJobsByStatus(statuses);
    }

    return fileStoreService.getJobsByStatus(statuses);
  }

  async updateJob(jobId: string, patch: Partial<JobRecord>): Promise<JobRecord | undefined> {
    if (this.postgresStore) {
      return this.postgresStore.updateJob(jobId, patch);
    }

    return fileStoreService.updateJob(jobId, patch);
  }

  async setJobResult(jobId: string, result: JobResult): Promise<JobRecord | undefined> {
    if (this.postgresStore) {
      return this.postgresStore.setJobResult(jobId, result);
    }

    return fileStoreService.setJobResult(jobId, result);
  }

  async failJob(jobId: string, message: string): Promise<JobRecord | undefined> {
    if (this.postgresStore) {
      return this.postgresStore.failJob(jobId, message);
    }

    return fileStoreService.failJob(jobId, message);
  }
}

export const storeService = new StoreService();
