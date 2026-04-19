import { FastifyReply, FastifyRequest } from 'fastify';
import { saveUpload } from '../services/storageService.js';

export async function uploadFileController(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();

  if (!file) {
    return reply.status(400).send({ message: 'File is required' });
  }

  const chunks: Buffer[] = [];
  for await (const chunk of file.file) {
    chunks.push(chunk as Buffer);
  }

  const buffer = Buffer.concat(chunks);

  const upload = await saveUpload({
    fileName: file.filename,
    mimeType: file.mimetype,
    sizeBytes: buffer.byteLength,
  });

  return reply.send(upload);
}
