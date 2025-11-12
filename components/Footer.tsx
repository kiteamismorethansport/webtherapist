export default function Footer({ lang, settings }: { lang: 'en'|'ru'|'ukr', settings: any }) {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 text-xs text-zinc-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} {settings.practiceName}. All rights reserved.</div>
        <nav className="flex gap-4">
          <a href="#" className="underline">Privacy</a>
          <a href="#" className="underline">Accessibility</a>
          <a href="#" className="underline">Terms</a>
        </nav>
      </div>
    </footer>
  )
}
