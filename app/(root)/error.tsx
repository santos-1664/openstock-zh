'use client';

import { useTranslations } from 'next-intl';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations('AppFeedback');
    return <section className="hatch" role="alert">
        <div className="card p-6">
            <h1 className="text-xl font-semibold">{t('errorTitle')}</h1>
            <p className="mt-2 text-faint">{t('errorBody')}</p>
            <button type="button" className="btn btn-primary mt-5" onClick={reset}>{t('retry')}</button>
        </div>
    </section>;
}
