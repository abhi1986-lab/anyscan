import { Pool } from 'pg';
import { config } from '../config';
import { JobRecord, JobResult, JobStatus, UploadRecord } from '../types/jobs';

function mapUpload(row: any): UploadRecord {
  return {
    uploadId: row.upload_id,
    originalName: row.original_name,
    mimeType: row.mime_type,
    sizeBytes: Number(row.size_bytes),
    path: row.path,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapJob(row: any): JobRecord {
  return {
    jobId: row.job_id,
    uploadId: row.upload_id,
    status: row.status,
    progress: Number(row.progress),
    stageMessage: row.stage_message,
    errorMessage: row.error_message ?? undefined,
    result: row.result_json ? (row.result_json as JobResult) : undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export class PostgresStoreService {
  private pool: Pool;

  constructor() {
    if (!config.databaseUrl) {
      throw new Error('DATABASE_URL is required when PERSISTENCE_MODE=postgres');
    }

    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
  }

  async init() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS uploads (
        upload_id TEXT PRIMARY KEY,
        original_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes BIGINT NOT NULL,
        path TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        job_id TEXT PRIMARY KEY,
        upload_id TEXT NOT NULL REFERENCES uploads(upload_id) ON DELETE CASCADE,
        status TEXT NOT NULL,
        progress INTEGER NOT NULL DEFAULT 0,
        stage_message TEXT NOT NULL,
        error_message TEXT NULL,
        result_json JSONB NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    `);
  }

  async close() {
    await this.pool.end();
  }

  async createUpload(file: { uploadId: string; originalName: string; mimeType: string; sizeBytes: number; path: string }): Promise<UploadRecord> {
    const result = await this.pool.query(
      `
      INSERT INTO uploads (upload_id, original_name, mime_type, size_bytes, path)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [file.uploadId, file.originalName, file.mimeType, file.sizeBytes, file.path],
    );

    return mapUpload(result.rows[0]);
  }

  async getUpload(uploadId: string): Promise<UploadRecord | undefined> {
    const result = await this.pool.query(`SELECT * FROM uploads WHERE upload_id = $1`, [uploadId]);
    return result.rows[0] ? mapUpload(result.rows[0]) : undefined;
  }

  async createJob(job: { jobId: string; uploadId: string; status: JobStatus; progress: number; stageMessage: string }): Promise<JobRecord> {
    const result = await this.pool.query(
      `
      INSERT INTO jobs (job_id, upload_id, status, progress, stage_message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [job.jobId, job.uploadId, job.status, job.progress, job.stageMessage],
    );

    return mapJob(result.rows[0]);
  }

  async getJob(jobId: string): Promise<JobRecord | undefined> {
    const result = await this.pool.query(`SELECT * FROM jobs WHERE job_id = $1`, [jobId]);
    return result.rows[0] ? mapJob(result.rows[0]) : undefined;
  }

  async getJobsByStatus(statuses: JobStatus[]): Promise<JobRecord[]> {
    if (statuses.length === 0) return [];
    const result = await this.pool.query(
      `SELECT * FROM jobs WHERE status = ANY($1::text[]) ORDER BY created_at ASC`,
      [statuses],
    );
    return result.rows.map(mapJob);
  }

  async updateJob(jobId: string, patch: Partial<JobRecord>): Promise<JobRecord | undefined> {
    const current = await this.getJob(jobId);
    if (!current) return undefined;

    const merged: JobRecord = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    const result = await this.pool.query(
      `
      UPDATE jobs
      SET status = $2,
          progress = $3,
          stage_message = $4,
          error_message = $5,
          result_json = $6,
          updated_at = $7
      WHERE job_id = $1
      RETURNING *
      `,
      [
        jobId,
        merged.status,
        merged.progress,
        merged.stageMessage,
        merged.errorMessage ?? null,
        merged.result ? JSON.stringify(merged.result) : null,
        merged.updatedAt,
      ],
    );

    return result.rows[0] ? mapJob(result.rows[0]) : undefined;
  }

  async setJobResult(jobId: string, result: JobResult): Promise<JobRecord | undefined> {
    return this.updateJob(jobId, {
      status: 'completed',
      progress: 100,
      stageMessage: 'Processing complete',
      result,
      errorMessage: undefined,
    });
  }

  async failJob(jobId: string, message: string): Promise<JobRecord | undefined> {
    return this.updateJob(jobId, {
      status: 'failed',
      stageMessage: 'Processing failed',
      errorMessage: message,
    });
  }
}
