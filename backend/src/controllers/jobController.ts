import { FastifyReply, FastifyRequest } from 'fastify';
import { createJob, getJob, retryJob } from '../services/jobService.js';

export async function createJobController(
  request: FastifyRequest<{ Body: { uploadId?: string } }>,
  reply: FastifyReply,
) {
  const { uploadId } = request.body || {};

  if (!uploadId) {
    return reply.status(400).send({ message: 'uploadId is required' });
  }

  try {
    const job = createJob(uploadId);
    return reply.status(201).send({
      jobId: job.jobId,
      status: job.status,
    });
  } catch (error) {
    return reply.status(404).send({
      message: error instanceof Error ? error.message : 'Could not create job',
    });
  }
}

export async function getJobController(
  request: FastifyRequest<{ Params: { jobId: string } }>,
  reply: FastifyReply,
) {
  const job = getJob(request.params.jobId);

  if (!job) {
    return reply.status(404).send({ message: 'Job not found' });
  }

  return reply.send({
    jobId: job.jobId,
    status: job.status,
    progress: job.progress,
    stageMessage: job.stageMessage,
    errorMessage: job.errorMessage,
  });
}

export async function getJobResultController(
  request: FastifyRequest<{ Params: { jobId: string } }>,
  reply: FastifyReply,
) {
  const job = getJob(request.params.jobId);

  if (!job) {
    return reply.status(404).send({ message: 'Job not found' });
  }

  if (job.status !== 'completed' || !job.result) {
    return reply.status(409).send({ message: 'Job result is not ready yet' });
  }

  return reply.send(job.result);
}

export async function retryJobController(
  request: FastifyRequest<{ Params: { jobId: string } }>,
  reply: FastifyReply,
) {
  try {
    const job = retryJob(request.params.jobId);
    return reply.send({
      jobId: job.jobId,
      status: job.status,
    });
  } catch (error) {
    return reply.status(404).send({
      message: error instanceof Error ? error.message : 'Could not retry job',
    });
  }
}
