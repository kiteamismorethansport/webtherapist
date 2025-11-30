import { loadPageBySlug } from '@/lib/pages';
import type { Lang } from '@/lib/posts';
import ContactForm from '@/components/ContactForm';

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

          {/* Contact Form (client component) */}
          <ContactForm lang={lang} />
        </div>
      </section>
    </main>
  );
}
