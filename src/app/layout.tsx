import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { config } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: { default: `${config.siteName} | ${config.siteTagline}`, template: `%s | ${config.siteName}` },
  description: config.siteDescription,
  alternates: { types: { 'application/rss+xml': '/rss.xml' } },
  openGraph: {
    siteName: config.siteName,
    type: 'website',
    images: ['/burrow-icon.png'],
  },
  icons: { icon: '/burrow-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link className="brand" href="/">
              <Image src="/burrow-mark.png" alt="" width={88} height={54} priority />
              <span className="name">The <span>Warren</span></span>
            </Link>
            <nav className="main" aria-label="Main">
              <Link href="/posts">Blog</Link>
              <Link href="/guides">Guides</Link>
              <Link href="/updates">Updates</Link>
              <Link href="/search">Search</Link>
              <a className="cta-button" href="https://burrowservers.com">Burrow servers</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <span>The Warren is where the Burrow team writes things down.</span>
            <a href="https://burrowservers.com">burrowservers.com</a>
            <a href="https://discord.gg/xchUdWNbuv">Discord</a>
            <a href="/rss.xml">RSS</a>
            <Link href="/guides">Guides</Link>
            <Link href="/updates">Updates</Link>
            <span style={{ marginLeft: 'auto' }}>Built with our own tiny CMS. MIT licensed.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
