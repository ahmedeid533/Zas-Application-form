import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useScreenViewStore = create(
  persist((set, get) => ({
    navBarHeight: 0,
    footerHeight:0,
    screen: "desktop",
    setScreen: (screen) => set({ screen }),
    setNavBarHeight: (navBarHeight) => set({ navBarHeight }),
    setFooterHeight: (footerHeight) => set({ footerHeight }),
  }))
);