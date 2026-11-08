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
      <h1 style={{ marginTop: 0 }}>Team</h1>
      <p style={{ color: 'var(--muted)', maxWidth: 640 }}>
        Author profiles show up in bylines and the editor. Logins are how a
        person gets into this admin. There is no public sign-up anywhere.
      </p>
      {error ? <p className="error">{error}</p> : null}
      <table className="admin">
        <thead><tr><th>Name</th><th>Slug</th><th>Email</th><th>Can log in</th></tr></thead>
        <tbody>
          {people.map((p) => (
            <tr key={p.id}>
              <td>{p.display_name}</td>
              <td>{p.slug}</td>
              <td>{p.email ?? ''}</td>
              <td>{p.can_login ? 'yes' : 'profile only'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 22 }} className="editor-grid">
        <form action={addProfileAction} className="panel">
          <h3 style={{ marginTop: 0 }}>Add author profile</h3>
          <label htmlFor="p_name">Display name</label>
          <input id="p_name" name="display_name" type="text" required />
          <label htmlFor="p_slug">Slug</label>
          <input id="p_slug" name="slug" type="text" placeholder="dakota" />
          <p><button type="submit">Add profile</button></p>
        </form>
        <form action={addLoginAction} className="panel">
          <h3 style={{ marginTop: 0 }}>Add or upgrade a login</h3>
          <label htmlFor="l_name">Display name</label>
          <input id="l_name" name="display_name" type="text" required />
          <label htmlFor="l_slug">Slug (matches their author profile to claim it)</label>
          <input id="l_slug" name="slug" type="text" placeholder="dakota" />
          <label htmlFor="l_email">Email</label>
          <input id="l_email" name="email" type="email" required />
          <label htmlFor="l_password">Password (10+ characters, share it with them privately)</label>
          <input id="l_password" name="password" type="password" required />
          <p><button type="submit">Save login</button></p>
        </form>
      </div>
    </div>
  );
}
