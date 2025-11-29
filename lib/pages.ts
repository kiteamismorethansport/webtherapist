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

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

async function parsePageFile(filePath: string, lang: Lang): Promise<Page> {
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as PageFrontmatter;
  const hero = fm.hero || {};

  const fileName = path.basename(filePath);
  const base = fileName.replace(new RegExp(`\\.${lang}\\.mdx$`), '');

  return {
    slug: fm.slug || base,
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

async function readPageBySlug(slug: string, lang: Lang): Promise<Page> {
  const directPath = path.join(PAGES_DIR, `${slug}.${lang}.mdx`);

  // 1) Try old behaviour: filename == slug (home.en.mdx, blog.ru.mdx, etc.)
  try {
    await fs.access(directPath);
    return parsePageFile(directPath, lang);
  } catch {
    // file doesn't exist -> fall back to scanning
  }

  // 2) Fallback: scan all files, match by frontmatter.slug
  const files = await fs.readdir(PAGES_DIR);
  const suffix = `.${lang}.mdx`;

  for (const file of files) {
    if (!file.endsWith(suffix)) continue;

    const page = await parsePageFile(path.join(PAGES_DIR, file), lang);
    if (page.slug === slug) {
      return page;
    }
  }

  throw new Error(`Page not found for slug "${slug}" and lang "${lang}"`);
}

/** Home page loader: `loadPage('home', lang)` */
export async function loadPage(slug: string, lang: Lang): Promise<Page> {
  return readPageBySlug(slug, lang);
}

/** Generic page loader for /[lang]/[slug] routes */
export async function loadPageBySlug(
  slug: string,
  lang: Lang
): Promise<Page> {
  return readPageBySlug(slug, lang);
}
