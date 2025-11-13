# Blog index + Contact form added

- `app/[lang]/blog/page.tsx` — Blog index (lists posts per locale)
- `app/[lang]/blog/[slug]/page.tsx` — Blog post route
- `app/[lang]/contact/page.tsx` — Contact form (Netlify Forms). Redirects to `?thanks=1` on success.
- `lib/posts.ts` — list/load posts
- Example posts: `content/posts/welcome.{en|ukr|ru}.mdx`
