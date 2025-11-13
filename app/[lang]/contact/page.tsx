export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ukr' }, { lang: 'ru' }];
}

export const dynamic = 'force-static';

export default function ContactPage({ params, searchParams }: { params: { lang: 'en'|'ukr'|'ru' }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const thanks = searchParams && (searchParams['thanks'] === '1' || searchParams['thanks'] === 'true');

  return (
    <main>
      <section className="bg-gradient-to-b from-zinc-50 to-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-serif leading-tight">Contact</h1>
          <p className="mt-2 text-zinc-600">Send a message and I’ll get back to you.</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-2xl px-4 py-10">
          {thanks ? (
            <div className="rounded-xl border bg-green-50 text-green-800 p-4">Thank you! Your message has been sent.</div>
          ) : (
            <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action={`/${params.lang}/contact?thanks=1`} className="space-y-4">
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>Don’t fill this out if you're human: <input name="bot-field" /></label>
              </p>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input name="name" required className="w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" required className="w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea name="message" required rows={6} className="w-full rounded-lg border px-3 py-2" />
              </div>
              <button type="submit" className="rounded-full px-5 py-3 border border-zinc-900 hover:bg-zinc-900 hover:text-white">Send</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
