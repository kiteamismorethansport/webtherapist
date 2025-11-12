import './globals.css'
import type { ReactNode } from 'react'
import Script from 'next/script'

export const metadata = { title: 'Kovalova Olha Viktorovna', description: 'Therapy services' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-900">
        {children}
        {/* Netlify Identity widget */}
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
