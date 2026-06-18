import { apiClient } from '../lib/api-client';

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
  };
}

export class UploadService {
  public static async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post<UploadResponse>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}
