import { QUOTE_TTL_SECONDS } from '@/lib/market-data';

export type LiveQuote = { c?: number; d?: number; dp?: number; h?: number; l?: number; o?: number; pc?: number; t?: number; receivedAt?: number; currency?: string; source?: 'Finnhub' | 'Yahoo Finance' };

// Retrieval and trade time are separate: a recently retrieved Friday close is valid
// over a normal weekend; an old cached response is never made fresh by reading it.
export function isQuoteHealthy(quote: LiveQuote | null | undefined, symbol = '', now = Date.now()) {
    if (!quote || !Number.isFinite(quote.c) || !(quote.c! > 0)) return false;
    const retrieved = quote.receivedAt;
    if (!Number.isFinite(retrieved) || retrieved! > now + 60_000 || now - retrieved! > Math.max(600, QUOTE_TTL_SECONDS * 2) * 1000) return false;
    const trade = (quote.t ?? NaN) * 1000;
    const maxTradeAge = symbol.startsWith('BINANCE:') ? 30 * 60_000 : 96 * 3600_000;
    return Number.isFinite(trade) && trade > 0 && trade <= now + 60_000 && now - trade <= maxTradeAge;
}

// Only infer unambiguous legacy currencies. Unknown markets stay unitless.
export function legacyQuoteCurrency(symbol: string): string | null {
    if (/^BINANCE:/.test(symbol)) return 'USD'; // Yahoo quotes crypto in USD, not the exchange's USDT unit.
    const suffix = symbol.split('.').at(-1)!;
    const currencies: Record<string, string> = { SR: 'SAR', WA: 'PLN', DE: 'EUR', TO: 'CAD', AX: 'AUD', NS: 'INR', BO: 'INR', HK: 'HKD', L: 'GBp', T: 'JPY' };
    if (/^[A-Z][A-Z0-9]*\.[AB]$/.test(symbol)) return 'USD';
    if (symbol.includes('.')) return currencies[suffix] ?? null;
    return /^[A-Z][A-Z0-9-]*$/.test(symbol) ? 'USD' : null;
}
