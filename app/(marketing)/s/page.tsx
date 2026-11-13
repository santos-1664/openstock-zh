import { sectorLabel } from '@/i18n/display';
import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/marketing/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { siteUrl } from '@/lib/seo/site';
import { sectorAnchor, tickerPath, tickersBySector, US_TICKERS } from '@/lib/seo/tickers';

const title = "美股图表与 SEC 公告 | OpenStock";
const description = `覆盖 ${US_TICKERS.length} 家标普 500 和纳斯达克 100 公司，提供 TradingView 图表及近期 SEC EDGAR 公告链接，无需账号。`;

export function generateMetadata(): Metadata {
    const url = `${siteUrl()}/s`;
    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, siteName: 'OpenStock', type: 'website' },
        twitter: { card: 'summary', title, description },
    };
}

export default function StockDirectoryPage() {
    const groups = tickersBySector();
    const origin = siteUrl();

    return (
        <>
            <PageHero
                kicker="美股"
                title="无需账号，查看图表与公告。"
                sub={`收录 ${US_TICKERS.length} 家标普 500 与纳斯达克 100 公司，每页提供 TradingView 图表及 SEC EDGAR 最新年报和季报。登录后可使用自选股与提醒。`}
            >
                <Link href="/sign-up" className="btn btn-primary h-11 px-5 text-[15px]">免费跟踪</Link>
                <Link href="/compare" className="btn btn-ghost h-11 px-5 text-[15px]">阅读指南</Link>
            </PageHero>

            <nav aria-label="行业板块" className="mx-auto mt-10 flex max-w-[1200px] flex-wrap gap-2 px-5">
                {groups.map(({ sector, tickers }) => (
                    <a key={sectorLabel(sector)} href={`#${sectorAnchor(sector)}`} className="pill h-8 px-3 text-[13px]">
                        {sectorLabel(sector)} <span className="num text-faint">{tickers.length}</span>
                    </a>
                ))}
            </nav>

            <div className="mx-auto mt-12 flex max-w-[1200px] flex-col gap-12 px-5">
                {groups.map(({ sector, tickers }) => (
                    <section key={sectorLabel(sector)} id={sectorAnchor(sector)} className="scroll-mt-24">
                        <h2 className="text-[22px] font-bold tracking-[-0.03em]">{sectorLabel(sector)}</h2>
                        <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                            {tickers.map((ticker) => (
                                <li key={ticker.symbol}>
                                    {/* No prefetch: 518 links in view as you scroll would each fetch a page */}
                                    <Link href={tickerPath(ticker.symbol)} prefetch={false} className="group flex items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-hover/50">
                                        <span className="truncate text-[14px]">{ticker.name}</span>
                                        <span className="mono shrink-0 text-[12px] text-faint group-hover:text-foreground">{ticker.symbol}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            <JsonLd data={{
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: title,
                description,
                url: `${origin}/s`,
                isPartOf: { '@type': 'WebSite', name: 'OpenStock', url: origin },
            }} />
        </>
    );
}
