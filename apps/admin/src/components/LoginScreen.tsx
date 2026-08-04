'use client';

import { FormEvent, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError('');
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) setError(result.error.message);
    setLoading(false);
  }

  return (
    <main className="login-page">
      <div className="grid-glow" />
      <form className="login-card" onSubmit={submit}>
        <div className="brand-mark">&gt;_</div>
        <p className="eyebrow">SECURE CONTROL PLANE</p>
        <h1>Welcome back.</h1>
        <p className="muted">Authenticate to manage the public portfolio.</p>

        {!isSupabaseConfigured && (
          <div className="notice">Supabase environment variables are not configured.</div>
        )}
        {error && <div className="error">{error}</div>}

        <label>
          <span>Email address</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@alisherdev.uz"
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••••••"
          />
        </label>
        <button className="primary-button" disabled={loading || !isSupabaseConfigured}>
          {loading ? 'Authenticating…' : 'Enter dashboard →'}
        </button>
        <p className="secure-note"><i /> Protected by Supabase Auth + RLS</p>
      </form>
    </main>
  );
}
