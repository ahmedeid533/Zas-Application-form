import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLangStore = create(
  persist(
    (set, get) => ({

        lang: 'EN',
        setLang: (lang) => set({ lang }),
        toggleLang: () => set({ lang: get().lang === 'AR' ? 'EN' : 'AR' }),
     
    }),
  )
);