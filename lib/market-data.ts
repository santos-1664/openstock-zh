// How fresh market numbers are. Safe to import from client components (no keys here).
//
//   delayed  (default) Quotes share a five-minute cache; the browser checks for updates every minute.
//   cached             Quotes refresh hourly.
//   realtime           Finnhub quotes refresh every 15s; Yahoo still uses a five-minute cache.
export type DataMode = 'cached' | 'delayed' | 'realtime';

export const DATA_MODE: DataMode = process.env.NEXT_PUBLIC_OPENSTOCK_DATA_MODE === 'realtime' ? 'realtime'
    : process.env.NEXT_PUBLIC_OPENSTOCK_DATA_MODE === 'cached' ? 'cached' : 'delayed';

export const QUOTE_TTL_SECONDS = DATA_MODE === 'realtime' ? 15 : DATA_MODE === 'delayed' ? 300 : 3600;

export const isRealtime = DATA_MODE === 'realtime';

// In-app alerts need no email account or external scheduler. Email mode requires explicit configuration.
export const ALERT_MODE = process.env.NEXT_PUBLIC_OPENSTOCK_ALERT_MODE === 'email' ? 'email'
    : process.env.NEXT_PUBLIC_OPENSTOCK_ALERT_MODE === 'off' ? 'off' : 'in-app';
export const alertsEnabled = ALERT_MODE !== 'off';
export const inAppAlertsEnabled = ALERT_MODE === 'in-app';
export const emailAlertsEnabled = ALERT_MODE === 'email';
