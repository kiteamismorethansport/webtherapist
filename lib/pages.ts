// lib/pages.ts
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type Lang = 'en' | 'ukr' | 'ru';

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

// Generic loader by slug: used for /[lang]/work-with-me, /[lang]/services, etc.
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

// Backwards-compatible helper used by app/[lang]/page.tsx for the HOME page
// It returns the same shape that Home expects: { hero, address, ... }.
export async function loadPage(slug: string, lang: Lang): Promise<any> {
  // For now we only really use this for "home"
  const page = await loadPageBySlug(slug, lang).catch(() => {
    // Fallback in case home.<lang>.mdx is missing
    return {
      slug,
      lang,
      title: 'Home',
      hero: {
        heading: 'Evidence-based therapy with warmth and clarity.',
        sub: 'Individual counseling online and in person.',
      },
      body: '',
      seo: {},
    } as PageData;
  });

  // Address text like we had originally
  const address =
    lang === 'ru'
      ? 'Киев • Онлайн по всему миру'
      : lang === 'ukr'
      ? 'Київ • Онлайн по всьому світу'
      : 'Kyiv • Online Worldwide';

  return {
    ...page,
    address,
  };
}
