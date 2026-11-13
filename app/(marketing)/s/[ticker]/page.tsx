import { sectorLabel } from '@/i18n/display';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import SignUpCta from '@/components/seo/SignUpCta';
import TradingViewEmbed from '@/components/seo/TradingViewEmbed';
import { CANDLE_CHART_WIDGET_CONFIG, symbolInfoConfig } from '@/lib/constants';
import { companyBrowseUrl, formatFilingDate, getEdgarCompany, type EdgarFiling } from '@/lib/seo/edgar';
import { siteUrl } from '@/lib/seo/site';
import { adjacentTickers, findTicker, relatedTickers, sectorAnchor, tickerIntro, tickerPath, type UsTicker } from '@/lib/seo/tickers';
import { formatSymbolForTradingView, tradingViewSymbolUrl } from '@/lib/utils';

const WIDGET = 'https://s3.tradingview.com/external-embedding/embed-widget-';

// Public company page. Charts are TradingView widgets. Facts are SEC EDGAR submissions.
// The signed-in stock page (/stocks/[symbol]) is a different route and is unchanged.
// ISR, rendered on first visit and kept a day: a crawl of all 518 pages is one render (and one EDGAR call) per
// company per day instead of a function call per hit. No session read, so the CTA is the same for everyone.
export const revalidate = 86400;

// Empty list: nothing is built ahead (the build can't reach EDGAR), each page is cached on its first visit.
export function generateStaticParams(): Params[] {
    return [];
}

type Params = { ticker: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { ticker: raw } = await params;
    const ticker = findTicker(raw);
    if (!ticker) return { title: "未找到股票 | OpenStock", robots: { index: false, follow: false } };

    const title = `${ticker.name} (${ticker.symbol}) 走势图与 SEC 公告 | OpenStock`;
    const description = tickerIntro(ticker);
    const url = `${siteUrl()}${tickerPath(ticker.symbol)}`;
    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, siteName: 'OpenStock', type: 'website' },
        twitter: { card: 'summary', title, description },
        robots: { index: true, follow: true },
    };
}

function FilingRow({ label, filing }: { label: string; filing: EdgarFiling | null }) {
    return (
        <div className="flex flex-col gap-1">
            <dt className="kicker">{label}</dt>
            <dd className="text-[15px]">
                {filing ? (
                    <a href={filing.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline decoration-[var(--line)] underline-offset-4 hover:decoration-foreground">
                        {filing.form} 提交于{formatFilingDate(filing.filed)}
                    </a>
                ) : (
                    <span className="text-muted-foreground">近期 EDGAR 索引中暂无记录</span>
                )}
            </dd>
        </div>
    );
}

export default async function PublicTickerPage({ params }: { params: Promise<Params> }) {
    const { ticker: raw } = await params;
    const ticker = findTicker(raw);
    if (!ticker) notFound();

    const edgar = await getEdgarCompany(ticker.cik);

    const origin = siteUrl();
    const path = tickerPath(ticker.symbol);
    const url = `${origin}${path}`;
    const tvSymbol = formatSymbolForTradingView(ticker.symbol);
    const tvHref = tradingViewSymbolUrl(tvSymbol);
    const peers = relatedTickers(ticker);
    const { prev, next } = adjacentTickers(ticker);
    const title = `${ticker.name} (${ticker.symbol}) 走势图与 SEC 公告`;
    const filingsUrl = edgar?.filingsUrl ?? (ticker.cik ? companyBrowseUrl(ticker.cik) : 'https://www.sec.gov/edgar/search/');

    return (
        <article className="mx-auto max-w-[1200px] px-5 pt-10 pb-4">
            <JsonLd data={structuredData({ ticker, origin, url, title, description: tickerIntro(ticker) })} />

            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 text-[13px] font-semibold text-muted-foreground">
                <Link href="/" className="hover:text-foreground">OpenStock</Link>
                <span aria-hidden>/</span>
                <Link href="/s" className="hover:text-foreground">美股</Link>
                <span aria-hidden>/</span>
                <Link href={`/s#${sectorAnchor(ticker.sector)}`} className="hover:text-foreground">{sectorLabel(ticker.sector)}</Link>
                <span aria-hidden>/</span>
                <span className="text-foreground">{ticker.symbol}</span>
            </nav>

            <header className="mt-6 max-w-3xl">
                <p className="kicker text-brand-ink">{ticker.exchange || 'US'} · {ticker.symbol}</p>
                <h1 className="mt-2 text-[36px] font-bold leading-[1.05] tracking-[-0.045em] md:text-[48px]">{ticker.name}</h1>
                <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">{tickerIntro(ticker)}</p>
            </header>

            <div className="mt-8 flex flex-wrap gap-2">
                <Link href="/sign-up" className="btn btn-primary h-11 px-5 text-[15px]">
                    {`Track ${ticker.symbol} free`}
                </Link>
                <a href={tvHref} target="_blank" rel="noopener nofollow" className="btn btn-ghost h-11 px-5 text-[15px]">在 TradingView 查看</a>
            </div>

            <div className="mt-8 flex flex-col gap-3">
                <section className="hatch">
                    <div className="card p-1">
                        <TradingViewEmbed
                            scriptUrl={`${WIDGET}symbol-info.js`}
                            config={symbolInfoConfig(tvSymbol, 'zh')}
                            height={180}
                            creditHref={tvHref}
                            creditLabel={`${ticker.symbol} quote by TradingView`}
                        />
                    </div>
                </section>
                <section className="hatch">
                    <div className="card p-1">
                        <TradingViewEmbed
                            scriptUrl={`${WIDGET}advanced-chart.js`}
                            config={CANDLE_CHART_WIDGET_CONFIG(tvSymbol, 'zh')}
                            height={560}
                            creditHref={tvHref}
                            creditLabel={`${ticker.symbol} chart by TradingView`}
                        />
                    </div>
                </section>
            </div>

            <section className="mt-10">
                <h2 className="text-[28px] font-bold tracking-[-0.04em]">SEC 监管公告</h2>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    行业代码、财年和申报日期来自 SEC 的 EDGAR 申报数据，CIK 为{ticker.cik}。年度报告为 10-K，境外发行人为 20-F 或 40-F；季度报告为公司提交的 10-Q。</p>
                <div className="hatch mt-5">
                    <div className="card p-6">
                        {edgar ? (
                            <dl className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <dt className="kicker">SIC</dt>
                                    <dd className="mt-1 text-[15px]">{[edgar.sic, edgar.sicDescription].filter(Boolean).join(' · ') || "未列出"}</dd>
                                </div>
                                <div>
                                    <dt className="kicker">财年结束日期</dt>
                                    <dd className="mt-1 text-[15px]">{edgar.fiscalYearEnd || "未列出"}</dd>
                                </div>
                                <div>
                                    <dt className="kicker">注册地区</dt>
                                    <dd className="mt-1 text-[15px]">{edgar.stateOfIncorporation || "未列出"}</dd>
                                </div>
                                <FilingRow label="最新年度报告" filing={edgar.annual} />
                                <FilingRow label="最新季度报告" filing={edgar.quarterly} />
                                <div>
                                    <dt className="kicker">所有申报文件</dt>
                                    <dd className="mt-1 text-[15px]">
                                        <a href={edgar.filingsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-[var(--line)] underline-offset-4 hover:decoration-foreground">
                                            {ticker.name} 前往 EDGAR</a>
                                    </dd>
                                </div>
                            </dl>
                        ) : (
                            <p className="text-[15px] leading-relaxed text-muted-foreground">
                                暂时无法从 EDGAR 获取该公司的数据，不影响上方图表。{' '}
                                <a href={filingsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline decoration-[var(--line)] underline-offset-4">
                                    打开{ticker.symbol} 前往 EDGAR</a>
                                .
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="mt-12">
                <h2 className="text-[22px] font-bold tracking-[-0.03em]">更多同类公司：{sectorLabel(ticker.sector)}</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {peers.map((peer) => (
                        <li key={peer.symbol}>
                            <Link href={tickerPath(peer.symbol)} className="card flex items-baseline justify-between gap-3 px-3 py-2 hover:bg-hover/40">
                                <span className="truncate text-[14px]">{peer.name}</span>
                                <span className="mono shrink-0 text-[12px] text-faint">{peer.symbol}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold text-muted-foreground">
                    {prev && <Link href={tickerPath(prev.symbol)} className="hover:text-foreground">上一个：{prev.symbol}</Link>}
                    {next && <Link href={tickerPath(next.symbol)} className="hover:text-foreground">下一个：{next.symbol}</Link>}
                    <Link href="/s" className="hover:text-foreground">全部美股</Link>
                </p>
            </section>

            <section className="mt-12">
                <h2 className="text-[22px] font-bold tracking-[-0.03em]">股票跟踪常见问题：{ticker.symbol}</h2>
                <div className="hatch mt-4">
                    <div className="card row-list overflow-hidden">
                        <details className="group">
                            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                                此页面显示实时价格吗？<ChevronDown className="size-4 flex-none text-faint transition-transform group-open:rotate-180" />
                            </summary>
                            <p className="max-w-3xl px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">
                                图表中的价格由浏览器内的 TradingView 组件显示，OpenStock 不在此页面另行提供报价。登录账号即可将{ticker.symbol} 加入自选股，并设置站内价格提醒；提醒需要保持网页打开。</p>
                        </details>
                        <details className="group">
                            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                                申报日期来自哪里？<ChevronDown className="size-4 flex-none text-faint transition-transform group-open:rotate-180" />
                            </summary>
                            <p className="max-w-3xl px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">
                                来自 SEC 的 EDGAR 申报数据，CIK 为{ticker.cik || "这家公司"}。链接会在 sec.gov 打开文件，OpenStock 与 SEC 无隶属关系。</p>
                        </details>
                    </div>
                </div>
            </section>

            <div className="mt-10">
                <SignUpCta
                    title={`Track ${ticker.symbol} free on OpenStock`}
                    body="加入自选股、保留图表标签页，并集中阅读公告。OpenStock 不是证券经纪商，此处内容不构成投资建议。"
                    href="/sign-up"
                    label={`Track ${ticker.symbol} free`}
                />
            </div>
        </article>
    );
}

function structuredData({ ticker, origin, url, title, description }: { ticker: UsTicker; origin: string; url: string; title: string; description: string }) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'OpenStock', item: `${origin}/` },
                    { '@type': 'ListItem', position: 2, name: "美股", item: `${origin}/s` },
                    { '@type': 'ListItem', position: 3, name: ticker.sector, item: `${origin}/s#${sectorAnchor(ticker.sector)}` },
                    { '@type': 'ListItem', position: 4, name: `${ticker.name} (${ticker.symbol})`, item: url },
                ],
            },
            {
                '@type': 'Corporation',
                name: ticker.name,
                tickerSymbol: ticker.symbol,
                url: ticker.cik ? companyBrowseUrl(ticker.cik) : url,
                ...(ticker.sector ? { industry: ticker.sector } : {}),
            },
            {
                '@type': 'WebPage',
                name: title,
                description,
                url,
                isPartOf: { '@type': 'WebSite', name: 'OpenStock', url: origin },
            },
        ],
    };
}
