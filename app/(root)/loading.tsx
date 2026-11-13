import { getTranslations } from 'next-intl/server';

export default async function Loading() {
    const t = await getTranslations('AppFeedback');
    return <section aria-busy="true" aria-live="polite" className="hatch">
        <div className="card p-5">
            <p className="text-faint">{t('loading')}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[0, 1, 2, 3].map((n) => <div key={n} className="h-28 animate-pulse rounded-xl bg-hover" />)}
            </div>
        </div>
    </section>;
}
