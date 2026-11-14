export type DailyBar = { date: string; time: number; open: number; high: number; low: number; close: number; adjusted: number | null; volume: number | null };
export type DailyHistory = { currency: string; timezone: string; bars: DailyBar[] };
export type StudyData = { stock: DailyHistory; benchmark: DailyHistory | null };
export const STUDY_WINDOWS = [21, 63, 126, 252] as const;
export type StudyWindow = typeof STUDY_WINDOWS[number];

const record = (v: unknown): Record<string, unknown> => v !== null && typeof v === 'object' ? v as Record<string, unknown> : {};
const array = (v: unknown): unknown[] => Array.isArray(v) ? v : [];
const positive = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0;

export function parseDailyHistory(json: unknown, fallbackCurrency = 'USD'): DailyHistory | null {
    const result = record(array(record(record(json).chart).result)[0]);
    const meta = record(result.meta);
    const indicators = record(result.indicators);
    const q = record(array(indicators.quote)[0]);
    const adjusted = array(record(array(indicators.adjclose)[0]).adjclose);
    let timezone = typeof meta.exchangeTimezoneName === 'string' ? meta.exchangeTimezoneName : 'UTC';
    let dateFormat: Intl.DateTimeFormat;
    try { dateFormat = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }); }
    catch { timezone = 'UTC'; dateFormat = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }); }
    const columns = { open: array(q.open), high: array(q.high), low: array(q.low), close: array(q.close), volume: array(q.volume) };
    const bars = new Map<string, DailyBar>();
    const times = array(result.timestamp);
    times.forEach((time, i) => {
        const open = columns.open[i], high = columns.high[i], low = columns.low[i], close = columns.close[i], volume = columns.volume[i];
        if (!positive(time) || time > Date.now() / 1000 + 86400 || !positive(open) || !positive(high) || !positive(low) || !positive(close)) return;
        if (high < Math.max(open, close) || low > Math.min(open, close) || high < low) return;
        const parts = Object.fromEntries(dateFormat.formatToParts(new Date(time * 1000)).map(p => [p.type, p.value]));
        const date = `${parts.year}-${parts.month}-${parts.day}`;
        const previous = bars.get(date);
        if (previous && previous.time > time) return;
        bars.set(date, { date, time, open, high, low, close, adjusted: positive(adjusted[i]) ? adjusted[i] : null,
            volume: typeof volume === 'number' && Number.isFinite(volume) && volume >= 0 ? volume : null });
    });
    const sorted = [...bars.values()].sort((a, b) => a.time - b.time).slice(-750);
    if (!sorted.length) return null;
    return { currency: typeof meta.currency === 'string' && /^[A-Za-z]{3,8}$/.test(meta.currency) ? meta.currency : fallbackCurrency, timezone, bars: sorted };
}

export function summarizeHistory(bars: DailyBar[], window: StudyWindow) {
    const selected = bars.slice(-window);
    if (!selected.length) return null;
    const latest = selected[selected.length - 1];
    const high = selected.reduce((a, b) => b.high >= a.high ? b : a);
    const low = selected.reduce((a, b) => b.low <= a.low ? b : a);
    const ma = (period: number) => bars.length < period ? null : bars.slice(-period).reduce((sum, b) => sum + b.close / period, 0);
    const previous = bars.slice(-21, -1);
    const averageVolume = previous.length === 20 && previous.every(b => b.volume !== null)
        ? previous.reduce((sum, b) => sum + b.volume! / 20, 0) : null;
    return { latest, high, low, count: selected.length, start: selected[0].date,
        distanceHigh: (latest.close / high.high - 1) * 100, distanceLow: (latest.close / low.low - 1) * 100,
        ma20: ma(20), ma60: ma(60), ma200: ma(200), averageVolume,
        volumeRatio: latest.volume !== null && averageVolume !== null && averageVolume > 0 ? latest.volume / averageVolume : null };
}

export function compareHistory(stock: DailyBar[], benchmark: DailyBar[], window: StudyWindow) {
    const byDate = new Map(benchmark.map(bar => [bar.date, bar]));
    const aligned = stock.slice(-window).flatMap(bar => { const ref = byDate.get(bar.date); return ref ? [{ bar, ref }] : []; });
    if (aligned.length < 2) return null;
    // Use the same price basis for both series across the entire shared period.
    const adjusted = aligned.every(({ bar, ref }) => bar.adjusted !== null && ref.adjusted !== null);
    const value = (bar: DailyBar) => adjusted ? bar.adjusted! : bar.close;
    const stockBase = value(aligned[0].bar), referenceBase = value(aligned[0].ref);
    const points = aligned.map(({ bar, ref }) => ({ date: bar.date, stock: (value(bar) / stockBase - 1) * 100, benchmark: (value(ref) / referenceBase - 1) * 100 }));
    if (points.some(p => !Number.isFinite(p.stock) || !Number.isFinite(p.benchmark))) return null;
    return { adjusted, points, spread: points.at(-1)!.stock - points.at(-1)!.benchmark };
}
