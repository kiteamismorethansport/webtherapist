// app/[lang]/blog/[slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ImgHTMLAttributes } from 'react';

import { loadPost, type Lang } from '@/lib/posts';

type Params = {
  params: { lang: Lang; slug: string };
};

// Custom <img> so that "111.jpg" -> "/images/111.jpg"
const mdxComponents = {
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    const src = props.src ?? '';
    const fixedSrc = src.startsWith('/') ? src : `/images/${src}`;
    return <img {...props} src={fixedSrc} />;
  },
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
            <p className="mt-2 text-sm text-zinc-500">{post.date}</p>
          )}
        </div>
      </section>

      {/* Body aligned with heading + footer */}
      <section>
        <div className="mx-auto max-w-4xl px-4 py-10">
          <article className="prose max-w-none">
            <MDXRemote source={post.body} components={mdxComponents} />
          </article>
        </div>
      </section>
    </main>
  );
}
