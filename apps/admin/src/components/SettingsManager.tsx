'use client';

import { useEffect, useState } from 'react';
import { adminApi, type SiteSetting } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export default function SettingsManager() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    adminApi.settings().then((items) => {
      setSettings(items);
      setDrafts(Object.fromEntries(items.map((item) => [item.key, JSON.stringify(item.value, null, 2)])));
    });
  }, []);

  async function save(key: string) {
    try {
      const value = JSON.parse(drafts[key]) as Record<string, unknown>;
      await adminApi.saveSetting(key, value);
      setMessage(`${key} saved`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Invalid JSON');
    }
  }

  async function changePassword() {
    if (password.length < 12) {
      setMessage('Password must contain at least 12 characters.');
      return;
    }
    const { error } = (await supabase?.auth.updateUser({ password })) ?? {
      error: new Error('Supabase is not configured'),
    };
    setMessage(error ? error.message : 'Password changed successfully.');
    if (!error) setPassword('');
  }

  return (
    <section className="content-card">
      <div className="section-heading"><div><p className="eyebrow">GLOBAL CONTENT</p><h2>Site settings</h2><p className="section-copy">Hero, contact and global presentation values.</p></div></div>
      {message && <div className="notice module-error">{message}</div>}
      <div className="settings-grid">
        <article>
          <header><strong>Security</strong></header>
          <label><span>New admin password</span><input type="password" autoComplete="new-password" minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 12 characters" /></label>
          <button className="primary-button" disabled={password.length < 12} onClick={changePassword}>Change password</button>
        </article>
        {settings.map((setting) => (
          <article key={setting.key}>
            <header><strong>{setting.key}</strong><button className="primary-button compact" onClick={() => save(setting.key)}>Save</button></header>
            <textarea rows={12} value={drafts[setting.key] ?? ''} onChange={(event) => setDrafts((current) => ({ ...current, [setting.key]: event.target.value }))} spellCheck={false} />
          </article>
        ))}
      </div>
    </section>
  );
}
