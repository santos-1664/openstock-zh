'use server';

import { connectToDatabase } from '@/database/mongoose';
import { alertModel } from '@/database/models/alert.model';
import { revalidatePath } from 'next/cache';
import { requireUserId } from '@/lib/better-auth/auth';
import { normalizeYahooQuoteSymbol } from '@/lib/yahoo';
import { alertsEnabled, inAppAlertsEnabled } from '@/lib/market-data';
import { getLiveQuotes } from '@/lib/actions/finnhub.actions';
import { isRateLimited } from '@/lib/rate-limit';
import { legacyQuoteCurrency } from '@/lib/quote-health';
import { isAlertConditionMet } from '@/lib/alert-conditions';

// A ticker (AAPL, BRK.B) or a Binance pair. Anything else, including markup, is rejected:
// the symbol ends up in alert emails.
const SYMBOL_PATTERN = /^(BINANCE:[A-Z0-9]{2,20}|[A-Z0-9][A-Z0-9.-]{0,14})$/;
const CONDITIONS = ['ABOVE', 'BELOW'];
// The checker re-prices every active alert's symbol through Finnhub every 5 minutes
const MAX_ACTIVE_ALERTS = 50;

// Create a new alert. Server actions take untrusted input, so only validated fields are stored.
export async function createAlert(params: {
    symbol: string;
    targetPrice: number;
    condition: 'ABOVE' | 'BELOW';
}) {
    const userId = await requireUserId();
    if (!alertsEnabled) throw new Error('Price alerts are part of OpenStock Cloud');
    const symbol = String(params.symbol ?? '').trim().toUpperCase();
    const targetPrice = Number(params.targetPrice);
    const condition = params.condition;

    if (!SYMBOL_PATTERN.test(symbol)) throw new Error('Invalid symbol');
    if (!CONDITIONS.includes(condition)) throw new Error('Invalid condition');
    // The alert checker prices symbols through Finnhub, whose free plan covers US stocks and crypto
    if (!normalizeYahooQuoteSymbol(symbol)) throw new Error('Unsupported market symbol');
    if (!Number.isFinite(targetPrice) || targetPrice <= 0) throw new Error('Target price must be a positive number');

    const db = await connectToDatabase();
    const Alert = alertModel(db);
    if (await Alert.countDocuments({ userId, active: true }) >= MAX_ACTIVE_ALERTS) {
        throw new Error(`You can have up to ${MAX_ACTIVE_ALERTS} active alerts`);
    }

    try {
        // expiresAt and triggered come from the schema defaults, never from the caller
        const quote = (await getLiveQuotes([symbol]))?.[symbol];
        const currency = quote?.currency ?? legacyQuoteCurrency(symbol);
        if (!currency) throw new Error('Quote currency unavailable');
        const newAlert = await Alert.create({ userId, symbol, targetPrice, condition, currency, active: true });
        revalidatePath('/watchlist');
        return JSON.parse(JSON.stringify(newAlert));
    } catch (error) {
        console.error('Error creating alert:', error);
        throw new Error('Failed to create alert');
    }
}

// Get all alerts for a user
export async function getUserAlerts() {
    const userId = await requireUserId();
    try {
        const alerts = await alertModel(await connectToDatabase()).find({ userId }).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(alerts)).map((alert: { symbol: string; currency?: string }) => ({ ...alert, currency: alert.currency ?? legacyQuoteCurrency(alert.symbol) }));
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return [];
    }
}

// Personal deployments can deliver alerts inside the app, without an SMTP account or paid scheduler.
// The owner and atomic active/triggered filter prevent cross-account reads and duplicate notifications.
async function runAlertCheck() {
    const userId = await requireUserId();
    if (!inAppAlertsEnabled || await isRateLimited(`alerts:user:${userId}`, 4, 60)) return { triggered: [], activeCount: null };
    const now = new Date();
    const Alert = alertModel(await connectToDatabase());
    const active = await Alert.find({ userId, active: true, triggered: false, expiresAt: { $gt: now } }).limit(50).lean();
    if (!active.length) return { triggered: [], activeCount: 0 };
    const quotes = await getLiveQuotes([...new Set(active.map((a) => a.symbol))]);
    const triggered: { id: string; symbol: string; price: number; target: number; currency: string | null }[] = [];
    for (const alert of active) {
        const quote = quotes[alert.symbol];
        if (!isAlertConditionMet(alert, quote)) continue;
        const claimed = await Alert.findOneAndUpdate(
            { _id: alert._id, userId, active: true, triggered: false, expiresAt: { $gt: now } },
            { $set: { active: false, triggered: true, triggeredAt: now, triggerPrice: quote!.c, currency: quote?.currency ?? alert.currency ?? legacyQuoteCurrency(alert.symbol) } },
            { new: true },
        );
        if (claimed) triggered.push({ id: String(alert._id), symbol: alert.symbol, price: quote!.c!, target: alert.targetPrice, currency: quote?.currency ?? alert.currency ?? legacyQuoteCurrency(alert.symbol) });
    }
    return { triggered, activeCount: active.length - triggered.length };
}

export async function checkUserAlerts() { return (await runAlertCheck()).triggered; }
export async function pollUserAlerts() { return runAlertCheck(); }
export async function getActiveAlertCount() {
    const userId = await requireUserId();
    if (!inAppAlertsEnabled) return 0;
    try {
        return await alertModel(await connectToDatabase()).countDocuments({ userId, active: true, triggered: false, expiresAt: { $gt: new Date() } });
    } catch { return null; }
}

// Delete an alert
export async function deleteAlert(alertId: string) {
    const userId = await requireUserId();
    try {
        await alertModel(await connectToDatabase()).findOneAndDelete({ _id: alertId, userId });
        revalidatePath('/watchlist');
        return { success: true };
    } catch (error) {
        console.error('Error deleting alert:', error);
        throw new Error('Failed to delete alert');
    }
}
