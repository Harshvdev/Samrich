import type { Metadata } from 'next';
import { Cormorant_Garamond, Newsreader, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import NextTopLoader from 'nextjs-toploader';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Samrich — Poems & Stories',
    template: '%s | Samrich'
  },
  description: 'A personal publishing anthology of poems, stories, and readings by Samrich.',
  keywords: ['Samrich', 'Poetry', 'Poems', 'Short Stories', 'Literature', 'Writer', 'Anthology'],
  authors: [{ name: 'Samrich' }],
  creator: 'Samrich',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Samrich — Poems & Stories',
    title: 'Samrich — Poems & Stories',
    description: 'A personal publishing anthology of poems, stories, and readings by Samrich.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samrich — Poems & Stories',
    description: 'A personal anthology of poems and stories by Samrich.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${cormorant.variable} ${newsreader.variable} ${inter.variable}`}
    >
      <body className="paper-texture min-h-screen flex flex-col font-sans selection:bg-[var(--paper-selection)]">
        <NextTopLoader
          color="#8C4820"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--paper-accent),0 0 5px var(--paper-accent)"
          zIndex={1600}
          showAtBottom={false}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
