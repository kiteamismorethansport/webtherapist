import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx,json}',
  ],
  theme: { extend: {} },
  plugins: [],
}
export default config
