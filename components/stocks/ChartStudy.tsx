'use client';

import { useEffect, useId, useState } from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Panel from '@/components/Panel';
import CreateAlertModal from '@/components/watchlist/CreateAlertModal';
import { getChartStudy } from '@/lib/actions/chart-study.actions';
import { compareHistory, summarizeHistory, STUDY_WINDOWS, type StudyData, type StudyWindow } from '@/lib/chart-study';

type Comparison = NonNullable<ReturnType<typeof compareHistory>>;

function PerformanceChart({ comparison, symbol }: { comparison: Comparison; symbol: string }) {
    const t = useTranslations('ChartStudy');
    const locale = useLocale();
    const titleId = useId();
    const [selection, setSelection] = useState<number | null>(null);
    const points = comparison.points;
    const active = Math.max(0, Math.min(selection ?? points.length - 1, points.length - 1));
    const current = points[active];
    const percent = (value: number) => `${value > 0 ? '+' : ''}${value.toLocaleString(locale, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%`;
    const all = points.flatMap(point => [point.stock, point.benchmark]);
    const min = Math.min(0, ...all), max = Math.max(0, ...all);
    const span = Math.max(max - min, 1), bottom = min - span * 0.1, top = max + span * 0.1;
    const x = (i: number) => 58 + i / (points.length - 1) * 628;
    const y = (value: number) => 18 + (top - value) / (top - bottom) * 176;
    const path = (key: 'stock' | 'benchmark') => points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(2)},${y(p[key]).toFixed(2)}`).join(' ');
    return <div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="font-semibold text-brand-ink">━ {symbol} {percent(current.stock)}</span>
            <span className="font-semibold text-foreground">┄ SPY {percent(current.benchmark)}</span>
            <span className="ms-auto mono text-xs text-faint">{current.date}</span>
        </div>
        <svg viewBox="0 0 720 228" className="mt-3 w-full touch-pan-y" role="img" aria-labelledby={titleId}
            onPointerMove={event => { const rect = event.currentTarget.getBoundingClientRect(); const px = (event.clientX - rect.left) / rect.width * 720; setSelection(Math.max(0, Math.min(points.length - 1, Math.round((px - 58) / 628 * (points.length - 1))))); }}>
            <title id={titleId}>{t('chartLabel', { symbol })}</title>
            {[min, 0, max].filter((v, i, values) => values.indexOf(v) === i).map(value => <g key={value}>
                <line x1="58" x2="686" y1={y(value)} y2={y(value)} stroke="var(--line)" strokeDasharray="3 5" />
                <text x="50" y={y(value) + 4} textAnchor="end" fontSize="11" fill="var(--faint)">{value.toFixed(1)}%</text>
            </g>)}
            <path d={path('stock')} stroke="var(--brand-ink)" strokeWidth="2.5" fill="none" />
            <path d={path('benchmark')} stroke="var(--text)" strokeOpacity="0.7" strokeWidth="2" strokeDasharray="6 4" fill="none" />
            <line x1={x(active)} x2={x(active)} y1="18" y2="194" stroke="var(--faint)" strokeDasharray="2 4" />
            <circle cx={x(active)} cy={y(current.stock)} r="4" fill="var(--brand-ink)" />
            <circle cx={x(active)} cy={y(current.benchmark)} r="4" fill="var(--text)" />
            <text x="58" y="218" fontSize="11" fill="var(--faint)">{points[0].date}</text>
            <text x="686" y="218" textAnchor="end" fontSize="11" fill="var(--faint)">{points.at(-1)!.date}</text>
        </svg>
        <label className="flex flex-col gap-2 text-xs text-faint">
            {t('keyboard')}
            <input type="range" min="0" max={points.length - 1} value={active} onChange={event => setSelection(Number(event.target.value))}
                aria-label={t('selectedDate')} aria-valuetext={`${current.date} ${symbol} ${percent(current.stock)} SPY ${percent(current.benchmark)}`} className="min-h-11 w-full accent-[var(--brand)]" />
        </label>
        <details className="mt-4 text-xs text-faint">
            <summary className="cursor-pointer py-2 font-semibold">{t('table')}</summary>
            <div className="max-h-60 overflow-auto rounded-lg border border-line">
                <table className="data-table"><thead><tr><th>{t('date')}</th><th className="is-num">{symbol}</th><th className="is-num">SPY</th></tr></thead>
                    <tbody>{points.map(point => <tr key={point.date}><td className="mono">{point.date}</td><td className="is-num">{percent(point.stock)}</td><td className="is-num">{percent(point.benchmark)}</td></tr>)}</tbody>
                </table>
            </div>
        </details>
    </div>;
}

export default function ChartStudy({ symbol, initialData }: { symbol: string; initialData?: StudyData }) {
    const t = useTranslations('ChartStudy');
    const locale = useLocale();
    const [data, setData] = useState<StudyData | null>(initialData ?? null);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);
    const [window, setWindow] = useState<StudyWindow>(63);
    useEffect(() => {
        if (initialData) { setData(initialData); setLoading(false); return; }
        let cancelled = false;
        setLoading(true); setError(null);
        getChartStudy(symbol).then(result => {
            if (cancelled) return;
            if (result.data) setData(result.data);
            else { setData(null); setError(result.error); }
        }).catch(() => { if (!cancelled) { setData(null); setError('unavailable'); } })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [symbol, initialData, attempt]);
    const refresh = <button type="button" className="icon-btn" aria-label={t('refresh')} title={t('refresh')} disabled={loading} onClick={() => setAttempt(value => value + 1)}><RefreshCw className={loading ? 'animate-spin' : ''} /></button>;
    const summary = data ? summarizeHistory(data.stock.bars, window) : null;
    if (loading && !data) return <Panel title={t('title')} sub={t('subtitle')}>
        <div className="p-5" role="status" aria-live="polite"><p className="text-sm text-faint">{t('loading')}</p><div className="mt-4 grid grid-cols-2 gap-3">{[0, 1, 2, 3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-hover" />)}</div></div>
    </Panel>;
    if (!data || !summary) return <Panel title={t('title')} sub={t('subtitle')}><div className="empty-state py-8" role="status">
        <p>{t(error === 'limited' ? 'limited' : error === 'auth' ? 'auth' : error === 'invalid' ? 'unsupported' : 'unavailable')}</p>
        <button type="button" className="btn btn-ghost mt-3" onClick={() => setAttempt(value => value + 1)}>{t('retry')}</button>
    </div></Panel>;
    const comparison = data.benchmark ? compareHistory(data.stock.bars, data.benchmark.bars, window) : null;
    const amount = (value: number | null, digits = 2) => value === null ? t('insufficient') : value.toLocaleString(locale, { maximumFractionDigits: digits, minimumFractionDigits: 2 });
    const precision = (value: number) => value >= 1 ? 2 : Math.min(10, Math.max(4, -Math.floor(Math.log10(value)) + 2));
    const money = (value: number) => `${amount(value, precision(value))} ${data.stock.currency}`;
    const percent = (value: number) => `${value > 0 ? '+' : ''}${amount(value)}%`;
    const alert = (price: number, condition: 'ABOVE' | 'BELOW', label: string) => <CreateAlertModal symbol={symbol} currentPrice={summary.latest.close} currency={data.stock.currency} initialTargetPrice={Number(price.toFixed(precision(price)))} initialCondition={condition}>
        <button type="button" className="btn btn-ghost min-h-11 sm:min-h-9 px-2 text-xs" aria-label={`${label} · ${t('alert')}`}><Bell className="size-3.5" />{t('alert')}</button>
    </CreateAlertModal>;
    return <Panel title={t('title')} sub={t('source', { date: summary.latest.date })} action={refresh}>
        <div className="flex flex-col gap-5 p-3 sm:p-4" aria-busy={loading}>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('range')}>
                <span className="me-2 text-xs text-faint">{t('range')}</span>
                {STUDY_WINDOWS.map(count => <button key={count} type="button" className={`pill min-h-11 sm:min-h-9 px-3 ${window === count ? 'is-brand' : ''}`} aria-pressed={window === count} onClick={() => setWindow(count)}>{t('days', { count })}</button>)}
                <span className="ms-auto text-xs text-faint">{t('coverage', { count: summary.count })}</span>
            </div>
            {summary.count < window && <p className="text-xs text-warn">{t('shortHistory', { count: summary.count })}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-line p-3"><p className="text-xs text-faint">{t('high')}</p><p className="mt-2 num text-xl font-semibold">{money(summary.high.high)}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><span className="mono text-xs text-faint">{summary.high.date}</span>{alert(summary.high.high, 'ABOVE', t('high'))}</div>
                    <p className="mt-2 text-xs text-faint">{t('distanceHigh')} {percent(summary.distanceHigh)}</p>
                </div>
                <div className="rounded-xl border border-line p-3"><p className="text-xs text-faint">{t('low')}</p><p className="mt-2 num text-xl font-semibold">{money(summary.low.low)}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><span className="mono text-xs text-faint">{summary.low.date}</span>{alert(summary.low.low, 'BELOW', t('low'))}</div>
                    <p className="mt-2 text-xs text-faint">{t('distanceLow')} {percent(summary.distanceLow)}</p>
                </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
                {([{ key: 'ma20', period: 20 }, { key: 'ma60', period: 60 }, { key: 'ma200', period: 200 }] as const).map(({ key, period }) => {
                    const value = summary[key];
                    return <div key={key} className="rounded-xl bg-page p-3"><p className="text-xs font-semibold">MA{period}</p><p className="mt-2 num font-semibold">{value === null ? t('insufficient') : money(value)}</p>
                        {value !== null && <><p className="mt-2 text-xs text-faint">{t(summary.latest.close > value ? 'above' : summary.latest.close < value ? 'below' : 'equal')}</p>{alert(value, value >= summary.latest.close ? 'ABOVE' : 'BELOW', `MA${period}`)}</>}
                    </div>;
                })}
            </div>
            <div className="rounded-xl border border-line p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-3"><h3 className="text-sm font-semibold">{t('volume')}</h3><span className="num text-lg font-semibold">{summary.volumeRatio === null ? t('insufficient') : t('times', { value: amount(summary.volumeRatio) })}</span></div>
                <p className="mt-2 text-xs text-faint">{t('volumeNumbers', { current: summary.latest.volume === null ? '—' : summary.latest.volume.toLocaleString(locale, { maximumFractionDigits: 0 }), average: summary.averageVolume === null ? '—' : amount(summary.averageVolume) })}</p>
                <p className="mt-2 text-xs leading-5 text-faint">{t('volumeNote')}</p>
            </div>
            <div className="rounded-xl border border-line p-3">
                <h3 className="text-sm font-semibold">{t('comparisonTitle')}</h3>
                {comparison ? <><p className="my-2 text-xs text-faint">{t(comparison.adjusted ? 'adjusted' : 'raw')} · {t('spread', { value: `${comparison.spread > 0 ? '+' : ''}${amount(comparison.spread)}` })}</p><PerformanceChart key={`${symbol}:${window}`} comparison={comparison} symbol={symbol} /></> : <p className="mt-3 text-sm text-faint">{t('noComparison')}</p>}
            </div>
            <details className="text-xs leading-6 text-faint"><summary className="cursor-pointer py-2 font-semibold">{t('methodTitle')}</summary><p>{t('method')}</p><p className="mt-2 mono">{summary.start} — {summary.latest.date} · {data.stock.timezone}</p></details>
        </div>
    </Panel>;
}
