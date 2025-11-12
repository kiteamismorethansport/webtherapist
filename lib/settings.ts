import { promises as fs } from 'fs'
import path from 'path'

export async function loadSettings(lang: 'en'|'ru'|'ukr') {
  const file = path.join(process.cwd(), 'content', 'settings', `siteSettings.${lang}.json`)
  const json = JSON.parse(await fs.readFile(file, 'utf8'))
  return json
}
