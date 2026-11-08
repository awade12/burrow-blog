import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Image from 'next/image';
import Link from 'next/link';
import { config } from '@/lib/config';
import './globals.css';

// Self-hosted Inter Variable (owner-approved exception to the
// system-font rule): no external font service, one file, swap.
const inter = localFont({
  src: '../../public/fonts/InterVariable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
});

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
    <html lang="en" className={inter.variable}>
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
            </nav>
            <a className="cta-button" href="https://burrowservers.com">Burrow servers</a>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <div className="footer-grid">
              <div className="footer-brand">
                <Link className="brand" href="/">
                  <Image src="/burrow-mark.png" alt="" width={88} height={54} />
                  <span className="name">The <span>Warren</span></span>
                </Link>
                <p>
                  Where the Burrow team writes things down. Guides, posts and
                  updates for people who run game servers with friends.
                </p>
              </div>
              <div className="footer-col">
                <h5>Read</h5>
                <Link href="/posts">Blog</Link>
                <Link href="/guides">Guides</Link>
                <Link href="/updates">Updates</Link>
                <Link href="/search">Search</Link>
              </div>
              <div className="footer-col">
                <h5>Burrow</h5>
                <a href="https://burrowservers.com">burrowservers.com</a>
                <a href="https://burrowservers.com/waitlist">Founding seats</a>
                <a href="https://discord.gg/xchUdWNbuv">Discord</a>
              </div>
              <div className="footer-col">
                <h5>Follow</h5>
                <a href="/rss.xml">RSS feed</a>
                <a href="https://www.instagram.com/burrowservers">Instagram</a>
                <Link href="/updates">Changelog</Link>
              </div>
            </div>
            <div className="footer-bottom">
              <span>Built with our own tiny CMS. MIT licensed.</span>
              <span className="footer-right">© 2026 Wade Holdings Group LLC</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
