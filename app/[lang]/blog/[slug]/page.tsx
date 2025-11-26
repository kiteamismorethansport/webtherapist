import { loadPost } from '@/lib/posts';
import type { Lang } from '@/lib/posts';

type Params = {
  params: { lang: Lang; slug: string };
};

export default async function BlogPostPage({ params }: Params) {
  const { lang, slug } = params;
  const post = await loadPost(slug, lang);

  return (
    <main>
      {/* Heading + meta */}
      <section className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-serif">{post.title}</h1>
          {post.date && (
            <p className="mt-2 text-sm text-zinc-500">
              {post.date}
            </p>
          )}
        </div>
      </section>

      {/* Body aligned with heading + footer */}
      <section>
        <div className="mx-auto max-w-4xl px-4 py-10">
          <article className="prose max-w-none">
            {/* simple markdown-ish rendering; if you later switch to MDX, replace this */}
            {post.body.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </article>
        </div>
      </section>
    </main>
  );
}
