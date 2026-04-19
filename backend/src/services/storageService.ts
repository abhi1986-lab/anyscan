import { randomUUID } from 'node:crypto';
import { UploadRecord } from '../types/jobs.js';

const uploads = new Map<string, UploadRecord>();

export async function saveUpload(file: {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}): Promise<UploadRecord> {
  const uploadId = `upl_${randomUUID()}`;
  const record: UploadRecord = {
    uploadId,
    fileName: file.fileName,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    fileUrl: `/mock-storage/${uploadId}/${file.fileName}`,
    createdAt: new Date().toISOString(),
  };

  uploads.set(uploadId, record);
  return record;
}

export function getUpload(uploadId: string): UploadRecord | undefined {
  return uploads.get(uploadId);
}
