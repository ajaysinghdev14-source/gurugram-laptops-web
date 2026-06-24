import { apiClient } from '../lib/api-client';

export interface AdminUser {
  id: string;
  fullName: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED';
  isEmailVerified: boolean;
  createdAt: string;
}

export class AdminService {
  public static async getAllUsers(): Promise<AdminUser[]> {
    const response = await apiClient.get('/admin/users');
    return response.data.data;
  }

  public static async updateUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<void> {
    await apiClient.patch(`/admin/users/${userId}/role`, { role });
  }

  public static async updateUserStatus(userId: string, status: 'ACTIVE' | 'BANNED'): Promise<void> {
    await apiClient.patch(`/admin/users/${userId}/status`, { status });
  }

  public static async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/admin/users/${userId}`);
  }
}
