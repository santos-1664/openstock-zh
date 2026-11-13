export function isAlertConditionMet(
    alert: { condition: string; targetPrice: number },
    quote: { c?: number; t?: number } | null | undefined,
    now = Date.now(),
) {
    if (!Number.isFinite(quote?.c) || !(quote!.c! > 0) || !Number.isFinite(alert.targetPrice) || alert.targetPrice <= 0) return false;
    // A missing, future, or very old quote must never fire an alert.
    if (!Number.isFinite(quote?.t) || quote!.t! <= 0 || quote!.t! * 1000 > now + 60_000 || now - quote!.t! * 1000 > 7 * 86400_000) return false;
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
