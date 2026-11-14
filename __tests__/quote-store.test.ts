import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createQuoteStore } from '@/lib/quote-store';
let visible = 'visible';
let events: Map<string, () => void>;
beforeEach(() => {
    vi.useFakeTimers(); visible = 'visible'; events = new Map();
    vi.stubGlobal('document', { get visibilityState() { return visible; }, addEventListener: (key: string, cb: () => void) => events.set(key, cb), removeEventListener: (key: string) => events.delete(key) });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe('shared quote feed', () => {
    it('batches overlapping cards, preserves good quotes on failure and stops after unsubscribe', async () => {
        const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ AAPL: { c: 101, receivedAt: Date.now() }, MSFT: { c: 200, receivedAt: Date.now() } }) });
        vi.stubGlobal('fetch', fetcher);
        const store = createQuoteStore();
        const off1 = store.subscribe(['AAPL'], vi.fn());
        const off2 = store.subscribe(['AAPL', 'MSFT'], vi.fn());
        await vi.advanceTimersByTimeAsync(30);
        expect(fetcher).toHaveBeenCalledTimes(1);
        expect(decodeURIComponent(fetcher.mock.calls[0][0])).toContain('AAPL,MSFT');
        fetcher.mockRejectedValue(new Error('Offline'));
        await vi.advanceTimersByTimeAsync(75_000);
        expect(store.getSnapshot().quotes.AAPL?.c).toBe(101);
        expect(store.getSnapshot().errors.AAPL).toBe(true);
        off1(); off2(); const calls = fetcher.mock.calls.length;
        await vi.advanceTimersByTimeAsync(120_000);
        expect(fetcher).toHaveBeenCalledTimes(calls);
        expect(events.size).toBe(0);
    });
    it('does not fetch in a hidden tab and discards a response finishing after teardown', async () => {
        visible = 'hidden';
        let resolve!: (value: unknown) => void;
        const fetcher = vi.fn(() => new Promise(r => { resolve = r; })); vi.stubGlobal('fetch', fetcher);
        const store = createQuoteStore(); const off = store.subscribe(['AAPL'], vi.fn());
        await vi.advanceTimersByTimeAsync(30); expect(fetcher).not.toHaveBeenCalled();
        visible = 'visible'; events.get('visibilitychange')!();
        expect(fetcher).toHaveBeenCalledTimes(1); off();
        resolve({ ok: true, json: async () => ({ AAPL: { c: 101 } }) });
        await vi.advanceTimersByTimeAsync(1);
        expect(store.getSnapshot().quotes).toEqual({});
    });
    it('splits requests to respect the 25-symbol API limit', async () => {
        const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }); vi.stubGlobal('fetch', fetcher);
        const store = createQuoteStore(); const off = store.subscribe(Array.from({ length: 51 }, (_, i) => `S${i}`), vi.fn());
        await vi.advanceTimersByTimeAsync(30);
        expect(fetcher).toHaveBeenCalledTimes(3);
        for (const call of fetcher.mock.calls) expect(decodeURIComponent(call[0]).split('=')[1].split(',').length).toBeLessThanOrEqual(25);
        off();
    });
});
