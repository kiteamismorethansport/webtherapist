import { loadPageBySlug, type Lang } from '@/lib/pages';
import ContactForm from '@/components/ContactForm';
import { MDXRemote } from 'next-mdx-remote/rsc';

export function generateStaticParams() {
  const langs: Lang[] = ['en', 'ukr', 'ru'];
  return langs.map((lang) => ({ lang }));
}

export const dynamic = 'force-static';

export default async function ContactPage({
  params,
}: {
  params: { lang: Lang };
}) {
  const { lang } = params;

  const page = await loadPageBySlug('contact', lang).catch(() => null);

  const fallbackHeading =
    lang === 'ru'
      ? 'Контакт'
      : lang === 'ukr'
      ? 'Контакт'
      : 'Contact';

  const fallbackSub =
    lang === 'ru'
      ? 'Напишите, и я свяжусь с вами.'
      : lang === 'ukr'
      ? 'Напишіть, і я з вами зв’яжуся.'
      : 'Send a message and I’ll get back to you.';

  return (
    <main>
      <section className="bg-gradient-to-b from-zinc-50 to-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-serif leading-tight">
            {page?.hero.heading ?? fallbackHeading}
          </h1>
          <p className="mt-2 text-zinc-600 max-w-prose">
            {page?.hero.sub ?? fallbackSub}
          </p>
        </div>
      </section>

      {page?.body && (
        <section>
          <div className="mx-auto max-w-6xl px-4 py-8 prose max-w-none">
            <MDXRemote source={page.body} />
          </div>
        </section>
      )}

      <section>
        <div className="mx-auto max-w-2xl px-4 py-10">
          <ContactForm lang={lang} />
        </div>
      </section>
    </main>
  );
}
