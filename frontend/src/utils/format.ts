export const fmt = {
  currency: (v: number, symbol = '৳') =>
    `${symbol}${v.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,

  number: (v: number) => v.toLocaleString('en-BD'),

  percent: (v: number) => `${v.toFixed(2)}%`,

  date: (iso: string) =>
    new Date(iso).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' }),

  datetime: (iso: string) =>
    new Date(iso).toLocaleString('en-BD', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),

  qty: (v: number) => v.toLocaleString('en-BD', { maximumFractionDigits: 2 }),
};

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthStartISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

export function nDaysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
