'use client';

import { FormEvent, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function LoginScreen() {
  const { t } = useI18n();
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
        <div className="login-locale">
          <LanguageSwitcher />
        </div>
        <p className="eyebrow">{t('admin.login.eyebrow')}</p>
        <h1>{t('admin.login.title')}</h1>
        <p className="muted">{t('admin.login.subtitle')}</p>

        {!isSupabaseConfigured && <div className="notice">{t('admin.login.notConfigured')}</div>}
        {error && <div className="error">{error}</div>}

        <label>
          <span>{t('admin.login.email')}</span>
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
          <span>{t('admin.login.password')}</span>
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
          {loading ? t('admin.login.authenticating') : t('admin.login.enter')}
        </button>
        <p className="secure-note">
          <i /> {t('admin.login.secured')}
        </p>
      </form>
    </main>
  );
}
