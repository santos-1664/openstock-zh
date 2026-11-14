import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const user=vi.fn(),limited=vi.fn(),fetcher=vi.fn();
vi.mock('@/lib/better-auth/auth',()=>({requireUserId:()=>user()}));
vi.mock('@/lib/rate-limit',()=>({isRateLimited:(...args:unknown[])=>limited(...args)}));
import { getChartStudy } from '@/lib/actions/chart-study.actions';
const valid={chart:{result:[{timestamp:[1735828200],meta:{currency:'USD'},indicators:{quote:[{open:[10],high:[12],low:[9],close:[11],volume:[100]}]}}]}};
beforeEach(()=>{vi.resetAllMocks();user.mockResolvedValue('owner');limited.mockResolvedValue(false);fetcher.mockResolvedValue({ok:true,json:async()=>valid});vi.stubGlobal('fetch',fetcher);});
afterEach(()=>vi.unstubAllGlobals());
describe('authenticated chart data',()=>{
    it('requires a session before querying either provider',async()=>{user.mockRejectedValue(new Error('unauthorized'));expect(await getChartStudy('AAPL')).toEqual({error:'auth'});expect(fetcher).not.toHaveBeenCalled();});
    it('rejects unsafe symbols and enforces per-user limits',async()=>{expect(await getChartStudy('https://example.com')).toEqual({error:'invalid'});expect(fetcher).not.toHaveBeenCalled();limited.mockResolvedValue(true);expect(await getChartStudy('AAPL')).toEqual({error:'limited'});expect(limited).toHaveBeenCalledWith('chart-study:owner',20,60);expect(fetcher).not.toHaveBeenCalled();});
    it('uses bounded, shared history requests and deduplicates SPY against itself',async()=>{const r=await getChartStudy('SPY');expect(r.data?.stock.bars).toHaveLength(1);expect(fetcher).toHaveBeenCalledTimes(1);expect(fetcher.mock.calls[0][0]).toContain('/chart/SPY?interval=1d&range=2y');expect(fetcher.mock.calls[0][1].next.revalidate).toBe(300);});
    it('keeps stock statistics when the benchmark provider fails',async()=>{fetcher.mockImplementation(async(url:string)=>url.includes('/SPY?')?{ok:false}:{ok:true,json:async()=>valid});const r=await getChartStudy('AAPL');expect(r.data?.stock.bars).toHaveLength(1);expect(r.data?.benchmark).toBeNull();});
    it('reports unavailable history instead of returning fabricated prices',async()=>{fetcher.mockResolvedValue({ok:true,json:async()=>({chart:{result:null}})});expect(await getChartStudy('AAPL')).toEqual({error:'unavailable'});});
});
