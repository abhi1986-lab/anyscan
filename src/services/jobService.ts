import { API_BASE_URL } from '../config/api';
import {
  CreateJobResponse,
  JobResultResponse,
  JobStatusResponse,
} from '../types/api';

export async function createJob(uploadId: string): Promise<CreateJobResponse> {
  const res = await fetch(`${API_BASE_URL}/v1/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uploadId }),
  });

  if (!res.ok) {
    throw new Error('Job creation failed');
  }

  return res.json();
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/v1/jobs/${jobId}`);

  if (!res.ok) {
    throw new Error('Could not fetch job status');
  }

  return res.json();
}

export async function getJobResult(jobId: string): Promise<JobResultResponse> {
  const res = await fetch(`${API_BASE_URL}/v1/jobs/${jobId}/result`);

  if (!res.ok) {
    throw new Error('Could not fetch job result');
  }

  return res.json();
}

export async function retryJob(jobId: string): Promise<CreateJobResponse> {
  const res = await fetch(`${API_BASE_URL}/v1/jobs/${jobId}/retry`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Retry failed');
  }

  return res.json();
}
