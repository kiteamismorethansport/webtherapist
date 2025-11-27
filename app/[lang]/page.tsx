import { loadSettings } from '@/lib/settings'
import { loadPage } from '@/lib/pages'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function Home({ params }: { params: { lang: 'en'|'ru'|'ukr' } }) {
  const settings = await loadSettings(params.lang)
  const page = await loadPage('home', params.lang)

  return (
    <main>
      <section className="bg-gradient-to-b from-zinc-50 to-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif leading-tight">{page.hero.heading}</h1>
            <p className="mt-4 text-zinc-600 max-w-prose">{page.hero.sub}</p>
            <div className="mt-8 flex gap-3">
              <Link href={`/${params.lang}/contact`} className="rounded-full px-5 py-3 border border-zinc-900 hover:bg-zinc-900 hover:text-white">
                {settings.nav.cta}
              </Link>
              <Link href={`/${params.lang}/services`} className="rounded-full px-5 py-3 border hover:bg-zinc-100">
                {settings.nav.services}
              </Link>
            </div>
            {page.address && (
              <p className="mt-6 text-xs text-zinc-500">{page.address}</p>
            )}
          </div>
          <div
            className="aspect-video rounded-2xl bg-[url('/images/placeholder-hero.jpg')] bg-cover bg-center shadow-md"
            aria-label="Therapy office"
          />
        </div>
      </section>

      <section className="scroll-mt-24">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            {settings.nav.workWithMe}
          </h2>
          <article className="prose max-w-none">
            <MDXRemote source={page.body} />
          </article>
        </div>
      </section>
    </main>
  )
}
