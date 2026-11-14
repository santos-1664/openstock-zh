export const CHART_INDICATORS = [
    { id: 'STD;SMA', labelKey: 'sma' }, { id: 'STD;EMA', labelKey: 'ema' },
    { id: 'STD;Bollinger_Bands', labelKey: 'bollingerBands' }, { id: 'STD;VWAP', labelKey: 'vwap' },
    { id: 'STD;RSI', labelKey: 'rsi' }, { id: 'STD;MACD', labelKey: 'macd' },
    { id: 'STD;Stochastic', labelKey: 'stochastic' }, { id: 'STD;Average_True_Range', labelKey: 'atr' },
] as const;
export const CHART_PRESETS = [
    { key: 'trend', studies: ['STD;SMA', 'STD;EMA'] },
    { key: 'momentum', studies: ['STD;RSI', 'STD;MACD'] },
    { key: 'volatility', studies: ['STD;Bollinger_Bands', 'STD;Average_True_Range'] },
    { key: 'clean', studies: [] },
] as const;
export type ChartSettings = { interval: 'D' | 'W' | 'M'; studies: string[] };
export const chartSettingsKey = (symbol: string) => `openstock:chart-settings:${symbol}`;
export function decodeChartSettings(value: unknown): ChartSettings {
    const source = value !== null && typeof value === 'object' ? value as Record<string, unknown> : {};
    const ids: unknown[] = Array.isArray(value) ? value : Array.isArray(source.studies) ? source.studies : [];
    return { interval: source.interval === 'W' || source.interval === 'M' ? source.interval : 'D',
        studies: CHART_INDICATORS.map(i => i.id).filter(id => ids.includes(id)) };
}
