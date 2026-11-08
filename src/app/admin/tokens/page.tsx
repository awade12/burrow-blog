import TokenCreator from '@/components/admin/TokenCreator';
import { requireAdminPage } from '@/features/auth/guard';
import { query } from '@/lib/db/pool';
import { revokeTokenAction } from './actions';

export const dynamic = 'force-dynamic';

type TokenRow = {
  id: string; name: string; scope: string;
  created_at: string; last_used_at: string | null; revoked_at: string | null;
};

export default async function TokensPage() {
  await requireAdminPage();
  const tokens = await query<TokenRow>(
    `select id, name, scope, created_at::text, last_used_at::text, revoked_at::text
       from api_tokens order by created_at desc`,
  );
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>API tokens</h1>
      <p style={{ color: 'var(--muted)', maxWidth: 640 }}>
        Tokens can create and edit <strong>drafts only</strong> through
        <code> /api/v1/drafts</code>. They can never publish. Publishing always
        happens here, by a person.
      </p>
      <TokenCreator />
      <table className="admin">
        <thead><tr><th>Name</th><th>Scope</th><th>Created</th><th>Last used</th><th>Status</th><th /></tr></thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.scope}</td>
              <td>{new Date(t.created_at).toLocaleDateString('en-US')}</td>
              <td>{t.last_used_at ? new Date(t.last_used_at).toLocaleString('en-US') : 'never'}</td>
              <td>{t.revoked_at ? 'revoked' : 'active'}</td>
              <td>
                {!t.revoked_at ? (
                  <form action={revokeTokenAction.bind(null, t.id)}>
                    <button className="danger" type="submit">Revoke</button>
                  </form>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tokens.length === 0 ? <p style={{ color: 'var(--muted)' }}>No tokens yet.</p> : null}
    </div>
  );
}
