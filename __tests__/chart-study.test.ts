import { describe, expect, it } from 'vitest';
import { compareHistory, parseDailyHistory, summarizeHistory, type DailyBar } from '@/lib/chart-study';
import { chartSettingsKey, decodeChartSettings } from '@/lib/chart-preferences';
const bar = (index: number, close = index + 10): DailyBar => ({ date: new Date(Date.UTC(2025, 0, index + 1)).toISOString().slice(0,10), time: Date.UTC(2025,0,index+1)/1000, open: close, high: close+2, low: close-2, close, adjusted: close, volume: 100 });
const response = () => ({ chart: { result: [{
    meta: { currency: 'USD', exchangeTimezoneName: 'America/New_York' },
    timestamp: [1735828200, 1735914600],
    indicators: {
        quote: [{ open: [10, 11], high: [12, 13], low: [9, 10], close: [11, 12], volume: [100, 200] }],
        adjclose: [{ adjclose: [10.5, 11.5] }],
    },
}] } });

describe('daily history parsing', () => {
    it('keeps OHLCV and adjusted close aligned by index and uses the exchange calendar date', () => {
        const history=parseDailyHistory(response())!;
        expect(history.currency).toBe('USD');
        expect(history.bars.map(b=>b.date)).toEqual(['2025-01-02','2025-01-03']);
        expect(history.bars[1]).toMatchObject({open:11,high:13,low:10,close:12,adjusted:11.5,volume:200});
    });
    it('rejects malformed candles, rather than filling missing prices with zero', () => {
        const data=response();data.chart.result[0].indicators.quote[0].close[1]=NaN;
        expect(parseDailyHistory(data)?.bars).toHaveLength(1);
        expect(parseDailyHistory({chart:{result:null}})).toBeNull();
        data.chart.result[0].indicators.quote[0].high[0]=1;
        expect(parseDailyHistory(data)).toBeNull();
    });
    it('treats invalid adjusted close and volume as unavailable without losing valid OHLC', () => {
        const data=response();data.chart.result[0].indicators.adjclose[0].adjclose[1]=0;data.chart.result[0].indicators.quote[0].volume[1]=-1;
        expect(parseDailyHistory(data)?.bars[1]).toMatchObject({adjusted:null,volume:null});
    });
    it('falls back safely for an invalid exchange timezone', () => {
        const data=response();data.chart.result[0].meta.exchangeTimezoneName='not/a/timezone';
        expect(parseDailyHistory(data)?.timezone).toBe('UTC');
    });
});
describe('range and volume statistics', () => {
    it('uses intraday extrema for range and the full history for moving averages', () => {
        const bars=Array.from({length:210},(_,i)=>bar(i));
        const s=summarizeHistory(bars,21)!;
        expect(s.count).toBe(21);expect(s.high.high).toBe(221);expect(s.low.low).toBe(197);
        expect(s.ma20).toBeCloseTo(209.5);expect(s.ma60).toBeCloseTo(189.5);expect(s.ma200).toBeCloseTo(119.5);
    });
    it('excludes the latest candle from the previous 20-day volume average', () => {
        const bars=Array.from({length:21},(_,i)=>bar(i));bars[20].volume=200;
        const s=summarizeHistory(bars,21)!;expect(s.averageVolume).toBe(100);expect(s.volumeRatio).toBe(2);
    });
    it('keeps short histories honest and never divides by an empty or zero volume baseline', () => {
        expect(summarizeHistory([],21)).toBeNull();
        const bars=[bar(0),bar(1)];expect(summarizeHistory(bars,252)).toMatchObject({count:2,ma20:null,ma200:null,volumeRatio:null});
        const zeros: DailyBar[]=Array.from({length:21},(_,i)=>({...bar(i),volume:0}));expect(summarizeHistory(zeros,21)?.volumeRatio).toBeNull();
        zeros[0].volume=null;expect(summarizeHistory(zeros,21)?.averageVolume).toBeNull();
    });
});
describe('benchmark comparison', () => {
    it('aligns on common dates and starts both series at zero on the same date', () => {
        const stock=[bar(0,10),bar(1,11),bar(2,12),bar(3,13)];const ref=[bar(1,100),bar(3,110)];
        const c=compareHistory(stock,ref,21)!;expect(c.points.map(p=>p.date)).toEqual([stock[1].date,stock[3].date]);
        expect(c.points[0]).toMatchObject({stock:0,benchmark:0});expect(c.points[1].stock).toBeCloseTo(18.1818);expect(c.points[1].benchmark).toBeCloseTo(10);
    });
    it('uses adjusted closes consistently across splits and falls back to raw for BOTH series when incomplete', () => {
        const stock: DailyBar[]=[{...bar(0,100),adjusted:50},{...bar(1,55),adjusted:55}];const ref=[bar(0,100),bar(1,110)];
        const c=compareHistory(stock,ref,21)!;expect(c.adjusted).toBe(true);expect(c.spread).toBeCloseTo(0);
        stock[1].adjusted=null;
        const raw=compareHistory(stock,ref,21)!;expect(raw.adjusted).toBe(false);expect(raw.points[1].stock).toBeCloseTo(-45);expect(raw.points[1].benchmark).toBeCloseTo(10);
    });
    it('returns no comparison when common history is insufficient', () => {
        expect(compareHistory([bar(0)],[bar(1)],21)).toBeNull();
        expect(compareHistory([bar(0)],[bar(0)],21)).toBeNull();
    });
});
describe('per-stock chart settings', () => {
    it('migrates the old indicator array and filters unknown or duplicate identifiers', () => {
        expect(decodeChartSettings(['STD;SMA','external-script','STD;SMA'])).toEqual({interval:'D',studies:['STD;SMA']});
        expect(decodeChartSettings({interval:'W',studies:['STD;RSI']})).toEqual({interval:'W',studies:['STD;RSI']});
        expect(decodeChartSettings({interval:'bogus',studies:'bad'})).toEqual({interval:'D',studies:[]});
        expect(chartSettingsKey('NASDAQ:AAPL')).not.toBe(chartSettingsKey('NASDAQ:MSFT'));
    });
});
