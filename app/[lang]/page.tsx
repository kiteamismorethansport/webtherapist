import { loadSettings } from '@/lib/settings';
import { loadPage } from '@/lib/pages';
import Link from 'next/link';

type Lang = 'en' | 'ru' | 'ukr';

export default async function Home({
  params,
}: {
  params: { lang: Lang };
}) {
  const lang = params.lang;
  const settings = await loadSettings(lang);
  const page = await loadPage('home', lang);

  const rawHeroImage = (page.hero?.image as string | undefined)?.trim() || '';

let heroImage: string;

if (!rawHeroImage) {
  heroImage = '/images/placeholder-hero.jpg';
} else if (rawHeroImage.startsWith('http')) {
  // full URL from CDN, etc.
  heroImage = rawHeroImage;
} else if (rawHeroImage.startsWith('/')) {
  // already an absolute path, e.g. /images/foo.jpg
  heroImage = rawHeroImage;
} else if (rawHeroImage.startsWith('images/')) {
  // missing leading slash
  heroImage = '/' + rawHeroImage;
} else if (rawHeroImage.startsWith('public/')) {
  // something like public/images/foo.jpg
  heroImage = '/' + rawHeroImage.replace(/^public\//, '');
} else {
  // just a bare filename like "111.jpg" → assume /images/111.jpg
  heroImage = '/images/' + rawHeroImage;
}


  return (
    <main>
      <section className="bg-gradient-to-b from-zinc-50 to-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif leading-tight">
              {page.hero.heading}
            </h1>
            {page.hero.sub && (
              <p className="mt-4 text-zinc-600 max-w-prose">
                {page.hero.sub}
              </p>
            )}
            <div className="mt-8 flex gap-3">
              <Link
                href={`/${lang}/contact`}
                className="rounded-full px-5 py-3 border border-zinc-900 hover:bg-zinc-900 hover:text-white"
              >
                {settings.nav.cta}
              </Link>
              <Link
                href={`/${lang}/services`}
                className="rounded-full px-5 py-3 border hover:bg-zinc-100"
              >
                {settings.nav.services}
              </Link>
            </div>
            {page.address && (
              <p className="mt-6 text-xs text-zinc-500">{page.address}</p>
            )}
          </div>

          {/* RIGHT SIDE HERO IMAGE */}
          <div className="aspect-video rounded-2xl overflow-hidden shadow-md bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt={page.hero.heading || settings.practiceName}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            {settings.nav.workWithMe}
          </h2>
          <article className="prose max-w-none">
            {/* You can render home body MDX here later */}
          </article>
        </div>
      </section>
    </main>
  );
}
