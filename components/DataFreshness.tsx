'use client';

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { isRealtime } from "@/lib/market-data";

type DataFreshnessLabels = { live: string; delayed: string; asOf: (time: string) => string };

// English for the marketing preview, which renders outside NextIntlClientProvider
const ENGLISH: DataFreshnessLabels = {
    live: '实时 · 每 15 秒更新',
    delayed: '延时行情 · 每小时更新',
    asOf: (time) => `截至 ${time} · 每小时更新`,
};

// Honest label for how old a number is: "Live" in realtime mode, otherwise the time of the last trade.
// The time is formatted after mount, in the viewer's own time zone, so server and browser never disagree.
const DataFreshness = ({ tradeTime, locale = 'zh-CN', labels = ENGLISH }: { tradeTime?: number; locale?: string; labels?: DataFreshnessLabels }) => {
    const [asOf, setAsOf] = useState<string | null>(null);

    useEffect(() => {
        setAsOf(tradeTime
            ? new Date(tradeTime * 1000).toLocaleString(locale, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
            : null);
    }, [tradeTime, locale]);

    if (isRealtime) {
        return <span className="inline-flex items-center gap-1.5 text-[12px] text-faint"><span className="live-dot" /> {labels.live}</span>;
    }
    return <span className="text-[12px] text-faint">{asOf ? labels.asOf(asOf) : labels.delayed}</span>;
};

// The same label in the viewer's language, for pages inside NextIntlClientProvider
export const LocalizedDataFreshness = ({ tradeTime }: { tradeTime?: number }) => {
    const t = useTranslations('DataFreshness');
    const locale = useLocale();
    return <DataFreshness tradeTime={tradeTime} locale={locale} labels={{ live: t('live'), delayed: t('delayed'), asOf: (time) => t('asOf', { time }) }} />;
};

export default DataFreshness;
