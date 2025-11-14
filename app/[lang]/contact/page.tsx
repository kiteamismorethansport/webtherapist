import ContactForm from '@/components/ContactForm';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ukr' }, { lang: 'ru' }];
}

export const dynamic = 'force-static';

export default function ContactPage({
  params,
}: {
  params: { lang: 'en' | 'ukr' | 'ru' };
}) {
  return (
    <main>
      <section className="bg-gradient-to-b from-zinc-50 to-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-serif leading-tight">Contact</h1>
          <p className="mt-2 text-zinc-600">
            Send a message and I’ll get back to you.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-2xl px-4 py-10">
          <ContactForm lang={params.lang} />
        </div>
      </section>
    </main>
  );
}
