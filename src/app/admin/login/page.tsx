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
    <div className="panel" style={{ maxWidth: 440, margin: '40px auto' }}>
      <h1 style={{ marginTop: 0 }}>Log in</h1>
      {error ? <p className="error">{error}</p> : null}
      <form action={loginAction}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" />
        <p style={{ marginTop: 18 }}>
          <button type="submit" style={{ width: '100%' }}>Log in</button>
        </p>
      </form>
    </div>
  );
}
