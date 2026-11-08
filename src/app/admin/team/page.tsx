import { requireAdminPage } from '@/features/auth/guard';
import { listAuthors } from '@/features/auth/users';
import { addLoginAction, addProfileAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdminPage();
  const { error } = await searchParams;
  const people = await listAuthors();
  return (
    <div>
      <div className="adm-page-head">
        <div className="grow">
          <p className="adm-eyebrow">People</p>
          <h1 className="adm-title">Team</h1>
          <p className="adm-sub">
            Author profiles show up in bylines and the editor. Logins are how a
            person gets into this admin. There is no public sign-up anywhere.
          </p>
        </div>
      </div>
      {error ? <p className="adm-banner error">{error}</p> : null}
      <div className="adm-tablewrap" style={{ marginBottom: 22 }}>
        <table className="adm-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Email</th><th>Access</th></tr></thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.id}>
                <td className="t">{p.display_name}</td>
                <td className="muted">{p.slug}</td>
                <td className="muted">{p.email ?? ''}</td>
                <td>
                  {p.can_login
                    ? <span className="adm-pill published">can log in</span>
                    : <span className="adm-pill">profile only</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="adm-two-col">
        <form action={addProfileAction} className="adm-card">
          <h3 className="adm-card-title">Add author profile</h3>
          <label htmlFor="p_name">Display name</label>
          <input id="p_name" name="display_name" type="text" required />
          <label htmlFor="p_slug">Slug</label>
          <input id="p_slug" name="slug" type="text" placeholder="dakota" />
          <p style={{ marginBottom: 0 }}>
            <button className="adm-btn primary" type="submit">Add profile</button>
          </p>
        </form>
        <form action={addLoginAction} className="adm-card">
          <h3 className="adm-card-title">Add or upgrade a login</h3>
          <label htmlFor="l_name">Display name</label>
          <input id="l_name" name="display_name" type="text" required />
          <label htmlFor="l_slug">Slug (matches their author profile to claim it)</label>
          <input id="l_slug" name="slug" type="text" placeholder="dakota" />
          <label htmlFor="l_email">Email</label>
          <input id="l_email" name="email" type="email" required />
          <label htmlFor="l_password">Password (10+ characters, share it with them privately)</label>
          <input id="l_password" name="password" type="password" required />
          <p style={{ marginBottom: 0 }}>
            <button className="adm-btn primary" type="submit">Save login</button>
          </p>
        </form>
      </div>
    </div>
  );
}
