export type JobStatus =
  | 'queued'
  | 'preprocessing'
  | 'ocr_running'
  | 'ai_extracting'
  | 'completed'
  | 'failed';

export interface UploadResponse {
  uploadId: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
}

export interface CreateJobResponse {
  jobId: string;
  status: JobStatus;
}

export interface JobStatusResponse {
  jobId: string;
  status: JobStatus;
  progress?: number;
  stageMessage?: string;
  errorMessage?: string;
}

export interface ExtractedField {
  key: string;
  value: string;
  confidence?: number;
}

export interface JobResultResponse {
  jobId: string;
  documentType: string;
  confidence: number;
  rawText: string;
  fields: ExtractedField[];
  warnings?: string[];
}
