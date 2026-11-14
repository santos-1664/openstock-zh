'use server';

import countryList from "react-select-country-list";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/better-auth/auth";
import { getTranslations } from "next-intl/server";

export type ProfileInput = {
    name: string;
    country: string;
};


const countries = new Set(countryList().getValues());

// Every call acts on the signed-in user's own session; nothing here takes a user id from the client.
export async function updateProfile(input: ProfileInput) {
    const t = await getTranslations('Errors');
    const name = typeof input.name === 'string' ? input.name.trim() : '';
    if (name.length < 2 || name.length > 80) return { success: false, error: t('nameLength') };
    if (!countries.has(input.country)) return { success: false, error: t('pickCountry') };

    try {
        await auth.api.updateUser({
            headers: await headers(),
            body: {
                name,
                country: input.country,
            },
        });
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (e) {
        console.error('Profile update failed', e);
        return { success: false, error: t('profileSaveFailed') };
    }
}

export async function changePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) {
    try {
        await auth.api.changePassword({
            headers: await headers(),
            body: { currentPassword, newPassword, revokeOtherSessions: true },
        });
        return { success: true };
    } catch (e) {
        console.error('Password change failed', e);
        const t = await getTranslations('Errors');
        return { success: false, error: t('passwordChangeFailed') };
    }
}
