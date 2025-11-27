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
  seo: {
    title?: string;
    description?: string;
    canonical?: string;
    noindex?: boolean;
  };
};

function pagesDir() {
  return path.join(process.cwd(), 'content', 'pages');
}

/**
 * Load a single page by its public slug (the one you type in Decap).
 * Works even if the actual filename is "-", "--1", etc.
 */
export async function loadPageBySlug(
  slug: string,
  lang: Lang,
): Promise<PageData> {
  const dir = pagesDir();
  let files: string[] = [];

  try {
    files = await fs.readdir(dir);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return {
        slug,
        lang,
        title: 'Page not found',
        hero: { heading: 'Page not found', sub: '' },
        body: 'This page could not be found.',
        seo: {},
      };
    }
    throw err;
  }

  const langSuffix = `.${lang}.mdx`;

  // handle the old "-" / "--1" style filenames:
  // we try both "slug" and "slug-" variants
  const candidates = Array.from(
    new Set([
      slug,
      slug.endsWith('-') ? slug.replace(/-+$/, '') : `${slug}-`,
    ]),
  );

  for (const file of files) {
    if (!file.endsWith(langSuffix)) continue;

    const fullPath = path.join(dir, file);

    try {
      const raw = await fs.readFile(fullPath, 'utf8');
      const { data, content } = matter(raw);

      const fileSlug = file.replace(langSuffix, '');
      const frontmatterSlug = (data as any)?.slug as string | undefined;
      const fmSlug =
        frontmatterSlug && frontmatterSlug.trim().length > 0
          ? frontmatterSlug.trim()
          : fileSlug;

      if (!candidates.includes(fmSlug)) continue;

      const title = ((data as any)?.title as string) || fmSlug;
      const heroData = (data as any)?.hero || {};
      const hero = {
        heading: heroData.heading || title,
        sub: heroData.sub || '',
      };
      const seo = (data as any)?.seo || {};

      return {
        slug: fmSlug,
        lang,
        title,
        hero,
        body: content,
        seo,
      };
    } catch {
      // if one file is broken, skip it and try the next
      continue;
    }
  }

  // nothing matched
  return {
    slug,
    lang,
    title: 'Page not found',
    hero: { heading: 'Page not found', sub: '' },
    body: 'This page could not be found.',
    seo: {},
  };
}

/**
 * Backwards-compatible helper for the HOME page
 * (used in app/[lang]/page.tsx).
 */
export async function loadPage(slug: string, lang: Lang): Promise<any> {
  // for now we only really use this for "home"
  const page = await loadPageBySlug(slug, lang).catch(() => {
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
