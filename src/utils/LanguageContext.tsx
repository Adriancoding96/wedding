import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Lang = 'en' | 'sv'

interface LanguageContextValue {
  lang: Lang
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  toggleLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const toggleLang = () => setLang(l => (l === 'en' ? 'sv' : 'en'))
  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
