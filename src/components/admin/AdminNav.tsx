'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/posts', label: 'Posts', exact: false },
  { href: '/admin/media', label: 'Media', exact: false },
  { href: '/admin/tokens', label: 'API tokens', exact: false },
  { href: '/admin/team', label: 'Team', exact: false },
];

// Sidebar nav with active state. Client component only because the
// active link depends on the current pathname.
export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="adm-nav" aria-label="Admin">
      {LINKS.map((l) => {
        const on = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined}>
            <span className="dot" aria-hidden />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
