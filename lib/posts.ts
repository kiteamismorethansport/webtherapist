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
  const files = await fs.readdir(dir);
  const langSuffix = `.${lang}.mdx`;
  const matched = files.filter(f => f.endsWith(langSuffix));

  const posts: PostMeta[] = [];
  for (const file of matched) {
    const raw = await fs.readFile(path.join(dir, file), 'utf8');
    const { data } = matter(raw);
    const slug = file.replace(langSuffix, '');
    posts.push({
      slug,
      title: (data?.title as string) || slug,
      date: data?.date as string | undefined,
      description: (data?.description as string) || undefined,
    });
  }

  // sort desc by date
  posts.sort((a, b) => (a.date || '') < (b.date || '') ? 1 : -1);
  return posts;
}

export async function loadPost(slug: string, lang: Lang) {
  const file = path.join(process.cwd(), 'content', 'posts', `${slug}.${lang}.mdx`);
  const raw = await fs.readFile(file, 'utf8');
  const { content, data } = matter(raw);
  const title = (data?.title as string) || slug;
  const date = (data?.date as string) || '';
  const description = (data?.description as string) || '';

  return { title, date, description, body: content };
}
