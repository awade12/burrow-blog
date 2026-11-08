import Link from 'next/link';
import { currentUser } from '@/features/auth/session';
import { logoutAction } from './actions';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return (
    <div className="wrap" style={{ paddingTop: 22, paddingBottom: 30 }}>
      {user ? (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <strong>The Warren admin</strong>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/posts">Posts</Link>
          <Link href="/admin/media">Media</Link>
          <Link href="/admin/tokens">API tokens</Link>
          <Link href="/admin/team">Team</Link>
          <Link href="/">View site</Link>
          <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 14 }}>
            {user.display_name}
          </span>
          <form action={logoutAction}>
            <button className="secondary" type="submit">Log out</button>
          </form>
        </div>
      ) : null}
      {children}
    </div>
  );
}
