'use client'
import Link from 'next/link'
import { useState } from 'react'
import LangSwitch from './LangSwitch'

type Lang = 'en' | 'ukr' | 'ru'

export default function Header({
  lang,
  settings,
}: {
  lang: Lang;
  settings: any;
}) {
  const [open, setOpen] = useState(false)
  const nav = settings.nav || {}

  const desktopLinks = [
    { label: nav.workWithMe || 'Work With Me', href: `/${lang}/work-with-me` },
    { label: nav.services || 'Services', href: `/${lang}/services` },
    { label: nav.blog || 'Blog', href: `/${lang}/blog` },
    { label: nav.contact || 'Contact', href: `/${lang}/contact` },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        {/* Logo + Name */}
        <Link
          href={`/${lang}`}
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-800"
        >
          <div className="h-9 w-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-semibold overflow-hidden">
            {settings.logo?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logo.url}
                alt={settings.logo.alt || 'Logo'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>KO</span>
            )}
          </div>
          <div className="leading-tight">
            <div className="font-semibold">{settings.practiceName}</div>
            <div className="text-xs text-zinc-500">
              {settings.practiceTitle}
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {desktopLinks.map(link => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}

          {/* CTA always goes to Contact page */}
          <Link
            href={`/${lang}/contact`}
            className="inline-block rounded-full px-4 py-2 border border-zinc-900 hover:bg-zinc-900 hover:text-white"
          >
            {nav.cta || 'Book Now'}
          </Link>

          <LangSwitch lang={lang} />
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-800"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            {open ? (
              <path
                fillRule="evenodd"
                d="M6.75 5.75a.75.75 0 0 1 1.5 0v12.5a.75.75 0 0 1-1.5 0V5.75Zm9 0a.75.75 0 0 1 1.5 0v12.5a.75.75 0 0 1-1.5 0V5.75Z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3.75 6.75h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Zm16.5 6H3.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5Zm0 6H3.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5Z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-[max-height] duration-300 overflow-hidden border-t ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 space-y-3">
          <nav className="flex flex-col gap-2 text-sm">
            {desktopLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={`/${lang}/contact`}
              onClick={() => setOpen(false)}
              className="inline-block rounded-full px-4 py-2 border border-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              {nav.cta || 'Book Now'}
            </Link>
          </nav>
          <div className="pt-2 border-t">
            <LangSwitch lang={lang} />
          </div>
        </div>
      </div>
    </header>
  )
}
