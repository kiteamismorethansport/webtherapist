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

  if (!['work-with-me', 'services'].includes(slug)) {
    return null as any; // 404 handled by Next
  }

  const page = await loadPageBySlug(slug, lang);

  return (
    <main>
      {/* Heading – same width as blog post */}
      <section className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-serif leading-tight">
            {page.hero.heading}
          </h1>
          {page.hero.sub ? (
            <p className="mt-2 text-sm text-zinc-500">{page.hero.sub}</p>
          ) : null}
        </div>
      </section>

      {/* Body – aligned with heading */}
      <section>
        <div className="mx-auto max-w-4xl px-4 py-10">
          <article className="prose max-w-none">
            <MDXRemote source={page.body} />
          </article>
        </div>
      </section>
    </main>
  );
}

