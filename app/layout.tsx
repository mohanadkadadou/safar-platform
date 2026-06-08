'use client'

import './globals.css'
import { createContext, useContext, useState, useCallback } from 'react'
import type { Lang } from '@/types'
import { translations } from '@/lib/translations'
import type { TKey } from '@/lib/translations'

interface LangCtx {
  lang: Lang
  t: (key: TKey) => string
  toggleLang: () => void
  dir: 'ltr' | 'rtl'
}
const LangContext = createContext<LangCtx>({
  lang: 'en',
  t: (k) => translations.en[k] as string,
  toggleLang: () => {},
  dir: 'ltr',
})
export const useLang = () => useContext(LangContext)

interface AuthCtx { isAdmin: boolean; setAdmin: (v: boolean) => void }
const AuthContext = createContext<AuthCtx>({ isAdmin: false, setAdmin: () => {} })
export const useAuth = () => useContext(AuthContext)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const [isAdmin, setAdmin] = useState(false)

  const toggleLang = useCallback(() => setLang(l => l === 'en' ? 'ar' : 'en'), [])

  const t = useCallback((key: TKey): string => {
    const val = translations[lang][key] as unknown
    if (Array.isArray(val)) return val.join(',')
    return String(val ?? translations.en[key] ?? key)
  }, [lang])

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Safar — سفر | Event & Trip Platform</title>
        <meta name="description" content="Premium event and trip management platform" />
      </head>
      <body dir={dir} suppressHydrationWarning>
        <AuthContext.Provider value={{ isAdmin, setAdmin }}>
          <LangContext.Provider value={{ lang, t, toggleLang, dir }}>
            {children}
          </LangContext.Provider>
        </AuthContext.Provider>
      </body>
    </html>
  )
}
