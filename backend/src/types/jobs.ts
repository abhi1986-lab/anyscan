import { StructuredDocument } from './index';

export type JobStatus =
  | 'queued'
  | 'preprocessing'
  | 'ocr_running'
  | 'ai_extracting'
  | 'completed'
  | 'failed';

export interface UploadRecord {
  uploadId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  path: string;
  createdAt: string;
}

export interface JobResult extends StructuredDocument {
  jobId: string;
  confidence: number;
  warnings: string[];
}

export interface JobRecord {
  jobId: string;
  uploadId: string;
  status: JobStatus;
  progress: number;
  stageMessage: string;
  errorMessage?: string;
  result?: JobResult;
  createdAt: string;
  updatedAt: string;
}
