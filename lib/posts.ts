// lib/posts.ts
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type Lang = 'en' | 'ukr' | 'ru';

export type PostMeta = {
  slug: string;
  title: string;
  date?: string;
  description?: string;
};

export type LoadedPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  body: string;
};

function normalizeDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value;
  return undefined;
}

function postsDir() {
  return path.join(process.cwd(), 'content', 'posts');
}

// List posts for a given language, using frontmatter `slug` as canonical
export async function listPosts(lang: Lang): Promise<PostMeta[]> {
  const dir = postsDir();
  let files: string[] = [];

  try {
    files = await fs.readdir(dir);
  } catch (err: any) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }

  const langSuffix = `.${lang}.mdx`;
  const matched = files.filter((f) => f.endsWith(langSuffix));

  const posts: PostMeta[] = [];

  for (const file of matched) {
    try {
      const raw = await fs.readFile(path.join(dir, file), 'utf8');
      const { data } = matter(raw);

      const fileSlug = file.replace(langSuffix, '');
      const frontmatterSlug = (data as any)?.slug as string | undefined;
      const slug =
        frontmatterSlug && frontmatterSlug.trim().length > 0
          ? frontmatterSlug.trim()
          : fileSlug;

      const rawDate = (data as any)?.date;
      const date = normalizeDate(rawDate);

      posts.push({
        slug,
        title: ((data as any)?.title as string) || slug,
        date,
        description: ((data as any)?.description as string) || undefined,
      });
    } catch {
      // skip bad file
      continue;
    }
  }

  // newest first
  posts.sort((a, b) => ((a.date || '') < (b.date || '') ? 1 : -1));
  return posts;
}

// Load a post by the slug in the URL, matching against frontmatter `slug`
export async function loadPost(
  slug: string,
  lang: Lang,
): Promise<LoadedPost> {
  const dir = postsDir();
  let files: string[] = [];

  try {
    files = await fs.readdir(dir);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return {
        slug,
        title: 'Post not found',
        date: '',
        description: '',
        body: 'This post could not be found.',
      };
    }
    throw err;
  }

  const langSuffix = `.${lang}.mdx`;

  // be tolerant to accidental "-" issues
  const candidates = Array.from(
    new Set([
      slug,
      slug.endsWith('-') ? slug.replace(/-+$/, '') : `${slug}-`,
    ]),
  );

  for (const file of files) {
    if (!file.endsWith(langSuffix)) continue;

    try {
      const fullPath = path.join(dir, file);
      const raw = await fs.readFile(fullPath, 'utf8');
      const { data, content } = matter(raw);

      const fileSlug = file.replace(langSuffix, '');
      const frontmatterSlug = (data as any)?.slug as string | undefined;
      const fmSlug =
        frontmatterSlug && frontmatterSlug.trim().length > 0
          ? frontmatterSlug.trim()
          : fileSlug;

      if (!candidates.includes(fmSlug)) continue;

      const rawDate = (data as any)?.date;
      const date = normalizeDate(rawDate);
      const title = ((data as any)?.title as string) || fmSlug;
      const description = ((data as any)?.description as string) || '';

      return {
        slug: fmSlug,
        title,
        date: date || '',
        description,
        body: content,
      };
    } catch {
      continue;
    }
  }

  return {
    slug,
    title: 'Post not found',
    date: '',
    description: '',
    body: 'This post could not be found.',
  };
}
