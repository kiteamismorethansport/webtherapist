import Link from 'next/link';
import { listPosts } from '@/lib/posts';
import { loadPageBySlug, type Lang } from '@/lib/pages';
import { MDXRemote } from 'next-mdx-remote/rsc';

export function generateStaticParams() {
  const langs: Lang[] = ['en', 'ukr', 'ru'];
  return langs.map((lang) => ({ lang }));
}

export const dynamic = 'force-static';

export default async function BlogIndex({
  params,
}: {
  params: { lang: Lang };
}) {
  const { lang } = params;

  // Load localized hero + intro from blog.<lang>.mdx
  const page = await loadPageBySlug('blog', lang).catch(() => null);

  // Load posts for this language
  const posts = await listPosts(lang);

  return (
    <main>
      <section className="bg-gradient-to-b from-zinc-50 to-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-serif leading-tight">
            {page?.hero.heading ?? (lang === 'ru'
              ? 'Блог'
              : lang === 'ukr'
              ? 'Блог'
              : 'Blog')}
          </h1>
          {page?.hero.sub ? (
            <p className="mt-2 text-zinc-600 max-w-prose">{page.hero.sub}</p>
          ) : (
            <p className="mt-2 text-zinc-600 max-w-prose">
              {lang === 'ru'
                ? 'Последние статьи и обновления.'
                : lang === 'ukr'
                ? 'Останні статті та оновлення.'
                : 'Latest posts and updates.'}
            </p>
          )}
        </div>
      </section>

      {page?.body && (
        <section>
          <div className="mx-auto max-w-6xl px-4 py-10 prose max-w-none">
            <MDXRemote source={page.body} />
          </div>
        </section>
      )}

      <section>
        <div className="mx-auto max-w-6xl px-4 py-10">
          {posts.length === 0 ? (
            <p className="text-zinc-500">
              {lang === 'ru'
                ? 'Пока нет опубликованных записей.'
                : lang === 'ukr'
                ? 'Поки немає опублікованих дописів.'
                : 'No posts yet.'}
            </p>
          ) : (
            <ul className="space-y-6">
              {posts.map((p) => (
                <li key={p.slug} className="border-b pb-6">
                  <h2 className="text-xl font-semibold">
                    <Link
                      href={`/${lang}/blog/${p.slug}`}
                      className="hover:underline"
                    >
                      {p.title}
                    </Link>
                  </h2>
                  {p.date ? (
                    <div className="text-xs text-zinc-500 mt-1">{p.date}</div>
                  ) : null}
                  {p.description ? (
                    <p className="mt-2 text-zinc-600">{p.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
