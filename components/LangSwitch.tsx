'use client'
import Link from 'next/link'

export default function LangSwitch({ lang }: { lang: 'en'|'ru'|'uk' }) {
  const langs: Array<'en'|'ru'|'uk'> = ['en','ru','uk']
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      {langs.map(l => (
        <Link key={l} href={`/${l}`} aria-current={lang===l ? 'page' : undefined} className={`px-2 py-1 rounded ${lang===l ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'}`}>
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}
