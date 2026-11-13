import { describe, expect, it } from 'vitest';
import { isGoogleSignInReady } from '@/lib/auth-readiness';

const complete = {
    NODE_ENV: 'production', GOOGLE_CLIENT_ID: 'test-client', GOOGLE_CLIENT_SECRET: 'test-secret',
    MONGODB_URI: 'mongodb://localhost/test', BETTER_AUTH_SECRET: 'test-session-secret',
    BETTER_AUTH_URL: 'https://example.com',
};
describe('Google provider readiness', () => {
    it('requires the OAuth pair, database, session secret and callback base URL', () => {
        expect(isGoogleSignInReady(complete)).toBe(true);
        for (const key of ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'MONGODB_URI', 'BETTER_AUTH_SECRET', 'BETTER_AUTH_URL']) {
            expect(isGoogleSignInReady({ ...complete, [key]: '' }), key).toBe(false);
        }
    });
    it('rejects insecure or invalid production callback origins', () => {
        for (const url of ['http://example.com', 'javascript:alert(1)', 'invalid']) {
            expect(isGoogleSignInReady({ ...complete, BETTER_AUTH_URL: url })).toBe(false);
        }
        expect(isGoogleSignInReady({ ...complete, NODE_ENV: 'development', BETTER_AUTH_URL: 'http://localhost:3000' })).toBe(true);
    });
});
