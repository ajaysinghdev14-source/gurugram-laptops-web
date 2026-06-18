import { apiClient } from '../lib/api-client';

export interface CartItem {
  id?: string; // Optional because local items might not have an ID yet
  productId: string;
  variantName?: string;
  quantity: number;
  product?: {
    id: string;
    title: string;
    basePrice: number;
    images?: string[];
    variants?: { name: string; price: number }[];
    inStock: boolean;
  }; // To store populated product details
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export class CartService {
  static async getCart() {
    const res = await apiClient.get<{ success: boolean; data: Cart }>('/cart');
    return res.data;
  }

  static async addItem(data: { productId: string; quantity: number; variantName?: string }) {
    const res = await apiClient.post<{ success: boolean; data: CartItem }>('/cart/items', data);
    return res.data;
  }

  static async updateQuantity(cartItemId: string, quantity: number) {
    const res = await apiClient.put<{ success: boolean; data: CartItem }>(`/cart/items/${cartItemId}`, { quantity });
    return res.data;
  }

  static async removeItem(cartItemId: string) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/cart/items/${cartItemId}`);
    return res.data;
  }

  static async syncCart(items: CartItem[]) {
    // Strip out the fully populated product object to keep payload lightweight
    const payload = items.map(i => ({
      productId: i.productId,
      quantity: i.quantity,
      variantName: i.variantName
    }));
    const res = await apiClient.post<{ success: boolean; data: Cart }>('/cart/sync', { items: payload });
    return res.data;
  }
}
