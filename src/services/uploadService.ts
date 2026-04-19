import { API_BASE_URL } from '../config/api';
import { UploadResponse } from '../types/api';

export async function uploadFile(imageUri: string): Promise<UploadResponse> {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const formData = new FormData();
  formData.append('file', blob, 'document.jpg');

  const res = await fetch(`${API_BASE_URL}/v1/uploads`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Upload failed');
  }

  return res.json();
}
