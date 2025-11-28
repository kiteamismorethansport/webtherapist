import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

type Lang = 'en' | 'ru' | 'ukr';

export type Page = {
  slug: string;
  lang: Lang;
  title: string;
  hero: {
    heading: string;
    sub?: string;
    image?: string;
  };
  body: string;
  address?: string;
};

type PageFrontmatter = {
  slug?: string;
  title?: string;
  hero?: {
    heading?: string;
    sub?: string;
    image?: string;
  };
  address?: string;
};

/**
 * Helper to read a page MDX file like `content/pages/<fileSlug>.<lang>.mdx`
 */
async function readPageFile(fileSlug: string, lang: Lang): Promise<Page> {
  const filePath = path.join(
    process.cwd(),
    'content',
    'pages',
    `${fileSlug}.${lang}.mdx`
  );

  const raw = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as PageFrontmatter;
  const hero = fm.hero || {};

  return {
    slug: fm.slug || fileSlug,
    lang,
    title: fm.title || '',
    hero: {
      heading: hero.heading || '',
      sub: hero.sub,
      image: hero.image,
    },
    body: content,
    address: fm.address,
  };
}

/** Home page loader: `loadPage('home', lang)` */
export async function loadPage(slug: string, lang: Lang): Promise<Page> {
  return readPageFile(slug, lang);
}

/** Generic page loader for /[lang]/[slug] routes */
export async function loadPageBySlug(
  slug: string,
  lang: Lang
): Promise<Page> {
  return readPageFile(slug, lang);
}
