import { DATA_MODE } from '@/lib/market-data';
import type { LiveQuote } from '@/lib/quote-health';

export type QuoteSnapshot = { quotes: Record<string, LiveQuote | null>; errors: Record<string, boolean>; now: number };
const EMPTY: QuoteSnapshot = { quotes: {}, errors: {}, now: 0 };
// One feed per browser page. All mounted cards share the same requests and timer.
export function createQuoteStore() {
    let state = EMPTY;
    const subscriptions = new Map<() => void, string[]>();
    let timer: ReturnType<typeof setInterval> | undefined;
    let debounce: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let generation = 0;
    const attempted = new Map<string, number>();
    const period = DATA_MODE === 'realtime' ? 15_000 : DATA_MODE === 'cached' ? 3600_000 : 60_000;
    const emit = () => { for (const listener of subscriptions.keys()) listener(); };
    const symbols = () => [...new Set([...subscriptions.values()].flat())];
    async function load() {
        if (controller || !subscriptions.size || document.visibilityState !== 'visible') return;
        const due = symbols().filter(s => Date.now() - (attempted.get(s) ?? 0) >= period);
        if (!due.length) return;
        const token = generation;
        const request = new AbortController();
        controller = request;
        try {
            for (let offset = 0; offset < due.length; offset += 25) {
                const batch = due.slice(offset, offset + 25);
                batch.forEach(s => attempted.set(s, Date.now()));
                let result: Record<string, LiveQuote | null> = {};
                try {
                    const response = await fetch(`/api/quotes?symbols=${encodeURIComponent(batch.join(','))}`, { signal: request.signal });
                    if (!response.ok) throw new Error('Quote refresh failed');
                    result = await response.json();
                } catch { /* Preserve the last good values, but expose failures. */ }
                if (generation !== token || request.signal.aborted) return;
                const quotes = { ...state.quotes }, errors = { ...state.errors };
                for (const symbol of batch) {
                    const quote = result[symbol];
                    errors[symbol] = !(quote && Number.isFinite(quote.c) && quote.c! > 0);
                    if (!errors[symbol] && (quote!.receivedAt ?? 0) >= (quotes[symbol]?.receivedAt ?? 0)) quotes[symbol] = quote;
                }
                state = { quotes, errors, now: Date.now() };
                emit();
            }
        } finally {
            if (controller === request) { controller = undefined; if (symbols().some(s => !attempted.has(s))) schedule(); }
        }
    }
    function schedule() { clearTimeout(debounce); debounce = setTimeout(() => void load(), 25); }
    function tick() { state = { ...state, now: Date.now() }; emit(); void load(); }
    function visibility() { if (document.visibilityState === 'visible') tick(); }
    return {
        getSnapshot: () => state,
        getServerSnapshot: () => EMPTY,
        subscribe(keys: string[], listener: () => void) {
            subscriptions.set(listener, keys);
            if (!timer) { timer = setInterval(tick, 15_000); document.addEventListener('visibilitychange', visibility); }
            schedule();
            return () => {
                subscriptions.delete(listener);
                if (!subscriptions.size) {
                    generation++; controller?.abort(); controller = undefined;
                    clearInterval(timer); timer = undefined; clearTimeout(debounce);
                    document.removeEventListener('visibilitychange', visibility);
                    state = EMPTY; attempted.clear();
                }
            };
        },
        refresh(keys: string[]) { keys.forEach(s => attempted.delete(s)); schedule(); },
    };
}
export const quoteStore = createQuoteStore();
