import { describe, expect, it, vi } from 'vitest';
const update = vi.hoisted(() => vi.fn().mockResolvedValue({}));
vi.mock('@/lib/better-auth/auth', () => ({ auth: { api: { updateUser: update } } }));
vi.mock('next/headers', () => ({ headers: vi.fn().mockResolvedValue({}) }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next-intl/server', () => ({ getTranslations: async () => (key: string) => key }));
import { updateProfile } from '@/lib/actions/profile.actions';
describe('profile field whitelist', () => {
    it('ignores legacy preferences and forged extra fields in profile submissions', async () => {
        await expect(updateProfile({ name: ' Example ', country: 'US', riskTolerance: 'High', investmentGoals: 'Growth', preferredIndustry: 'Technology', email: 'forged@example.com' } as never)).resolves.toEqual({ success: true });
        expect(update).toHaveBeenCalledWith({ headers: {}, body: { name: 'Example', country: 'US' } });
    });
    it('rejects a nonexistent country', async () => {
        update.mockClear();
        await expect(updateProfile({ name: 'Example', country: 'ZZ' })).resolves.toMatchObject({ success: false });
        expect(update).not.toHaveBeenCalled();
    });
});
