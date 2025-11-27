import { loadPageBySlug } from '@/lib/pages';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

type Lang = 'en' | 'ukr' | 'ru';

export const dynamic = 'force-static';

// We still prebuild the two main pages for speed,
// but *any* other slug will also work at runtime if an MDX file exists.
export function generateStaticParams() {
  const langs: Lang[] = ['en', 'ukr', 'ru'];
  const slugs = ['work-with-me', 'services'];

  return langs.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export default async function Page({
  params,
}: {
  params: { lang: Lang; slug: string };
}) {
  const { lang, slug } = params;

  let page;
  try {
    page = await loadPageBySlug(slug, lang);
  } catch (e) {
    // If there is no MDX file for this slug, show 404
    notFound();
  }

  return (
    <main>
      {/* Heading – same layout as other inner pages */}
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
