'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { pollUserAlerts } from '@/lib/actions/alert.actions';
import { inAppAlertsEnabled } from '@/lib/market-data';
import { formatPrice } from '@/lib/utils';

export default function AlertMonitor({ initialCount = null }: { initialCount?: number | null }) {
    const [active, setActive] = useState(initialCount !== 0);
    useEffect(() => { setActive(initialCount !== 0); }, [initialCount]);
    useEffect(() => { const wake = () => setActive(true); window.addEventListener('openstock:check-alerts', wake); return () => window.removeEventListener('openstock:check-alerts', wake); }, []);
    const router = useRouter();
    const t = useTranslations('AlertMonitor');
    useEffect(() => {
        if (!inAppAlertsEnabled || !active) return;
        let stopped = false;
        let running = false;
        let reportedError = false;
        const check = async () => {
            if (stopped || running || document.visibilityState !== 'visible') return;
            running = true;
            try {
                const { triggered, activeCount } = await pollUserAlerts();
                if (!stopped && activeCount === 0) setActive(false);
                if (stopped) return;
                reportedError = false;
                for (const alert of triggered) toast(t('triggered', { symbol: alert.symbol }), {
                    id: `price-alert:${alert.id}`, description: t('price', { price: formatPrice(alert.price, alert.currency), target: formatPrice(alert.target, alert.currency) }), duration: 12_000,
                });
                if (triggered.length) router.refresh();
            } catch {
                if (!stopped && !reportedError) toast.error(t('checkFailed'));
                reportedError = true;
            } finally { running = false; }
        };
        void check();
        const timer = setInterval(check, 60_000);
        document.addEventListener('visibilitychange', check);
        window.addEventListener('openstock:check-alerts', check);
        return () => {
            stopped = true;
            clearInterval(timer);
            document.removeEventListener('visibilitychange', check);
            window.removeEventListener('openstock:check-alerts', check);
        };
    }, [router, t, active]);
    return null;
}
