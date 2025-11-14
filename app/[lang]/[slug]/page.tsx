import { loadPageBySlug } from '@/lib/pages';
import { MDXRemote } from 'next-mdx-remote/rsc';

type Lang = 'en' | 'ukr' | 'ru';

export const dynamic = 'force-static';

export function generateStaticParams() {
  const langs: Lang[] = ['en', 'ukr', 'ru'];
  const slugs = ['work-with-me', 'services']; // we ONLY handle these here

  return langs.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export default async function Page({
  params,
}: {
  params: { lang: Lang; slug: string };
}) {
  const { lang, slug } = params;

  // If someone tries /ukr/whatever, we don't want to crash build
  if (!['work-with-me', 'services'].includes(slug)) {
    // Let Next.js show its 404
    // (or you could throw new Error, but 404 is nicer)
    return null as any;
  }

  const page = await loadPageBySlug(slug, lang);

  return (
    <main>
      <section className="bg-gradient-to-b from-zinc-50 to-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-serif leading-tight">
            {page.hero.heading}
          </h1>
          {page.hero.sub ? (
            <p className="mt-2 text-zinc-600 max-w-prose">{page.hero.sub}</p>
          ) : null}
        </div>
      </section>

      <section className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-10 prose max-w-none">
          <MDXRemote source={page.body} />
        </div>
      </section>
    </main>
  );
}
