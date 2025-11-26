import { loadPageBySlug } from '@/lib/pages';
import { listPosts, type Lang } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

export const dynamic = 'force-static';

export default async function BlogIndex({
  params,
}: {
  params: { lang: Lang };
}) {
  const { lang } = params;

  // CMS page for the blog index (title, subtitle, intro text)
  const page = await loadPageBySlug('blog', lang);

  // Already sorted newest-first in lib/posts
  const posts = await listPosts(lang);

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

      {/* Intro body + list of posts – aligned with heading */}
      <section>
        <div className="mx-auto max-w-4xl px-4 py-10">
          {/* Intro text from MDX */}
          <article className="prose max-w-none mb-10">
            <MDXRemote source={page.body} />
          </article>

          {/* Posts list */}
          <div className="divide-y">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${lang}/blog/${post.slug}`}
                className="block py-4 hover:bg-zinc-50 -mx-3 px-3 rounded-lg transition"
              >
                <div className="font-semibold">{post.title}</div>
                {post.date && (
                  <div className="mt-1 text-xs text-zinc-500">{post.date}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
