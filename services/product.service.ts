import { apiClient } from '../lib/api-client';

export interface ProductResponse {
  success: boolean;
  data: unknown;
}

export class ProductService {
  public static async createProduct(data: unknown): Promise<ProductResponse> {
    const response = await apiClient.post<ProductResponse>('/products', data);
    return response.data;
  }

  public static async getAllProducts(): Promise<ProductResponse> {
    const response = await apiClient.get<ProductResponse>('/products');
    return response.data;
  }

  public static async getProductById(id: string): Promise<ProductResponse> {
    const response = await apiClient.get<ProductResponse>(`/products/${id}`);
    return response.data;
  }

  public static async updateProduct(id: string, data: unknown): Promise<ProductResponse> {
    const response = await apiClient.put<ProductResponse>(`/products/${id}`, data);
    return response.data;
  }

  public static async deleteProduct(id: string): Promise<ProductResponse> {
    const response = await apiClient.delete<ProductResponse>(`/products/${id}`);
    return response.data;
  }
}
