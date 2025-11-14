// lib/pages.ts
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

type Lang = 'en' | 'ukr' | 'ru';

export type PageData = {
  slug: string;
  lang: Lang;
  title: string;
  hero: {
    heading: string;
    sub?: string;
  };
  body: string;
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    noindex?: boolean;
  };
};

export async function loadPageBySlug(slug: string, lang: Lang): Promise<PageData> {
  const file = path.join(process.cwd(), 'content', 'pages', `${slug}.${lang}.mdx`);

  const raw = await fs.readFile(file, 'utf8');
  const { data, content } = matter(raw);

  const title = (data as any)?.title || slug;
  const heroData = (data as any)?.hero || {};
  const hero = {
    heading: heroData.heading || title,
    sub: heroData.sub || '',
  };

  const seo = (data as any)?.seo || {};

  return {
    slug,
    lang,
    title,
    hero,
    body: content,
    seo,
  };
}
