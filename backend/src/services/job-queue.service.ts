import { config } from '../config';
import { persistenceService } from './persistence.service';
import { jobRunnerService } from './job-runner.service';
import { jobStoreService } from './job-store.service';

export class JobQueueService {
  private pendingJobIds: string[] = [];
  private processingCount = 0;
  private started = false;

  constructor() {
    this.load();
  }

  private load() {
    const state = persistenceService.readState();
    this.pendingJobIds = state.queue.pendingJobIds ?? [];
  }

  private persist() {
    const state = persistenceService.readState();
    persistenceService.writeState({
      ...state,
      queue: {
        pendingJobIds: this.pendingJobIds,
      },
    });
  }

  start() {
    if (this.started) return;
    this.started = true;

    const resumableJobs = jobStoreService
      .getJobsByStatus(['queued', 'preprocessing', 'ocr_running', 'ai_extracting'])
      .map((job) => job.jobId);

    for (const jobId of resumableJobs) {
      if (!this.pendingJobIds.includes(jobId)) {
        this.pendingJobIds.push(jobId);
      }
    }

    this.persist();
    this.drain();
  }

  enqueue(jobId: string) {
    if (!this.pendingJobIds.includes(jobId)) {
      this.pendingJobIds.push(jobId);
      this.persist();
    }
    this.drain();
  }

  private async drain() {
    while (this.processingCount < config.queueConcurrency && this.pendingJobIds.length > 0) {
      const jobId = this.pendingJobIds.shift();
      this.persist();

      if (!jobId) {
        return;
      }

      this.processingCount += 1;

      jobRunnerService
        .process(jobId)
        .catch((error) => {
          const message = error instanceof Error ? error.message : 'Unexpected queue worker error';
          jobStoreService.failJob(jobId, message);
        })
        .finally(() => {
          this.processingCount -= 1;
          this.drain();
        });
    }
  }
}

export const jobQueueService = new JobQueueService();
