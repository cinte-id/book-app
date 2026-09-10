import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadTickets,
  saveTicket,
  findTicket,
  deleteTicket,
  ticketStats,
} from './tickets';

const memStore = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      store = {};
    },
  };
};

beforeEach(() => {
  vi.stubGlobal('localStorage', memStore());
});

const supportInput = {
  id: 'TKT-123456',
  type: 'support' as const,
  name: 'Budi',
  email: 'budi@mail.com',
  category: 'Bug / Error',
  priority: 'Normal',
  subject: 'Buku gagal dimuat',
  message: 'Halaman library blank setelah login, sudah coba refresh.',
  status: 'Open',
  createdAt: '10 Sep 2026',
};

describe('ticket store', () => {
  it('starts empty', () => {
    expect(loadTickets()).toEqual([]);
  });

  it('saves and loads a support ticket', () => {
    saveTicket(supportInput);
    const all = loadTickets();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe('TKT-123456');
    expect(all[0].type).toBe('support');
    expect(typeof all[0].ts).toBe('number');
  });

  it('normalizes missing optional fields', () => {
    saveTicket({ id: 'FBK-1', type: 'feedback', status: 'Open', createdAt: 'now' });
    const [t] = loadTickets();
    expect(t.email).toBe('');
    expect(t.category).toBe('Lainnya');
    expect(t.subject).toBe('(tanpa subjek)');
    expect(t.message).toBe('');
  });

  it('falls back to Open for unknown status', () => {
    saveTicket({ ...supportInput, id: 'TKT-2', status: 'Weird' });
    expect(loadTickets()[0].status).toBe('Open');
  });

  it('finds tickets case-insensitively with whitespace tolerated', () => {
    saveTicket(supportInput);
    expect(findTicket('  tkt-123456 ')?.id).toBe('TKT-123456');
    expect(findTicket('TKT-000000')).toBeNull();
    expect(findTicket('')).toBeNull();
  });

  it('prepends newest and caps at 50', () => {
    for (let i = 0; i < 55; i++) {
      saveTicket({ ...supportInput, id: `TKT-${i}` });
    }
    const all = loadTickets();
    expect(all).toHaveLength(50);
    expect(all[0].id).toBe('TKT-54');
  });

  it('deletes by id', () => {
    saveTicket(supportInput);
    saveTicket({ ...supportInput, id: 'TKT-999' });
    const next = deleteTicket('TKT-123456');
    expect(next).toHaveLength(1);
    expect(next[0].id).toBe('TKT-999');
  });

  it('computes stats incl. average rating', () => {
    saveTicket(supportInput);
    saveTicket({
      id: 'FBK-10',
      type: 'feedback',
      email: 'a@mail.com',
      category: 'Fitur Baru',
      rating: 5,
      message: 'Tambah dark mode please, minimal 20 karakter.',
      status: 'Open',
      createdAt: 'now',
    });
    saveTicket({
      id: 'FBK-11',
      type: 'feedback',
      email: 'b@mail.com',
      category: 'Fitur Baru',
      rating: 3,
      message: 'Saran lain yang cukup panjang untuk lolos.',
      status: 'Open',
      createdAt: 'now',
    });
    const s = ticketStats();
    expect(s.total).toBe(3);
    expect(s.open).toBe(3);
    expect(s.support).toBe(1);
    expect(s.feedback).toBe(2);
    expect(s.avgRating).toBe(4);
    expect(s.byCategory['Fitur Baru']).toBe(2);
  });

  it('survives unavailable storage', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    });
    expect(loadTickets()).toEqual([]);
    expect(() => saveTicket(supportInput)).not.toThrow();
  });
});
