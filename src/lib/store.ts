'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PriceOption {
  weight: string;
  price: number;
}

export interface CartItem {
  cakeId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (cakeId: string, weight: string) => void;
  updateQuantity: (cakeId: string, weight: string, quantity: number) => void;
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
        const existing = items.find(
          (i) => i.cakeId === item.cakeId && i.weight === item.weight
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.cakeId === item.cakeId && i.weight === item.weight
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (cakeId, weight) => {
        set({
          items: get().items.filter(
            (i) => !(i.cakeId === cakeId && i.weight === weight)
          ),
        });
      },
      updateQuantity: (cakeId, weight, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter(
              (i) => !(i.cakeId === cakeId && i.weight === weight)
            ),
          });
        } else {
          set({
            items: get().items.map((i) =>
              i.cakeId === cakeId && i.weight === weight
                ? { ...i, quantity }
                : i
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
