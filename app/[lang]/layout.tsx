import type { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { loadSettings } from '@/lib/settings'

export const dynamic = 'force-static'

export default async function LangLayout({ params, children }: { params: { lang: 'en'|'ru'|'ukr' }, children: ReactNode }) {
  const settings = await loadSettings(params.lang)
  return (
    <section>
      <Header lang={params.lang} settings={settings} />
      {children}
      <Footer lang={params.lang} settings={settings} />
    </section>
  )
}
