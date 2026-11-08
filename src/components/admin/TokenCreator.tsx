'use client';

import { useState, useTransition } from 'react';
import { createTokenAction } from '@/app/admin/tokens/actions';

export default function TokenCreator() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="panel" style={{ marginBottom: 22 }}>
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
        <p><button type="submit" disabled={pending}>{pending ? 'Creating...' : 'Create token'}</button></p>
      </form>
      {error ? <p className="error">{error}</p> : null}
      {token ? (
        <div>
          <p className="notice">
            Copy this now. It is shown once, and only a hash is stored.
          </p>
          <code style={{ wordBreak: 'break-all', fontSize: 14 }}>{token}</code>
        </div>
      ) : null}
    </div>
  );
}
