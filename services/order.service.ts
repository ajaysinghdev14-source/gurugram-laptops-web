import { apiClient } from '../lib/api-client';

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantName?: string | null;
  quantity: number;
  price: string;
  createdAt: string;
  product?: {
    id: string;
    title: string;
    images: string[];
  };
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: string;
  status: string;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export class OrderService {
  static async createOrder(shippingAddress: ShippingAddress) {
    const res = await apiClient.post<{ success: boolean; data: Order; message: string }>('/orders/checkout', {
      shippingAddress,
    });
    return res.data;
  }

  static async getMyOrders() {
    const res = await apiClient.get<{ success: boolean; data: Order[] }>('/orders/my-orders');
    return res.data.data;
  }

  static async getAllOrders() {
    const res = await apiClient.get<{ success: boolean; data: Order[] }>('/orders');
    return res.data.data;
  }

  static async updateOrderStatus(orderId: string, status: string) {
    const res = await apiClient.patch<{ success: boolean; data: Order; message: string }>(`/orders/${orderId}/status`, {
      status,
    });
    return res.data;
  }
}
