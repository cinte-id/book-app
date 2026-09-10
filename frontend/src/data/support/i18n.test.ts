import { describe, it, expect, beforeEach, vi } from 'vitest';
import { t, getLang, setLang } from './i18n';

beforeEach(() => {
  const store: Record<string, string> = {};
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
  });
});

describe('i18n', () => {
  it('defaults to Indonesian', () => {
    expect(getLang()).toBe('id');
    expect(t('surveyYes')).toBe('Ya');
  });

  it('switches to English and back', () => {
    setLang('en');
    expect(getLang()).toBe('en');
    expect(t('surveyYes')).toBe('Yes');
    expect(t('surveyThanks')).toBe('Thanks for your feedback!');
    setLang('id');
    expect(t('surveyYes')).toBe('Ya');
  });

  it('falls back to Indonesian for unknown stored values', () => {
    localStorage.setItem('booktracker_lang', 'fr');
    expect(getLang()).toBe('id');
  });
});
