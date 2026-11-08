import Image from 'next/image';
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
    <div className="adm-auth">
      <div className="adm-card adm-auth-card">
        <div className="adm-auth-brand">
          <Image src="/burrow-mark.png" alt="" width={92} height={56} />
          <strong>The <span>Warren</span></strong>
        </div>
        <h1>Set up The Warren</h1>
        <p className="lede">
          First run. Create the owner account. If your author profile already
          exists from seed content (for example the slug <code>andrew</code>),
          use that slug to claim it.
        </p>
        {error ? <p className="adm-banner error" style={{ marginTop: 14 }}>{error}</p> : null}
        <form action={setupAction}>
          <label htmlFor="display_name">Your name</label>
          <input id="display_name" name="display_name" type="text" required />
          <label htmlFor="slug">Author slug (lowercase, for bylines)</label>
          <input id="slug" name="slug" type="text" placeholder="andrew" required />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
          <label htmlFor="password">Password (10+ characters)</label>
          <input id="password" name="password" type="password" required autoComplete="new-password" />
          <p className="submit" style={{ marginBottom: 0 }}>
            <button className="adm-btn primary block" type="submit">Create owner account</button>
          </p>
        </form>
      </div>
    </div>
  );
}
