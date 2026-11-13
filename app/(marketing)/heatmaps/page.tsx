import type { Metadata } from 'next';
import Link from 'next/link';
import IndexHeatmaps from '@/components/IndexHeatmaps';
import PageHero from '@/components/marketing/PageHero';

export const metadata: Metadata = {
    title: '标普 500 与纳斯达克 100 热力图 | OpenStock',
    description: '查看标普 500 和纳斯达克 100 成分股热力图，按市值与当日涨跌了解市场，支持缩放和全屏，无需登录。',
};

export default function HeatmapsPage() {
    return <>
        <PageHero kicker="市场热力图" title="两大指数，一眼看清市场。"
            sub="标普 500 与纳斯达克 100 成分股热力图，无需登录即可查看。面积代表市值，颜色和百分比代表当日涨跌；数据更新由 TradingView 提供。">
            <a href="#sp500" className="btn btn-primary h-11">标普 500</a>
            <a href="#nasdaq100" className="btn btn-ghost h-11">纳斯达克 100</a>
            <Link href="/sign-in" className="btn btn-ghost h-11">登录账号</Link>
        </PageHero>
        <section aria-label="指数成分股热力图" className="mx-auto mt-10 max-w-[1200px] px-5">
            <IndexHeatmaps />
        </section>
    </>;
}
