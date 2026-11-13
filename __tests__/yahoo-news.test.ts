import { afterEach, describe, expect, it, vi } from 'vitest';
import { getYahooNews } from '@/lib/actions/yahoo.actions';
const story = (link: string, time: number) => ({title: link, link: `https://finance.yahoo.com/${link}`, providerPublishTime: time});
afterEach(() => vi.unstubAllGlobals());
describe('watchlist news', () => {
    it('queries each ticker separately, deduplicates and sorts newest first', async () => {
        const queries: string[] = [];
        vi.stubGlobal('fetch', vi.fn(async (url: string) => {
            const q = new URL(url).searchParams.get('q')!; queries.push(q);
            return {ok:true,json:async () => ({news:q==='VOO' ? [story('shared',1),story('older',0)] : [story('shared',1),story('newer',2)]})};
        }));
        const rows=await getYahooNews(['VOO','NVDA','VOO']);
        expect(queries).toEqual(['VOO','NVDA']);
        expect(rows.map(r=>r.headline)).toEqual(['newer','shared','older']);
    });
    it('keeps successful news when one ticker fails', async () => {
        vi.stubGlobal('fetch', vi.fn(async (url:string) => {
            if(new URL(url).searchParams.get('q')==='VOO') throw new Error('network');
            return {ok:true,json:async()=>({news:[story('available',1)]})};
        }));
        expect(await getYahooNews(['VOO','NVDA'])).toHaveLength(1);
    });
    it('reports an outage when every request fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
        await expect(getYahooNews(['VOO'])).rejects.toThrow('temporarily unavailable');
    });
});
