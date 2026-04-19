import { randomUUID } from 'node:crypto';
import { getUpload } from './storageService.js';
import { JobRecord } from '../types/jobs.js';

const jobs = new Map<string, JobRecord>();

function updateJob(jobId: string, patch: Partial<JobRecord>) {
  const current = jobs.get(jobId);
  if (!current) return;

  jobs.set(jobId, {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

function simulateJob(jobId: string) {
  setTimeout(() => {
    updateJob(jobId, {
      status: 'preprocessing',
      progress: 20,
      stageMessage: 'Preparing document for OCR',
    });
  }, 1000);

  setTimeout(() => {
    updateJob(jobId, {
      status: 'ocr_running',
      progress: 50,
      stageMessage: 'Extracting text from document',
    });
  }, 3000);

  setTimeout(() => {
    updateJob(jobId, {
      status: 'ai_extracting',
      progress: 80,
      stageMessage: 'Structuring data with AI',
    });
  }, 5000);

  setTimeout(() => {
    updateJob(jobId, {
      status: 'completed',
      progress: 100,
      stageMessage: 'Processing complete',
      result: {
        jobId,
        documentType: 'Generic Document',
        confidence: 0.86,
        rawText: 'Mock OCR text extracted from the uploaded document.',
        fields: [
          { key: 'Document Name', value: 'Scanned Document', confidence: 0.93 },
          { key: 'Detected Type', value: 'Generic Document', confidence: 0.9 },
          { key: 'Status', value: 'Ready for review', confidence: 0.99 }
        ],
        warnings: [],
      },
    });
  }, 7000);
}

export function createJob(uploadId: string): JobRecord {
  const upload = getUpload(uploadId);
  if (!upload) {
    throw new Error('Upload not found');
  }

  const jobId = `job_${randomUUID()}`;
  const job: JobRecord = {
    jobId,
    uploadId,
    status: 'queued',
    progress: 0,
    stageMessage: 'Queued for processing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  jobs.set(jobId, job);
  simulateJob(jobId);
  return job;
}

export function getJob(jobId: string): JobRecord | undefined {
  return jobs.get(jobId);
}

export function retryJob(jobId: string): JobRecord {
  const current = jobs.get(jobId);
  if (!current) {
    throw new Error('Job not found');
  }

  const reset: JobRecord = {
    ...current,
    status: 'queued',
    progress: 0,
    stageMessage: 'Queued for processing',
    errorMessage: undefined,
    result: undefined,
    updatedAt: new Date().toISOString(),
  };

  jobs.set(jobId, reset);
  simulateJob(jobId);
  return reset;
}
