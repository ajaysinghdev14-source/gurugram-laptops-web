import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartService, type CartItem } from '@/services/cart.service';
import { useAuthStore } from './auth.store';
import { toast } from 'sonner';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  syncLocalCart: () => Promise<void>;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      setIsOpen: (isOpen) => set({ isOpen }),

      fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;
        
        try {
          const res = await CartService.getCart();
          set({ items: res.data.items || [] });
        } catch (error) {
          console.error("Failed to fetch cart from backend", error);
        }
      },

      syncLocalCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        const items = get().items;
        if (!isAuthenticated || items.length === 0) return;

        try {
          const localItems = items.filter(i => !i.id || i.id.startsWith('local_'));
          if (localItems.length > 0) {
            // Push local items to backend
            const res = await CartService.syncCart(localItems);
            set({ items: res.data.items || [] });
          } else {
            await get().fetchCart();
          }
        } catch (error) {
          console.error("Failed to sync cart", error);
        }
      },

      addItem: async (item) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await CartService.addItem({
              productId: item.productId,
              quantity: item.quantity,
              variantName: item.variantName,
            });
            await get().fetchCart();
            toast.success("Added to cart");
          } catch (error) {
            console.error(error);
            toast.error("Failed to add to cart");
          }
        } else {
          // Local only
          set((state) => {
            const existing = state.items.find(i => i.productId === item.productId && i.variantName === item.variantName);
            if (existing) {
              return {
                items: state.items.map(i => 
                  (i.productId === item.productId && i.variantName === item.variantName) 
                  ? { ...i, quantity: i.quantity + item.quantity } 
                  : i
                )
              };
            }
            // Generate temporary ID for local items
            const localItem = { ...item, id: `local_${Date.now()}` };
            return { items: [...state.items, localItem] };
          });
          toast.success("Added to cart");
        }
      },

      removeItem: async (cartItemId) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated && !cartItemId.startsWith('local_')) {
          try {
            await CartService.removeItem(cartItemId);
            await get().fetchCart();
          } catch (error) {
            console.error(error);
            toast.error("Failed to remove item");
          }
        } else {
          set((state) => ({ items: state.items.filter(i => i.id !== cartItemId) }));
        }
      },

      updateQuantity: async (cartItemId, quantity) => {
        if (quantity <= 0) {
          return get().removeItem(cartItemId);
        }

        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated && !cartItemId.startsWith('local_')) {
          try {
            await CartService.updateQuantity(cartItemId, quantity);
            await get().fetchCart();
          } catch (error) {
            console.error(error);
            toast.error("Failed to update quantity");
          }
        } else {
          set((state) => ({
            items: state.items.map(i => i.id === cartItemId ? { ...i, quantity } : i)
          }));
        }
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => {
          // In a real app, you calculate from the populated product price
          // For now we'll sum it up later in the UI where products are populated, or backend returns totals
          const price = item.product?.variants?.find((v: { name: string; price: number }) => v.name === item.variantName)?.price 
                        || item.product?.basePrice 
                        || 0;
          return total + (price * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
