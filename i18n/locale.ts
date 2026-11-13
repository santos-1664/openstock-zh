import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from '@/i18n/config';

// Respect an explicit selection; otherwise use this installation's Chinese default.
export async function resolveLocale(): Promise<Locale> {
    const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
    return isLocale(saved) ? saved : DEFAULT_LOCALE;
}
