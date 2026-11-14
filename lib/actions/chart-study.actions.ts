'use server';

import { requireUserId } from '@/lib/better-auth/auth';
import { isRateLimited } from '@/lib/rate-limit';
import { normalizeYahooQuoteSymbol, yahooCurrency } from '@/lib/yahoo';
import { parseDailyHistory, type DailyHistory, type StudyData } from '@/lib/chart-study';

type StudyResult = { data: StudyData; error?: never } | { data?: never; error: 'auth' | 'invalid' | 'limited' | 'unavailable' };
const inFlight = new Map<string, Promise<DailyHistory | null>>();
function history(symbol: string): Promise<DailyHistory | null> {
    const pending = inFlight.get(symbol);
    if (pending) return pending;
    const job = (async () => {
        try {
            const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2y&includeAdjustedClose=true`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 300 }, signal: AbortSignal.timeout(7000),
            });
            return res.ok ? parseDailyHistory(await res.json(), yahooCurrency(symbol)) : null;
        } catch { return null; }
    })().finally(() => inFlight.delete(symbol));
    inFlight.set(symbol, job);
    return job;
}

export async function getChartStudy(symbol: string): Promise<StudyResult> {
    let userId: string;
    try { userId = await requireUserId(); } catch { return { error: 'auth' }; }
    const ticker = typeof symbol === 'string' && symbol.length <= 48 ? normalizeYahooQuoteSymbol(symbol) : null;
    if (!ticker) return { error: 'invalid' };
    try {
        if (await isRateLimited(`chart-study:${userId}`, 20, 60)) return { error: 'limited' };
        const [stock, benchmark] = await Promise.all([history(ticker), history('SPY')]);
        if (!stock) return { error: 'unavailable' };
        return { data: { stock, benchmark } };
    } catch { return { error: 'unavailable' }; }
}
