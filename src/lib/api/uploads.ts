import { tokenStorage } from '@/lib/auth/token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
}

// Change this if your backend route differs.
const UPLOAD_PATH = '/uploads/image';

export type UploadImageType = 'profile' | 'event';

export interface UploadImageResponse {
  url: string;
  publicId?: string;
}

export async function uploadImage(
  file: File,
  type: UploadImageType
): Promise<UploadImageResponse> {
  const token = tokenStorage.get();

  if (!token) {
    throw new Error('You must be logged in to upload images.');
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}${UPLOAD_PATH}?type=${type}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Image upload failed');
  }

  if (!data?.url || typeof data.url !== 'string') {
    throw new Error('Upload succeeded but no image URL was returned.');
  }

  return data as UploadImageResponse;
}