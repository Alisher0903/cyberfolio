'use client';

import { useEffect, useState } from 'react';
import { adminApi, type SiteSetting } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function SettingsManager() {
  const { t } = useI18n();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    adminApi
      .settings()
      .then((items) => {
        setSettings(items);
        setDrafts(
          Object.fromEntries(items.map((item) => [item.key, JSON.stringify(item.value, null, 2)])),
        );
      })
      .catch((error) => setMessage(String(error)));
  }, []);

  async function save(key: string) {
    try {
      const value = JSON.parse(drafts[key]) as Record<string, unknown>;
      await adminApi.saveSetting(key, value);
      setMessage(t('admin.settings.saved', { key }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t('admin.settings.invalidJson'));
    }
  }

  async function changePassword() {
    if (password.length < 12) {
      setMessage(t('admin.settings.passwordTooShort'));
      return;
    }
    const { error } = (await supabase?.auth.updateUser({ password })) ?? {
      error: new Error(t('admin.settings.supabaseMissing')),
    };
    setMessage(error ? error.message : t('admin.settings.passwordChanged'));
    if (!error) setPassword('');
  }

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('admin.settings.eyebrow')}</p>
          <h2>{t('admin.settings.title')}</h2>
          <p className="section-copy">{t('admin.settings.subtitle')}</p>
        </div>
      </div>
      {message && <div className="notice module-error">{message}</div>}
      <div className="settings-grid">
        <article>
          <header>
            <strong>{t('admin.settings.security')}</strong>
          </header>
          <label>
            <span>{t('admin.settings.newPassword')}</span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={12}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('admin.settings.passwordPlaceholder')}
            />
          </label>
          <button
            className="primary-button"
            disabled={password.length < 12}
            onClick={changePassword}
          >
            {t('admin.settings.changePassword')}
          </button>
        </article>
        {settings.map((setting) => (
          <article key={setting.key}>
            <header>
              <strong>{setting.key}</strong>
              <button className="primary-button compact" onClick={() => save(setting.key)}>
                {t('common.save')}
              </button>
            </header>
            <textarea
              rows={12}
              value={drafts[setting.key] ?? ''}
              onChange={(event) =>
                setDrafts((current) => ({ ...current, [setting.key]: event.target.value }))
              }
              spellCheck={false}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
