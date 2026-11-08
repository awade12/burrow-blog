'use client';

import { useState, useTransition } from 'react';
import { createTokenAction } from '@/app/admin/tokens/actions';

export default function TokenCreator() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="adm-card" style={{ marginBottom: 22 }}>
      <h3 className="adm-card-title">New token</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          start(async () => {
            const res = await createTokenAction(fd);
            if (res.token) { setToken(res.token); setError(null); }
            else setError(res.error ?? 'Failed.');
          });
        }}
      >
        <label htmlFor="name">Token name</label>
        <input id="name" name="name" type="text" placeholder="ivy drafts" required />
        <p style={{ marginBottom: token || error ? undefined : 0 }}>
          <button className="adm-btn primary" type="submit" disabled={pending}>
            {pending ? 'Creating...' : 'Create token'}
          </button>
        </p>
      </form>
      {error ? <p className="adm-banner error" style={{ marginBottom: 0 }}>{error}</p> : null}
      {token ? (
        <div>
          <p className="adm-banner notice" style={{ marginBottom: 10 }}>
            Copy this now. It is shown once, and only a hash is stored.
          </p>
          <code style={{ wordBreak: 'break-all', fontSize: 14 }}>{token}</code>
        </div>
      ) : null}
    </div>
  );
}
