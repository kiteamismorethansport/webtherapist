// app/[lang]/blog/[slug]/page.tsx
import { loadPost } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';

export default async function BlogPost({
  params,
}: {
  params: { lang: 'en' | 'ukr' | 'ru'; slug: string };
}) {
  const post = await loadPost(params.slug, params.lang);

  return (
    <main>
      <section className="bg-gradient-to-b from-zinc-50 to-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-serif leading-tight">{post.title}</h1>
          {post.date ? <div className="text-xs text-zinc-500 mt-2">{post.date}</div> : null}
          {post.description ? (
            <p className="mt-2 text-zinc-600 max-w-prose">{post.description}</p>
          ) : null}
        </div>
      </section>

      <section className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-10 prose max-w-none">
          <MDXRemote source={post.body} />
        </div>
      </section>
    </main>
  );
}
