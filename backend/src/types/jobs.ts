export type JobStatus =
  | 'queued'
  | 'preprocessing'
  | 'ocr_running'
  | 'ai_extracting'
  | 'completed'
  | 'failed';

export interface UploadRecord {
  uploadId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  fileUrl: string;
  createdAt: string;
}

export interface ExtractionField {
  key: string;
  value: string;
  confidence?: number;
}

export interface JobRecord {
  jobId: string;
  uploadId: string;
  status: JobStatus;
  progress: number;
  stageMessage?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  result?: {
    jobId: string;
    documentType: string;
    confidence: number;
    rawText: string;
    fields: ExtractionField[];
    warnings?: string[];
  };
}
