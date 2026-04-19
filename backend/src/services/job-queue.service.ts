import { config } from '../config';
import { jobRunnerService } from './job-runner.service';
import { storeService } from './store.service';

export class JobQueueService {
  private pendingJobIds: string[] = [];
  private processingCount = 0;
  private started = false;

  async start() {
    if (this.started) return;
    this.started = true;

    const resumableJobs = await storeService.getJobsByStatus([
      'queued',
      'preprocessing',
      'ocr_running',
      'ai_extracting',
    ]);

    for (const job of resumableJobs) {
      if (!this.pendingJobIds.includes(job.jobId)) {
        this.pendingJobIds.push(job.jobId);
      }
    }

    await this.drain();
  }

  async enqueue(jobId: string) {
    if (!this.pendingJobIds.includes(jobId)) {
      this.pendingJobIds.push(jobId);
    }
    await this.drain();
  }

  private async drain() {
    while (this.processingCount < config.queueConcurrency && this.pendingJobIds.length > 0) {
      const jobId = this.pendingJobIds.shift();

      if (!jobId) {
        return;
      }

      this.processingCount += 1;

      jobRunnerService
        .process(jobId)
        .catch(async (error) => {
          const message = error instanceof Error ? error.message : 'Unexpected queue worker error';
          await storeService.failJob(jobId, message);
        })
        .finally(() => {
          this.processingCount -= 1;
          void this.drain();
        });
    }
  }
}

export const jobQueueService = new JobQueueService();
