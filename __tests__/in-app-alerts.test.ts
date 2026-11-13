import { beforeEach, describe, expect, it, vi } from 'vitest';

const userId = vi.fn();
const limited = vi.fn();
const quotes = vi.fn();
const find = vi.fn();
const claim = vi.fn();
const lean = vi.fn();
vi.mock('@/lib/better-auth/auth', () => ({ requireUserId: () => userId() }));
vi.mock('@/lib/rate-limit', () => ({ isRateLimited: (...args: unknown[]) => limited(...args) }));
vi.mock('@/lib/market-data', () => ({ alertsEnabled: true, inAppAlertsEnabled: true }));
vi.mock('@/lib/actions/finnhub.actions', () => ({ getLiveQuotes: (...args: unknown[]) => quotes(...args) }));
vi.mock('@/database/mongoose', () => ({ connectToDatabase: vi.fn().mockResolvedValue({}) }));
vi.mock('@/database/models/alert.model', () => ({ alertModel: () => ({ find: (...args: unknown[]) => find(...args), findOneAndUpdate: (...args: unknown[]) => claim(...args) }) }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { checkUserAlerts } from '@/lib/actions/alert.actions';

describe('in-app alert checks', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        userId.mockResolvedValue('owner');
        limited.mockResolvedValue(false);
        find.mockReturnValue({ limit: () => ({ lean }) });
        lean.mockResolvedValue([{ _id: 'alert-1', userId: 'owner', symbol: 'AAPL', condition: 'ABOVE', targetPrice: 100 }]);
        quotes.mockResolvedValue({ AAPL: { c: 101, t: Date.now() / 1000 } });
    });

    it('claims only the owner’s active, unexpired alert and records the actual trigger price', async () => {
        claim.mockResolvedValue({ _id: 'alert-1' });
        await expect(checkUserAlerts()).resolves.toEqual([{ id: 'alert-1', symbol: 'AAPL', price: 101, target: 100 }]);
        expect(find).toHaveBeenCalledWith({ userId: 'owner', active: true, triggered: false, expiresAt: { $gt: expect.any(Date) } });
        expect(claim).toHaveBeenCalledWith(
            { _id: 'alert-1', userId: 'owner', active: true, triggered: false, expiresAt: { $gt: expect.any(Date) } },
            { $set: { active: false, triggered: true, triggerPrice: 101, triggeredAt: expect.any(Date) } },
            { new: true },
        );
    });
    it('does not emit duplicate notices if another tab already claimed the alert', async () => {
        claim.mockResolvedValueOnce({ _id: 'alert-1' }).mockResolvedValueOnce(null);
        const results = await Promise.all([checkUserAlerts(), checkUserAlerts()]);
        expect(results.flat()).toHaveLength(1);
    });
    it('does not consume an alert when no valid quote exists', async () => {
        quotes.mockResolvedValue({ AAPL: null });
        await expect(checkUserAlerts()).resolves.toEqual([]);
        expect(claim).not.toHaveBeenCalled();
    });
    it('rejects signed-out access and stops rate-limited checks before reading alerts', async () => {
        userId.mockRejectedValueOnce(new Error('Unauthorized'));
        await expect(checkUserAlerts()).rejects.toThrow('Unauthorized');
        expect(find).not.toHaveBeenCalled();
        limited.mockResolvedValueOnce(true);
        await expect(checkUserAlerts()).resolves.toEqual([]);
        expect(find).not.toHaveBeenCalled();
    });
});
