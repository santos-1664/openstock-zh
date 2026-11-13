'use server';

import { QUOTE_TTL_SECONDS } from '@/lib/market-data';
import { dailyQuoteFromChart, normalizeYahooQuoteSymbol, yahooCurrency, type YahooDailyQuote } from '@/lib/yahoo';

// Shared five-minute cache. A small queue avoids bursts when a watchlist is opened.
let active = 0;
const waiting: (() => void)[] = [];
const pending = new Map<string, Promise<YahooDailyQuote | null>>();
async function withSlot<T>(work: () => Promise<T>): Promise<T> {
    if (active >= 4) await new Promise<void>((resolve) => waiting.push(resolve));
    active++;
    try { return await work(); } finally { active--; waiting.shift()?.(); }
}
function quoteFor(symbol: string): Promise<YahooDailyQuote | null> {
    const existing = pending.get(symbol);
    if (existing) return existing;
    const job = withSlot(async () => {
        try {
            const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                next: { revalidate: Math.max(QUOTE_TTL_SECONDS, 300) },
                signal: AbortSignal.timeout(5000),
            });
            if (!res.ok) return null;
            return dailyQuoteFromChart(await res.json(), yahooCurrency(symbol));
        } catch {
            return null;
        }
    }).finally(() => pending.delete(symbol));
    pending.set(symbol, job);
    return job;
}
export async function getYahooDailyQuotes(symbols: string[]): Promise<Record<string, YahooDailyQuote>> {
    const clean = [...new Set(symbols.map((s) => String(s).trim().toUpperCase()))].slice(0, 50);
    const entries = await Promise.all(clean.map(async (symbol) => {
        const providerSymbol = normalizeYahooQuoteSymbol(symbol);
        return [symbol, providerSymbol ? await quoteFor(providerSymbol) : null] as const;
    }));
    return Object.fromEntries(entries.filter(([, quote]) => quote)) as Record<string, YahooDailyQuote>;
}

type YahooSearchResponse = {
    quotes?: { symbol?: string; shortname?: string; longname?: string; quoteType?: string; exchDisp?: string }[];
    news?: { uuid?: string; title?: string; publisher?: string; link?: string; providerPublishTime?: number; relatedTickers?: string[] }[];
};

async function searchYahoo(query: string): Promise<YahooSearchResponse> {
    const q = String(query).trim().slice(0, 80);
    if (!q) return {};
    const response = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=15&newsCount=6`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Market search unavailable (${response.status})`);
    return response.json();
}

export async function searchYahooStocks(query: string): Promise<StockWithWatchlistStatus[]> {
    const data = await searchYahoo(query);
    return (data.quotes ?? []).filter((q) =>
        ['EQUITY', 'ETF'].includes(q.quoteType ?? '') && /^[A-Z][A-Z0-9.&-]{0,23}$/.test(q.symbol ?? '')
    ).map((q) => ({
        symbol: q.symbol!, name: q.longname || q.shortname || q.symbol!, exchange: q.exchDisp || 'US',
        type: q.quoteType === 'ETF' ? 'ETF' : 'Stock', isInWatchlist: false,
    }));
}

export async function getYahooNews(symbols: string[] = []): Promise<MarketNewsArticle[]> {
    const query = symbols.filter((s) => /^[A-Z0-9.&:-]{1,25}$/.test(s)).slice(0, 3).join(' ') || 'stock market';
    const data = await searchYahoo(query);
    return (data.news ?? []).filter((n) => n.title && /^https:\/\//.test(n.link ?? '')).slice(0, 6).map((n, i) => ({
        id: i, headline: n.title!, summary: '', source: n.publisher || 'Yahoo Finance', url: n.link!,
        datetime: Number.isFinite(n.providerPublishTime) ? n.providerPublishTime! : 0,
        category: 'general', related: (n.relatedTickers ?? []).slice(0, 3).join(', '),
    }));
}
