import { describe, expect, it } from 'vitest';
import { isAlertConditionMet } from '@/lib/alert-conditions';

const now = Date.parse('2026-11-13T12:00:00Z');
const quote = (c: number) => ({ c, t: now / 1000 });

describe('in-app alert conditions', () => {
    it('includes exact target matches in both directions', () => {
        expect(isAlertConditionMet({ condition: 'ABOVE', targetPrice: 100 }, quote(100), now)).toBe(true);
        expect(isAlertConditionMet({ condition: 'BELOW', targetPrice: 100 }, quote(100), now)).toBe(true);
        expect(isAlertConditionMet({ condition: 'ABOVE', targetPrice: 100 }, quote(99), now)).toBe(false);
        expect(isAlertConditionMet({ condition: 'BELOW', targetPrice: 100 }, quote(101), now)).toBe(false);
    });
    it('never triggers from missing, malformed, future or stale market data', () => {
        const alert = { condition: 'ABOVE', targetPrice: 1 };
        for (const q of [null, {}, quote(NaN), quote(0), { c: 100 }, { c: 100, t: (now - 8 * 86400_000) / 1000 }, { c: 100, t: now / 1000 + 3600 }]) {
            expect(isAlertConditionMet(alert, q, now)).toBe(false);
        }
        expect(isAlertConditionMet({ condition: 'OTHER', targetPrice: 1 }, quote(100), now)).toBe(false);
    });
});
