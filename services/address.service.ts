import { apiClient } from '../lib/api-client';

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  label: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  label?: string;
  isDefault?: boolean;
}

export class AddressService {
  static async getAddresses() {
    const res = await apiClient.get<{ success: boolean; data: Address[] }>('/addresses');
    return res.data.data;
  }

  static async createAddress(data: AddressFormData) {
    const res = await apiClient.post<{ success: boolean; data: Address; message: string }>('/addresses', data);
    return res.data;
  }

  static async updateAddress(id: string, data: Partial<AddressFormData>) {
    const res = await apiClient.put<{ success: boolean; data: Address; message: string }>(`/addresses/${id}`, data);
    return res.data;
  }

  static async deleteAddress(id: string) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/addresses/${id}`);
    return res.data;
  }

  static async setDefault(id: string) {
    const res = await apiClient.patch<{ success: boolean; data: Address; message: string }>(`/addresses/${id}/default`);
    return res.data;
  }
}
