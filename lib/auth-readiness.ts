type AuthEnvironment = Record<string, string | undefined>;

// Shared by the provider and sign-in UI so a half-configured provider is never offered.
export function isGoogleSignInReady(env: AuthEnvironment = process.env): boolean {
    if (![env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.MONGODB_URI,
        env.BETTER_AUTH_SECRET || env.AUTH_SECRET, env.BETTER_AUTH_URL].every(value => value?.trim())) return false;
    try {
        const url = new URL(env.BETTER_AUTH_URL!);
        return env.NODE_ENV === 'production' ? url.protocol === 'https:' : ['http:', 'https:'].includes(url.protocol);
    } catch {
        return false;
    }
}
