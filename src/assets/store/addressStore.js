import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAddressStore = create(

    persist(
    (set, get) => ({
      address: "",
      isAddressMap:false,
      setAddress: (address) => set({ address }),
        setIsAddressMap: (isAddressMap) => set({ isAddressMap }),
    }),
)
  
);