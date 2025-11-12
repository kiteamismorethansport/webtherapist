import './globals.css';
import type { ReactNode } from 'react';
import IdentityWidget from '@/components/IdentityWidget';

export const metadata = {
  title: 'Kovalova Olha Viktorovna',
  description: 'Therapy services',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-900">
        {children}
        <IdentityWidget />
      </body>
    </html>
  );
}
