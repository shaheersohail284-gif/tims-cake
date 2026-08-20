'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  cakeId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (cakeId: string) => void;
  updateQuantity: (cakeId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.cakeId === item.cakeId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.cakeId === item.cakeId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (cakeId) => {
        set({ items: get().items.filter((i) => i.cakeId !== cakeId) });
      },
      updateQuantity: (cakeId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.cakeId !== cakeId) });
        } else {
          set({
            items: get().items.map((i) =>
              i.cakeId === cakeId ? { ...i, quantity } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'timscake-cart',
    }
  )
);
