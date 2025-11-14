// lib/posts.ts
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

type Lang = 'en' | 'ukr' | 'ru';

export type PostMeta = {
  slug: string;
  title: string;
  date?: string;
  description?: string;
};

function normalizeDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value;
  return undefined;
}

export async function listPosts(lang: Lang): Promise<PostMeta[]> {
  const dir = path.join(process.cwd(), 'content', 'posts');
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
      const slug = file.replace(langSuffix, '');
      const rawDate = (data as any)?.date;
      const date = normalizeDate(rawDate);

      posts.push({
        slug,
        title: ((data as any)?.title as string) || slug,
        date,
        description: ((data as any)?.description as string) || undefined,
      });
    } catch {
      continue;
    }
  }

  posts.sort((a, b) => (a.date || '') < (b.date || '') ? 1 : -1);
  return posts;
}

export async function loadPost(slug: string, lang: Lang) {
  const file = path.join(process.cwd(), 'content', 'posts', `${slug}.${lang}.mdx`);

  try {
    const raw = await fs.readFile(file, 'utf8');
    const { content, data } = matter(raw);
    const rawDate = (data as any)?.date;
    const date = normalizeDate(rawDate);

    const title = ((data as any)?.title as string) || slug;
    const description = ((data as any)?.description as string) || '';

    return { title, date: date || '', description, body: content };
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return {
        title: 'Post not found',
        date: '',
        description: '',
        body: 'This post could not be found.',
      };
    }
    throw err;
  }
}
