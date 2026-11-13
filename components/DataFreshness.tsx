'use client';

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DATA_MODE, isRealtime } from "@/lib/market-data";

type DataFreshnessLabels = { live: string; delayed: string; asOf: (time: string) => string };

// English for the marketing preview, which renders outside NextIntlClientProvider
const ENGLISH: DataFreshnessLabels = {
    live: '实时 · 每 15 秒更新',
    delayed: DATA_MODE === 'cached' ? '延时行情 · 每小时更新' : '延时行情 · 5 分钟缓存',
    asOf: (time) => `截至 ${time} · ${DATA_MODE === 'cached' ? '每小时更新' : '5 分钟缓存'}`,
};

// Honest label for how old a number is: "Live" in realtime mode, otherwise the time of the last trade.
// The time is formatted after mount, in the viewer's own time zone, so server and browser never disagree.
const DataFreshness = ({ tradeTime, source, locale = 'zh-CN', labels = ENGLISH }: { tradeTime?: number; source?: string; locale?: string; labels?: DataFreshnessLabels }) => {
    const [asOf, setAsOf] = useState<string | null>(null);

    useEffect(() => {
        setAsOf(tradeTime
            ? new Date(tradeTime * 1000).toLocaleString(locale, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
            : null);
    }, [tradeTime, locale]);

    if (isRealtime && source !== 'Yahoo Finance') {
        return <span className="inline-flex items-center gap-1.5 text-[12px] text-faint"><span className="live-dot" /> {labels.live}</span>;
    }
    return <span className="text-[12px] text-faint">{asOf ? labels.asOf(asOf) : labels.delayed}</span>;
};

// The same label in the viewer's language, for pages inside NextIntlClientProvider
export const LocalizedDataFreshness = ({ tradeTime, source }: { tradeTime?: number; source?: string }) => {
    const t = useTranslations('DataFreshness');
    const locale = useLocale();
    const fiveMinutes = DATA_MODE === 'delayed' || source === 'Yahoo Finance';
    return <DataFreshness tradeTime={tradeTime} source={source} locale={locale} labels={{ live: t('live'), delayed: t(fiveMinutes ? 'delayedFiveMinutes' : 'delayed'), asOf: (time) => t(fiveMinutes ? 'asOfFiveMinutes' : 'asOf', { time }) }} />;
};

export default DataFreshness;
