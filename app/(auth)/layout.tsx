import { isGoogleSignInReady } from '@/lib/auth-readiness';
import Link from "next/link";
import React from "react";
import Image from "next/image";
import {redirect} from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import HtmlLang from "@/components/HtmlLang";
import {getSession} from "@/lib/better-auth/auth";
import { SocialProvidersProvider } from "@/components/forms/SocialAuthButtons";

const Layout = async ({ children }: { children : React.ReactNode }) => {

    const session = process.env.MONGODB_URI ? await getSession() : null;

    if (session?.user) redirect('/dashboard')

    const locale = await getLocale();

    // Same condition that enables the providers in lib/better-auth/auth.ts
    const socialProviders = [
        ...(isGoogleSignInReady() ? ['google' as const] : []),
        ...(process.env.GITHUB_CLIENT_ID ? ['github' as const] : []),
    ];
    return (
        <NextIntlClientProvider>
        <HtmlLang locale={locale} />
        <main className="min-h-dvh grid place-items-center bg-page px-5 py-10">
            <section className="flex w-full max-w-[420px] flex-col gap-8">
                <Link href="/" className="auth-logo flex items-center gap-2">
                    <Image src="/assets/images/logo.png" alt="OpenStock" width={140} height={35} priority />
                </Link>

                <div className="pb-6 lg:pb-8 flex-1">
                    <SocialProvidersProvider enabled={socialProviders}>{children}</SocialProvidersProvider>
                </div>
            </section>


        </main>
        </NextIntlClientProvider>
    )
}
export default Layout
