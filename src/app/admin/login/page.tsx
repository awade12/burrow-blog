import Image from 'next/image';
import { redirect } from 'next/navigation';
import { currentUser } from '@/features/auth/session';
import { loginUserCount } from '@/features/auth/users';
import { loginAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if ((await loginUserCount()) === 0) redirect('/admin/setup');
  if (await currentUser()) redirect('/admin');
  const { error } = await searchParams;
  return (
    <div className="adm-auth">
      <div className="adm-card adm-auth-card">
        <div className="adm-auth-brand">
          <Image src="/burrow-mark.png" alt="" width={92} height={56} />
          <strong>The <span>Warren</span></strong>
        </div>
        <h1>Welcome back</h1>
        <p className="lede">Log in to write, edit and publish.</p>
        {error ? <p className="adm-banner error" style={{ marginTop: 14 }}>{error}</p> : null}
        <form action={loginAction}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" />
          <p className="submit" style={{ marginBottom: 0 }}>
            <button className="adm-btn primary block" type="submit">Log in</button>
          </p>
        </form>
      </div>
    </div>
  );
}
