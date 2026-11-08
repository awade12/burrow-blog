import Image from 'next/image';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { currentUser } from '@/features/auth/session';
import { logoutAction } from './actions';
import './admin.css';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) return <div className="adm">{children}</div>;
  return (
    <div className="adm adm-shell">
      <aside className="adm-side">
        <Link className="adm-side-brand" href="/admin">
          <Image src="/burrow-mark.png" alt="" width={80} height={50} />
          <span className="t">
            <strong>The Warren</strong>
            <span>Admin</span>
          </span>
        </Link>
        <AdminNav />
        <div className="adm-side-foot">
          <div className="adm-userchip">
            <span className="adm-avatar" aria-hidden>
              {user.display_name.trim().charAt(0).toUpperCase()}
            </span>
            <span className="who">
              <strong>{user.display_name}</strong>
              <span>{user.email}</span>
            </span>
          </div>
          <div className="adm-side-links">
            <Link href="/">View site</Link>
            <form action={logoutAction}>
              <button className="adm-btn sm" type="submit">Log out</button>
            </form>
          </div>
        </div>
      </aside>
      <div className="adm-main">{children}</div>
    </div>
  );
}
