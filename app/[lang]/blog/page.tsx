import Link from 'next/link';
import { listPosts } from '@/lib/posts';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ukr' }, { lang: 'ru' }];
}

export const dynamic = 'force-static';

export default async function BlogIndex({ params }: { params: { lang: 'en'|'ukr'|'ru' } }) {
  const posts = await listPosts(params.lang);

  return (
    <main>
      <section className="bg-gradient-to-b from-zinc-50 to-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-serif leading-tight">Blog</h1>
          <p className="mt-2 text-zinc-600">Latest posts and updates</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-10">
          {posts.length === 0 ? (
            <p className="text-zinc-500">No posts yet.</p>
          ) : (
            <ul className="space-y-6">
              {posts.map((p) => (
                <li key={p.slug} className="border-b pb-6">
                  <h2 className="text-xl font-semibold">
                    <Link href={`/${params.lang}/blog/${p.slug}`} className="hover:underline">
                      {p.title}
                    </Link>
                  </h2>
                  {p.date ? <div className="text-xs text-zinc-500 mt-1">{p.date}</div> : null}
                  {p.description ? <p className="mt-2 text-zinc-600">{p.description}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
