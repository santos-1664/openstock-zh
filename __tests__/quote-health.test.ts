import { describe, expect, it } from 'vitest';
import { isQuoteHealthy, legacyQuoteCurrency } from '@/lib/quote-health';
import { isAlertConditionMet } from '@/lib/alert-conditions';
import { formatPrice } from '@/lib/utils';
const now = Date.parse('2026-11-15T12:00:00Z');
const fresh = { c: 101, t: (now - 40 * 3600_000) / 1000, receivedAt: now };
describe('quote provenance and currency', () => {
    it('accepts a recently fetched weekend close but rejects a stale cache or missing provenance', () => {
        expect(isQuoteHealthy(fresh, 'AAPL', now)).toBe(true);
        for (const q of [{ ...fresh, receivedAt: now - 601_000 }, { ...fresh, receivedAt: undefined }, { ...fresh, receivedAt: now + 120_000 }]) {
            expect(isQuoteHealthy(q, 'AAPL', now)).toBe(false);
            expect(isAlertConditionMet({ symbol: 'AAPL', targetPrice: 100, condition: 'ABOVE' }, q, now)).toBe(false);
        }
    });
    it('applies a shorter trade-age limit to crypto, including when retrieval just succeeded', () => {
        expect(isQuoteHealthy(fresh, 'BINANCE:BTCUSDT', now)).toBe(false);
        expect(isQuoteHealthy({ ...fresh, t: now / 1000 }, 'BINANCE:BTCUSDT', now)).toBe(true);
    });
    it('keeps small amounts and non-dollar units visible without converting pence to pounds', () => {
        expect(formatPrice(0.00001234, 'USD')).toContain('0.00001234');
        expect(formatPrice(125, 'GBp')).toBe('125.00 GBp');
        expect(formatPrice(10, 'PLN')).not.toContain('$');
        expect(formatPrice(10, null)).toBe('10.00');
        expect(formatPrice(NaN)).toBe('—');
        expect(legacyQuoteCurrency('BRK.B')).toBe('USD');
        expect(legacyQuoteCurrency('PKN.WA')).toBe('PLN');
        expect(legacyQuoteCurrency('UNKNOWN.XX')).toBeNull();
    });
});
