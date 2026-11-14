'use client';

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import TradingViewWidget from "@/components/TradingViewWidget";
import Panel from "@/components/Panel";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CANDLE_CHART_WIDGET_CONFIG } from "@/lib/constants";

import { CHART_INDICATORS as INDICATORS, CHART_PRESETS, chartSettingsKey, decodeChartSettings, type ChartSettings } from '@/lib/chart-preferences';

const CHART_HEIGHT = 560;
const readSaved = (symbol: string): ChartSettings => {
    try {
        return decodeChartSettings(JSON.parse(localStorage.getItem(chartSettingsKey(symbol)) ?? localStorage.getItem('openstock:chart-indicators') ?? '{}'));
    } catch { return decodeChartSettings(null); }
};

export default function StockChart({ tvSymbol, scriptUrl }: { tvSymbol: string; scriptUrl: string }) {
    const t = useTranslations('StockChart');
    const tw = useTranslations('TradingViewWidget');
    const tools = useTranslations('ChartStudy');
    const locale = useLocale();
    const [settings, setSettings] = useState<ChartSettings | null>(null);
    useEffect(() => setSettings(readSaved(tvSymbol)), [tvSymbol]);
    const studies = settings?.studies ?? null;
    const save = (next: ChartSettings) => {
        setSettings(next);
        try { localStorage.setItem(chartSettingsKey(tvSymbol), JSON.stringify(next)); } catch { /* private mode: retain this visit's state */ }
    };
    const toggle = (id: string) => {
        if (!settings) return;
        const next = INDICATORS.map(i => i.id).filter(key => key === id ? !settings.studies.includes(key) : settings.studies.includes(key));
        save({ ...settings, studies: next });
    };

    const matchesPreset = (ids: readonly string[]) => studies !== null && studies.length === ids.length && ids.every(id => studies.includes(id));

    const menu = (
        <DropdownMenu>
            <DropdownMenuTrigger className="btn btn-ghost h-8 px-2.5 text-[13px]" disabled={!studies}>
                <SlidersHorizontal /> {t('indicatorsButton')}{studies?.length ? <span className="num text-faint">{studies.length}</span> : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-[12px] font-normal text-faint">{tools('savedPerStock')}</DropdownMenuLabel>
                {INDICATORS.map(({ id, labelKey }) => (
                    <DropdownMenuCheckboxItem key={id} checked={studies?.includes(id) ?? false} onCheckedChange={() => toggle(id)} onSelect={(e) => e.preventDefault()}>
                        {t(`indicators.${labelKey}`)}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <Panel title={t('title')} sub={t('sub')} action={menu}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-line px-3 py-3">
                <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={tools('interval')}>
                    {(['D', 'W', 'M'] as const).map(interval => <button key={interval} type="button" disabled={!settings} aria-pressed={settings?.interval === interval}
                        className={`pill min-h-11 sm:min-h-9 px-3 ${settings?.interval === interval ? 'is-brand' : ''}`} onClick={() => settings && save({ ...settings, interval })}>
                        {tools(interval === 'D' ? 'day' : interval === 'W' ? 'week' : 'month')}
                    </button>)}
                </div>
                <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={tools('presets')}>
                    {CHART_PRESETS.map(preset => <button key={preset.key} type="button" disabled={!settings}
                        aria-pressed={matchesPreset(preset.studies)}
                        className={`pill min-h-11 sm:min-h-9 px-3 ${matchesPreset(preset.studies) ? 'is-brand' : ''}`} onClick={() => settings && save({ ...settings, studies: [...preset.studies] })}>{tools(preset.key)}</button>)}
                </div>
                <p className="w-full text-xs leading-5 text-faint">{tools('settingsHint')}</p>
            </div>
            {settings ? (
                <TradingViewWidget scriptUrl={scriptUrl} config={{ ...CANDLE_CHART_WIDGET_CONFIG(tvSymbol, locale), studies: settings.studies, interval: settings.interval }} height={CHART_HEIGHT} allowExpand
                    labels={{ fullScreen: tw('fullScreen'), exitFullScreen: tw('exitFullScreen'), exitFullScreenHint: tw('exitFullScreenHint') }} />
            ) : (
                <div className="tv-frame" style={{ height: CHART_HEIGHT }} />
            )}
        </Panel>
    );
}
