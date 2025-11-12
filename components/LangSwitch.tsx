'use client'
import Link from 'next/link'

export default function LangSwitch({ lang }: { lang: 'en'|'ru'|'ukr' }) {
const langs: Array<{ code: 'en'|'uk'|'ru'; label: string }> = [
{ code: 'en', label: 'ENG' },
{ code: 'uk', label: 'UKR' },
{ code: 'ru', label: 'RUS' }
]
return ( <div className="flex items-center gap-2 text-xs font-medium">
{langs.map(({ code, label }) => (
<Link
key={code}
href={`/${code}`}
aria-current={lang === code ? 'page' : undefined}
className={`px-2 py-1 rounded ${lang === code ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'}`}
>
{label} </Link>
))} </div>
)
}

