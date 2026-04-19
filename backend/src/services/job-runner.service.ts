import { extractionPipelineService } from './extraction/pipeline.service';
import { jobStoreService } from './job-store.service';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class JobRunnerService {
  async process(jobId: string): Promise<void> {
    const job = jobStoreService.getJob(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    const upload = jobStoreService.getUpload(job.uploadId);
    if (!upload) {
      throw new Error('Upload not found');
    }

    jobStoreService.updateJob(jobId, {
      status: 'preprocessing',
      progress: 10,
      stageMessage: 'Preparing document for processing',
      errorMessage: undefined,
    });

    await sleep(300);

    const normalized = await extractionPipelineService.processImage(upload.path, {
      onPreprocessing: async () => {
        jobStoreService.updateJob(jobId, {
          status: 'preprocessing',
          progress: 20,
          stageMessage: 'Optimizing document image',
        });
        await sleep(300);
      },
      onOCRRunning: async () => {
        jobStoreService.updateJob(jobId, {
          status: 'ocr_running',
          progress: 55,
          stageMessage: 'Extracting text from document',
        });
        await sleep(300);
      },
      onAIExtracting: async () => {
        jobStoreService.updateJob(jobId, {
          status: 'ai_extracting',
          progress: 80,
          stageMessage: 'Structuring document using AI',
        });
        await sleep(300);
      },
    });

    jobStoreService.setJobResult(jobId, {
      jobId,
      ...normalized,
      confidence: 0.88,
      warnings: [],
    });
  }
}

export const jobRunnerService = new JobRunnerService();
