import { describe, expect, it } from 'vitest';
import {
  DICTIONARIES,
  LOCALES,
  localeFromAcceptLanguage,
  normalizeLocale,
  translate,
  localizeProject,
  localizeDetail,
  compareUzText,
} from '../../../packages/shared/src/i18n';

describe('localization regression checks', () => {
  for (const locale of LOCALES) {
    it(`${locale}: complete translations and matching interpolation variables`, () => {
      expect(Object.keys(DICTIONARIES[locale]).sort()).toEqual(Object.keys(DICTIONARIES.en).sort());
      for (const [key, source] of Object.entries(DICTIONARIES.en)) {
        const value = DICTIONARIES[locale][key as keyof typeof DICTIONARIES.en];
        expect(value.trim(), key).not.toBe('');
        expect((value.match(/\{\w+\}/g) ?? []).sort(), key).toEqual(
          (source.match(/\{\w+\}/g) ?? []).sort(),
        );
      }
    });
  }
  it('resolves explicit locales and browser preferences', () => {
    expect(normalizeLocale('uz_Cyrl')).toBe('uz-cyrl');
    expect(localeFromAcceptLanguage('fr-FR,ru;q=0.8,en;q=0.4')).toBe('ru');
    expect(localeFromAcceptLanguage('ru;q=0,en;q=0.9')).toBe('en');
    expect(normalizeLocale('unknown')).toBe('en');
  });
  it('substitutes values without exposing interpolation tokens', () => {
    for (const locale of LOCALES)
      expect(translate(locale, 'projects.more', { count: 7 })).toContain('7');
  });
  it('preserves authored values when an override is missing or empty', () => {
    const base = { title: 'Authored', metrics: [{ label: 'Base', value: '42' }] };
    const entry = { uz: { title: '', metricLabels: ['Ko‘rsatkich'] } };
    expect(localizeProject(base, entry, 'uz')).toEqual({
      title: 'Authored',
      metrics: [{ label: 'Ko‘rsatkich', value: '42' }],
    });
    expect(localizeProject(base, entry, 'en')).toEqual(base);
    expect(base.metrics[0].label).toBe('Base');
    expect(
      localizeDetail({ highlights: ['Base'] }, { ru: { highlights: [] } }, 'ru').highlights,
    ).toEqual(['Base']);
  });
  it('compares Uzbek apostrophe variants consistently', () => {
    expect(compareUzText("o'zbek", 'oʻzbek')).toBe(0);
    expect(compareUzText('olma', 'oʻrik')).toBeLessThan(0);
  });
});
