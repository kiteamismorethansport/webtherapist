import { loadPageBySlug } from '@/lib/pages';
import type { Lang } from '@/lib/posts';

export const dynamic = 'force-static';

export default async function ContactPage({
  params,
}: {
  params: { lang: Lang };
}) {
  const { lang } = params;

  // Contact page slug is always "contact"
  const page = await loadPageBySlug('contact', lang);

  return (
    <main>
      {/* Heading – aligned to blog layout */}
      <section className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-serif leading-tight">
            {page.hero.heading}
          </h1>

          {page.hero.sub ? (
            <p className="mt-2 text-sm text-zinc-500">{page.hero.sub}</p>
          ) : null}
        </div>
      </section>

      {/* Body + Contact Form */}
      <section>
        <div className="mx-auto max-w-4xl px-4 py-10">
          {/* Body text from MDX */}
          <article className="prose max-w-none mb-10">
            {page.body}
          </article>

          {/* Contact Form */}
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            className="space-y-6 max-w-lg"
          >
            <input type="hidden" name="form-name" value="contact" />

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                rows={6}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="rounded-full px-6 py-2 border border-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
