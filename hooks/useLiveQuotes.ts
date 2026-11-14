'use client';
import { useCallback, useSyncExternalStore } from 'react';
import { quoteStore } from '@/lib/quote-store';
export type { LiveQuote } from '@/lib/quote-health';

export function useQuoteFeed(symbols: string[]) {
    const key = [...new Set(symbols)].sort().join(',');
    const subscribe = useCallback((listener: () => void) => quoteStore.subscribe(key ? key.split(',') : [], listener), [key]);
    const snapshot = useSyncExternalStore(subscribe, quoteStore.getSnapshot, quoteStore.getServerSnapshot);
    return { ...snapshot, refresh: () => quoteStore.refresh(key.split(',')) };
}
export function useLiveQuotes(symbols: string[]) { return useQuoteFeed(symbols).quotes; }
