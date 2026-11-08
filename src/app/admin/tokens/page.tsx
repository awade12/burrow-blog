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
      <div className="adm-page-head">
        <div className="grow">
          <p className="adm-eyebrow">Automation</p>
          <h1 className="adm-title">API tokens</h1>
          <p className="adm-sub">
            Tokens can create and edit <strong>drafts only</strong> through{' '}
            <span className="adm-code">/api/v1/drafts</span>. They can never publish.
            Publishing always happens here, by a person.
          </p>
        </div>
      </div>
      <TokenCreator />
      {tokens.length ? (
        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Scope</th><th>Created</th><th>Last used</th><th>Status</th><th /></tr></thead>
            <tbody>
              {tokens.map((t) => (
                <tr key={t.id}>
                  <td className="t">{t.name}</td>
                  <td className="muted">{t.scope}</td>
                  <td className="muted">{new Date(t.created_at).toLocaleDateString('en-US')}</td>
                  <td className="muted">{t.last_used_at ? new Date(t.last_used_at).toLocaleString('en-US') : 'never'}</td>
                  <td>
                    {t.revoked_at
                      ? <span className="adm-pill">revoked</span>
                      : <span className="adm-pill published">active</span>}
                  </td>
                  <td>
                    {!t.revoked_at ? (
                      <div className="adm-rowactions">
                        <form action={revokeTokenAction.bind(null, t.id)}>
                          <button className="adm-btn sm danger" type="submit">Revoke</button>
                        </form>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="adm-empty">No tokens yet.</p>
      )}
    </div>
  );
}
