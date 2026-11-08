import { redirect } from 'next/navigation';
import { loginUserCount } from '@/features/auth/users';
import { setupAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if ((await loginUserCount()) > 0) redirect('/admin/login');
  const { error } = await searchParams;
  return (
    <div className="panel" style={{ maxWidth: 480, margin: '40px auto' }}>
      <h1 style={{ marginTop: 0 }}>Set up The Warren</h1>
      <p style={{ color: 'var(--muted)' }}>
        First run. Create the owner account. If your author profile already
        exists from seed content (for example the slug <code>andrew</code>),
        use that slug to claim it.
      </p>
      {error ? <p className="error">{error}</p> : null}
      <form action={setupAction}>
        <label htmlFor="display_name">Your name</label>
        <input id="display_name" name="display_name" type="text" required />
        <label htmlFor="slug">Author slug (lowercase, for bylines)</label>
        <input id="slug" name="slug" type="text" placeholder="andrew" required />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
        <label htmlFor="password">Password (10+ characters)</label>
        <input id="password" name="password" type="password" required autoComplete="new-password" />
        <p style={{ marginTop: 18 }}>
          <button type="submit" style={{ width: '100%' }}>Create owner account</button>
        </p>
      </form>
    </div>
  );
}
