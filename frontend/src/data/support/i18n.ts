// Multi-language support structure for customer-service surfaces.
// Indonesian (id) is active; English (en) ships as a complete fallback.
// Usage: `t('surveyYes')` reads the stored language, defaults to 'id'.
// New pages: add keys to BOTH dictionaries to keep the `DictKey` union complete.

export type Lang = 'id' | 'en';

const LANG_KEY = 'booktracker_lang';

export function getLang(): Lang {
  try {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'id';
  } catch {
    return 'id';
  }
}

export function setLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore
  }
}

const id = {
  back: 'Kembali',
  surveyThanks: 'Terima kasih atas penilaian Anda!',
  surveyYes: 'Ya',
  surveyNo: 'Tidak',
  send: 'Kirim',
  search: 'Cari',
  ticketNotFound: 'Tiket tidak ditemukan di perangkat ini. Periksa kembali ID tiket Anda.',
  noRating: 'Tidak diberi rating',
} as const;

const en: Record<keyof typeof id, string> = {
  back: 'Back',
  surveyThanks: 'Thanks for your feedback!',
  surveyYes: 'Yes',
  surveyNo: 'No',
  send: 'Send',
  search: 'Search',
  ticketNotFound: 'Ticket not found on this device. Please check the ticket ID.',
  noRating: 'No rating given',
};

export type DictKey = keyof typeof id;

export function t(key: DictKey, lang: Lang = getLang()): string {
  return (lang === 'en' ? en[key] : id[key]) ?? id[key];
}
