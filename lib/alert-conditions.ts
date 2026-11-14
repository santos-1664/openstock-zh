import { isQuoteHealthy, type LiveQuote } from '@/lib/quote-health';

export function isAlertConditionMet(
    alert: { condition: string; targetPrice: number; symbol?: string },
    quote: LiveQuote | null | undefined,
    now = Date.now(),
) {
    if (!Number.isFinite(quote?.c) || !(quote!.c! > 0) || !Number.isFinite(alert.targetPrice) || alert.targetPrice <= 0) return false;
    if (!isQuoteHealthy(quote, alert.symbol, now)) return false;
    return alert.condition === 'ABOVE' ? quote!.c! >= alert.targetPrice
        : alert.condition === 'BELOW' ? quote!.c! <= alert.targetPrice : false;
}

// Keep monitoring counts aligned with the server's trigger eligibility.
export function isAlertMonitoring(alert: { active?: boolean; triggered?: boolean; expiresAt?: string | Date }, now = Date.now()) {
    if (alert.triggered || alert.active === false) return false;
    if (!alert.expiresAt) return true;
    const expires = new Date(alert.expiresAt).getTime();
    return Number.isFinite(expires) && expires > now;
}
