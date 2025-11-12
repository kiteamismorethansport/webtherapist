export async function loadPage(slug: string, lang: 'en'|'ru'|'ukr') {
  return {
    hero: { heading: lang==='ru' ? 'Доказательная терапия с теплом и ясностью.' : lang==='ukr' ? 'Доказова терапія з теплом і ясністю.' : 'Evidence-based therapy with warmth and clarity.' , sub: lang==='ru' ? 'Индивидуальные консультации онлайн и офлайн.' : lang==='ukr' ? 'Індивідуальні консультації онлайн та офлайн.' : 'Individual counseling online and in person.' },
    address: lang === 'ru' ? 'Киев • Онлайн по всему миру' : lang === 'ukr' ? 'Київ • Онлайн по всьому світу' : 'Kyiv • Online Worldwide'
  }
}
