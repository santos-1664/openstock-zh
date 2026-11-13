import { describe, expect, it } from 'vitest';
import { dailyQuoteFromChart, normalizeYahooSymbol, normalizeYahooQuoteSymbol, yahooAppSymbol, yahooCurrency } from '@/lib/yahoo';
import { formatSymbolForTradingView, isChartEmbeddable } from '@/lib/utils';

describe('Tadawul symbols', () => {
    it('maps app and TradingView symbols to Yahoo', () => {
        expect(normalizeYahooSymbol('2222.SR')).toBe('2222.SR');
        expect(normalizeYahooSymbol('tadawul:2222')).toBe('2222.SR');
        expect(normalizeYahooSymbol('TADAWUL:TASI')).toBe('^TASI.SR');
        // Bare numbers stay ambiguous: 7203 is Toyota in Tokyo
        expect(normalizeYahooSymbol('7203')).toBeNull();
        expect(normalizeYahooSymbol('AAPL')).toBeNull();
        expect(yahooAppSymbol('TADAWUL:1120')).toBe('1120.SR');
        expect(yahooAppSymbol('TADAWUL:TASI')).toBeNull();
    });

    it('charts .SR on TradingView as TADAWUL, without the embed it blocks', () => {
        expect(formatSymbolForTradingView('2222.SR')).toBe('TADAWUL:2222');
        expect(isChartEmbeddable('TADAWUL:2222')).toBe(false);
    });
});

describe('Warsaw (GPW) symbols', () => {
    it('maps app and TradingView symbols to Yahoo', () => {
        expect(normalizeYahooSymbol('PKN.WA')).toBe('PKN.WA');
        expect(normalizeYahooSymbol('gpw:pkn')).toBe('PKN.WA');
        expect(normalizeYahooSymbol('GPW:WIG20')).toBe('WIG20.WA');
        expect(normalizeYahooSymbol('GPW:MWIG40')).toBe('MWIG40.WA');
        expect(normalizeYahooSymbol('WIG20.WA')).toBe('WIG20.WA');
        expect(normalizeYahooSymbol('XETR:SAP')).toBeNull();
        expect(yahooAppSymbol('GPW:CDR')).toBe('CDR.WA');
        expect(yahooAppSymbol('GPW:WIG20')).toBeNull();
        expect(yahooAppSymbol('WIG.WA')).toBeNull();
    });

    it('charts .WA on TradingView as GPW, which embeds allow', () => {
        expect(formatSymbolForTradingView('PKN.WA')).toBe('GPW:PKN');
        expect(isChartEmbeddable('GPW:PKN')).toBe(true);
    });
});

describe('dailyQuoteFromChart', () => {
    const chart = (close: (number | null)[]) => ({ chart: { result: [{ meta: { currency: 'SAR', shortName: 'Saudi Arabian Oil Co.' }, indicators: { quote: [{ close }] } }] } });

    it('compares the last two closes, skipping gaps', () => {
        const q = dailyQuoteFromChart(chart([25, 26, null, 26.52]))!;
        expect(q.price).toBe(26.52);
        expect(q.change).toBeCloseTo(0.52);
        expect(q.changePercent).toBeCloseTo(2);
        expect(q).toMatchObject({ currency: 'SAR', name: 'Saudi Arabian Oil Co.' });
    });

    it('prefers the long name (GPW short names look like "PKN C.XWAR PLN")', () => {
        const json = { chart: { result: [{ meta: { currency: 'PLN', shortName: 'PKN C.XWAR PLN', longName: 'Orlen S.A.' }, indicators: { quote: [{ close: [147, 146.38] }] } }] } };
        expect(dailyQuoteFromChart(json)).toMatchObject({ currency: 'PLN', name: 'Orlen S.A.' });
    });

    it("prefers Yahoo's own day change (TASI sends a single daily bar)", () => {
        const json = { chart: { result: [{ meta: { regularMarketPrice: 9921.5, fulldayChange: -101.97, regularMarketChangePercent: -1.017 }, indicators: { quote: [{ close: [9921.5] }] } }] } };
        expect(dailyQuoteFromChart(json)).toMatchObject({ price: 9921.5, change: -101.97, changePercent: -1.017 });
    });

    it("falls back to the exchange's currency when Yahoo omits it", () => {
        expect(yahooCurrency('PKN.WA')).toBe('PLN');
        expect(yahooCurrency('^TASI.SR')).toBe('SAR');
        expect(yahooCurrency('AAPL')).toBe('USD');
        const noCurrency = { chart: { result: [{ meta: {}, indicators: { quote: [{ close: [10, 11] }] } }] } };
        expect(dailyQuoteFromChart(noCurrency, yahooCurrency('2222.SR'))?.currency).toBe('SAR');
        expect(dailyQuoteFromChart(noCurrency)?.currency).toBe('USD');
    });

    it('returns null when Yahoo has nothing', () => {
        expect(dailyQuoteFromChart({ chart: { result: null } })).toBeNull();
        expect(dailyQuoteFromChart(chart([null]))).toBeNull();
    });
});

describe('general market quote fallback', () => {
    it('covers headline ETFs, US share classes, international stocks and crypto without accepting URLs', () => {
        expect(normalizeYahooQuoteSymbol('spy')).toBe('SPY');
        expect(normalizeYahooQuoteSymbol('NASDAQ:QQQ')).toBe('QQQ');
        expect(normalizeYahooQuoteSymbol('BRK.B')).toBe('BRK-B');
        expect(normalizeYahooQuoteSymbol('XETR:SAP')).toBe('SAP.DE');
        expect(normalizeYahooQuoteSymbol('BINANCE:BTCUSDT')).toBe('BTC-USD');
        expect(normalizeYahooQuoteSymbol('https://example.com')).toBeNull();
        expect(normalizeYahooQuoteSymbol('AAPL?token=secret')).toBeNull();
    });

    it('uses yesterday’s close, rather than the first close of a multi-day chart, for the daily change', () => {
        const result = dailyQuoteFromChart({ chart: { result: [{
            meta: { regularMarketPrice: 110, chartPreviousClose: 80, regularMarketTime: 1794517200 },
            indicators: { quote: [{ close: [90, 100, 110], open: [88, 95, 104], high: [92, 101, 111], low: [87, 94, 103] }] },
        }] } });
        expect(result).toMatchObject({ price: 110, change: 10, changePercent: 10, previousClose: 100, open: 104, high: 111, low: 103, tradeTime: 1794517200 });
    });

    it('rejects a zero price and does not render non-finite provider prices', () => {
        expect(dailyQuoteFromChart({ chart: { result: [{ meta: { regularMarketPrice: 0 }, indicators: { quote: [{ close: [1, 2] }] } }] } })).toBeNull();
        expect(dailyQuoteFromChart({ chart: { result: [{ meta: { regularMarketPrice: NaN }, indicators: { quote: [{ close: [10, 11] }] } }] } })?.price).toBe(11);
    });
});
