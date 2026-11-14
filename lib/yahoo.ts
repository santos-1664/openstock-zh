// Yahoo Finance helpers for exchanges the free sources price badly: Tadawul (.SR) is blocked in TradingView's free
// embeds and on Finnhub free; Warsaw (GPW, .WA) renders in embeds but only end of day, where Yahoo is ~15 minutes delayed.
// Pure functions, covered by tests; the network call lives in lib/actions/yahoo.actions.ts.

type YahooExchange = { suffix: string; currency: string; ticker: RegExp; indices: Record<string, string> };

// TradingView prefix -> Yahoo suffix, trading currency, the shape of a ticker, and index tickers with their Yahoo symbols
const YAHOO_EXCHANGES: Record<string, YahooExchange> = {
    TADAWUL: { suffix: 'SR', currency: 'SAR', ticker: /^\d+$/, indices: { TASI: '^TASI.SR' } },
    GPW: { suffix: 'WA', currency: 'PLN', ticker: /^[A-Z0-9]+$/, indices: { WIG20: 'WIG20.WA', WIG: 'WIG.WA', MWIG40: 'MWIG40.WA', SWIG80: 'SWIG80.WA' } },
};

const INDEX_SYMBOLS = new Set(Object.values(YAHOO_EXCHANGES).flatMap((ex) => Object.values(ex.indices)));

// "2222.SR" or "TADAWUL:2222" -> "2222.SR"; "PKN.WA" or "GPW:PKN" -> "PKN.WA".
// Indices: "TADAWUL:TASI" -> "^TASI.SR", "GPW:WIG20" -> "WIG20.WA". Anything else -> null.
export function normalizeYahooSymbol(symbol: string): string | null {
    const upper = (symbol || '').trim().toUpperCase();
    if (INDEX_SYMBOLS.has(upper)) return upper;
    for (const [prefix, ex] of Object.entries(YAHOO_EXCHANGES)) {
        const ticker = upper.startsWith(`${prefix}:`) ? upper.slice(prefix.length + 1)
            : upper.endsWith(`.${ex.suffix}`) ? upper.slice(0, -(ex.suffix.length + 1))
            : null;
        if (ticker === null) continue;
        if (ex.indices[ticker]) return ex.indices[ticker];
        return ex.ticker.test(ticker) ? `${ticker}.${ex.suffix}` : null;
    }
    return null;
}

export const isYahooSymbol = (symbol: string) => normalizeYahooSymbol(symbol) !== null;

// Broader quote coverage, without changing which markets use the dedicated Yahoo UI.
// Never treat an arbitrary string/URL as a provider symbol.
export function normalizeYahooQuoteSymbol(symbol: string): string | null {
    const upper = String(symbol ?? '').trim().toUpperCase();
    const special = normalizeYahooSymbol(upper);
    if (special) return special;
    const us = upper.replace(/^(NASDAQ|NYSE|AMEX|NYSEARCA):/, '');
    if (/^[A-Z][A-Z0-9.-]{0,23}$/.test(us)) return us.replace(/\.(A|B)$/, '-$1');
    const exchanges: Record<string, string> = { XETR: 'DE', TSX: 'TO', ASX: 'AX', BSE: 'BO', NSE: 'NS' };
    const [exchange, ticker] = upper.split(':');
    if (exchanges[exchange] && /^[A-Z0-9&.-]{1,20}$/.test(ticker ?? '')) return `${ticker}.${exchanges[exchange]}`;
    const crypto = /^BINANCE:([A-Z0-9]{2,12})(USDT|USDC)$/.exec(upper);
    if (crypto) return `${crypto[1]}-USD`;
    const fx = /^FX:([A-Z]{6})$/.exec(upper);
    if (fx) return `${fx[1]}=X`;
    return null;
}

// "TADAWUL:2222" -> "2222.SR", "GPW:PKN" -> "PKN.WA": the symbols our stock pages use. Indices have no stock page.
export const yahooAppSymbol = (tvSymbol: string) => {
    const yahoo = normalizeYahooSymbol(tvSymbol);
    return yahoo && !INDEX_SYMBOLS.has(yahoo) ? yahoo : null;
};

// The exchange's currency for a Yahoo symbol ("PKN.WA" -> "PLN"), for when Yahoo leaves meta.currency out
export const yahooCurrency = (yahooSymbol: string) =>
    Object.values(YAHOO_EXCHANGES).find((ex) => yahooSymbol.toUpperCase().endsWith(`.${ex.suffix}`))?.currency ?? 'USD';

export type YahooDailyQuote = {
    price: number;
    change: number;
    changePercent: number;
    currency: string;
    name: string;
    open?: number;
    high?: number;
    low?: number;
    previousClose?: number;
    tradeTime?: number;
    receivedAt?: number;
    exchange?: string;
};

type YahooChartJson = {
    chart?: {
        result?: Array<{
            meta?: { currency?: string; shortName?: string; longName?: string; regularMarketPrice?: number; fulldayChange?: number; regularMarketChangePercent?: number; regularMarketTime?: number; regularMarketDayHigh?: number; regularMarketDayLow?: number; previousClose?: number; exchangeName?: string };
            indicators?: { quote?: Array<{ close?: (number | null)[]; open?: (number | null)[]; high?: (number | null)[]; low?: (number | null)[] }> };
        }>;
    };
};

// Today's quote from a /v8/finance/chart response: Yahoo's own day change when it sends one,
// else the last two daily closes (TASI and the WIG indices only ever return one daily bar, so they need the former).
// longName first: GPW short names look like "PKN C.XWAR PLN".
export function dailyQuoteFromChart(json: unknown, fallbackCurrency = 'USD'): YahooDailyQuote | null {
    const result = (json as YahooChartJson)?.chart?.result?.[0];
    const meta = result?.meta;
    const closes = (result?.indicators?.quote?.[0]?.close ?? []).filter((n): n is number => Number.isFinite(n));
    if (!result || closes.length === 0) return null;
    const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);
    const price = finite(meta?.regularMarketPrice) ? meta.regularMarketPrice : closes[closes.length - 1];
    if (!(price > 0)) return null;
    const prev = finite(meta?.previousClose) && meta.previousClose > 0 ? meta.previousClose : closes.length > 1 ? closes[closes.length - 2] : null;
    const change = prev != null ? price - prev : finite(meta?.fulldayChange) ? meta.fulldayChange : 0;
    const last = (values?: (number | null)[]) => values?.filter(finite).at(-1);
    const candle = result.indicators?.quote?.[0];
    return {
        price,
        change,
        changePercent: prev ? (change / prev) * 100 : finite(meta?.regularMarketChangePercent) ? meta.regularMarketChangePercent : 0,
        currency: result.meta?.currency || fallbackCurrency,
        name: result.meta?.longName || result.meta?.shortName || '',
        open: last(candle?.open),
        high: finite(meta?.regularMarketDayHigh) ? meta.regularMarketDayHigh : last(candle?.high),
        low: finite(meta?.regularMarketDayLow) ? meta.regularMarketDayLow : last(candle?.low),
        previousClose: prev ?? undefined,
        tradeTime: finite(meta?.regularMarketTime) ? meta.regularMarketTime : undefined,
        exchange: meta?.exchangeName,
    };
}
