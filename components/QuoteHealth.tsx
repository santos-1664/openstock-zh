'use client';
import { formatPrice } from '@/lib/utils';
import ChangePill from '@/components/ChangePill';
import { useTranslations } from 'next-intl';
import { useQuoteFeed, type LiveQuote } from '@/hooks/useLiveQuotes';
import { isQuoteHealthy } from '@/lib/quote-health';

export default function QuoteHealth({ symbols, initial = {} }: { symbols: string[]; initial?: Record<string, LiveQuote | null> }) {
    const t = useTranslations('QuoteHealth');
    const feed = useQuoteFeed(symbols);
    // Check after hydration; do not make time-sensitive SSR output disagree with the client.
    if (!feed.now) return null;
    const failed = symbols.some(s => feed.errors[s]);
    const stale = symbols.some(s => !isQuoteHealthy(feed.quotes[s] ?? initial[s], s, feed.now));
    if (!failed && !stale) return null;
    return <div role="status" className="flex flex-wrap items-center gap-2 text-xs leading-5 text-warn">
        <span>{t(failed ? 'failed' : 'stale')}</span>
        <button type="button" className="min-h-9 underline underline-offset-4" onClick={feed.refresh}>{t('retry')}</button>
    </div>;
}

export function QuoteValue({ symbol, initial, field, currency }: { symbol: string; initial: LiveQuote | null; field: 'price' | 'change' | 'percent'; currency: string }) {
    const { quotes } = useQuoteFeed([symbol]);
    const quote = quotes[symbol] ?? initial;
    if (field === 'percent') return <ChangePill value={quote?.c ? quote.dp : null} />;
    if (!quote?.c) return <>—</>;
    if (field === 'change') return <>{quote.d == null ? '—' : `${quote.d > 0 ? '+' : ''}${formatPrice(quote.d, null)}`}</>;
    return <>{formatPrice(quote.c, quote.currency ?? currency)}</>;
}
