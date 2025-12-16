import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProductStore = create(
    (set, get) => ({
      product: [],
      setProduct: (product) => set({ product }),
    }),
  
);