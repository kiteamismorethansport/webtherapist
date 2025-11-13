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

export async function listPosts(lang: Lang): Promise<PostMeta[]> {
  const dir = path.join(process.cwd(), 'content', 'posts');
  let files: string[] = [];

  try {
    files = await fs.readdir(dir);
  } catch (err: any) {
    // If the folder doesn't exist yet -> no posts
    if (err.code === 'ENOENT') {
      return [];
    }
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
      posts.push({
        slug,
        title: (data?.title as string) || slug,
        date: (data?.date as string) || undefined,
        description: (data?.description as string) || undefined,
      });
    } catch {
      // Skip broken file instead of breaking build
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
    const title = (data?.title as string) || slug;
    const date = (data?.date as string) || '';
    const description = (data?.description as string) || '';

    return { title, date, description, body: content };
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      // Fallback so build doesn’t crash if a post is missing
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
