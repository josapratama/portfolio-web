import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Lang = 'en' | 'id'

interface LanguageState {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'lang-storage' }
  )
)
