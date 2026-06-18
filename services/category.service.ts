import { apiClient } from '../lib/api-client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  data: unknown;
  message?: string;
}

export class CategoryService {
  public static async getAllCategories(): Promise<CategoryResponse> {
    const response = await apiClient.get<CategoryResponse>('/categories');
    return response.data;
  }

  public static async createCategory(data: { name: string }): Promise<CategoryResponse> {
    const response = await apiClient.post<CategoryResponse>('/categories', data);
    return response.data;
  }

  public static async deleteCategory(id: string): Promise<CategoryResponse> {
    const response = await apiClient.delete<CategoryResponse>(`/categories/${id}`);
    return response.data;
  }
}
