'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { checkUserAlerts } from '@/lib/actions/alert.actions';
import { inAppAlertsEnabled } from '@/lib/market-data';
import { formatPrice } from '@/lib/utils';

export default function AlertMonitor() {
    const router = useRouter();
    const t = useTranslations('AlertMonitor');
    useEffect(() => {
        if (!inAppAlertsEnabled) return;
        let stopped = false;
        let running = false;
        let reportedError = false;
        const check = async () => {
            if (stopped || running || document.visibilityState !== 'visible') return;
            running = true;
            try {
                const triggered = await checkUserAlerts();
                if (stopped) return;
                reportedError = false;
                for (const alert of triggered) toast(t('triggered', { symbol: alert.symbol }), {
                    id: `price-alert:${alert.id}`, description: t('price', { price: formatPrice(alert.price), target: formatPrice(alert.target) }), duration: 12_000,
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
    }, [router, t]);
    return null;
}
