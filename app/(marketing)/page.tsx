import Link from "next/link";
import { ArrowUpRight, Bell, CandlestickChart, Command, GitPullRequest, Github, Grid3x3, HeartHandshake, MailOpen, MessagesSquare, Star } from "lucide-react";
import { MarketDial, MarketStatus } from "@/components/landing/MarketClock";
import ProductPreview from "@/components/landing/ProductPreview";
import SectionHead from "@/components/marketing/SectionHead";
import IconCard from "@/components/marketing/IconCard";
import { formatCount, getRepoStats } from "@/lib/github";
import { cn } from "@/lib/utils";
import { sidebarSponsors } from "@/lib/sponsors";
import { DISCORD_URL, GOOD_FIRST_ISSUES_URL, REPO_URL } from "@/lib/constants";

const FEATURES = [
    { icon: CandlestickChart, title: "动态走势图", body: "通过 TradingView 查看上市公司的 K 线、技术指标和财务数据，支持全屏浏览。" },
    { icon: Bell, title: "邮件价格提醒", body: "通过 OpenStock Cloud 设置价格上限或下限，系统每五分钟检查一次，突破目标时发送邮件。" },
    { icon: MessagesSquare, title: "一览市场情绪", body: "并排查看各股票在 Reddit、X.com、新闻和 Polymarket 的热度与看涨比例。" },
    { icon: Grid3x3, title: "纵览整个市场", body: "在开盘前通过一个页面了解板块热力图、涨跌排行和市场要闻。" },
    { icon: Command, title: "按 ⌘K 快速搜索", body: "搜索 Finnhub 支持的交易所，并像浏览器一样在标签页中打开股票。" },
    { icon: MailOpen, title: "每周一新闻摘要", body: "由 AI 简要汇总你关注股票的一周新闻。" },
];

const TIERS = [
    {
        name: "社区版", price: "免费", cadence: "每小时", perHour: 1,
        body: "当前公开站点。报价每小时刷新一次，所有用户共享，图表保持实时更新。",
        cta: { label: "开始使用", href: '/sign-up' },
    },
    {
        name: 'OpenStock Cloud', price: '$5', per: "／月", tag: "即将上线", cadence: "每 15 秒", perHour: 240,
        body: "同一应用，增加实时行情和邮件价格提醒，通过行情密钥池托管，无需自行配置。",
        cta: { label: "在 Discord 获取上线通知", href: DISCORD_URL },
    },
    {
        name: "自行部署", price: "免费", cadence: "由你决定", perHour: 240,
        body: "使用自己的服务器和 Finnhub 密钥，为你和团队提供实时行情与价格提醒。",
        cta: { label: "配置指南", href: '#self-host' },
    },
];

const SUPPORT = [
    {
        icon: HeartHandshake, title: "赞助支持", primary: true,
        body: "每月赞助 5 美元起，也可一次性捐赠或定制合作。赞助商会在网站、应用及 README 展示。",
        cta: { label: "查看赞助档位", href: '/sponsor' },
    },
    {
        icon: GitPullRequest, title: "参与贡献",
        body: "从新手问题、文档改进或页面设计开始，每一次被合并的贡献都在推动 OpenStock 前进。",
        cta: { label: "适合新手的问题", href: GOOD_FIRST_ISSUES_URL },
    },
    {
        icon: Star, title: "分享给更多人",
        body: "为仓库点星，并将它分享给需要免费行情工具的朋友。",
        cta: { label: "在 GitHub 点星", href: REPO_URL },
    },
];

// 60 minutes of updates drawn as ticks: one line per refresh.
const CadenceRail = ({ perHour }: { perHour: number }) => (
    <div
        className="h-7 rounded-md bg-page shadow-[inset_0_0_0_1px_var(--line)]"
        style={{
            backgroundImage: perHour > 1
                ? `repeating-linear-gradient(90deg, var(--brand) 0 1px, transparent 1px calc(100% / ${perHour}))`
                : 'linear-gradient(90deg, var(--brand) 0 2px, transparent 2px)',
        }}
        aria-hidden
    />
);

// Floats in the empty gutter beside the 1200px column, so it only shows on screens wide enough to have one.
const SponsorBanner = () => {
    const [sponsor] = sidebarSponsors();
    if (!sponsor) return null;
    return (
        <aside aria-label="赞助支持" className="fixed top-[130px] z-30 hidden w-[200px] right-[calc((100vw-1200px)/4-100px)] min-[1680px]:block">
            <a href={sponsor.url} target="_blank" rel="noreferrer" className="hatch group">
                <div className="card flex flex-col gap-4 p-5">
                    <p className="kicker flex items-center gap-1.5 text-brand-ink"><span className="live-dot" /> 赞助支持</p>
                    {sponsor.logo && <img src={sponsor.logo} alt={sponsor.iconOnly ? '' : sponsor.name} className="h-14 w-auto self-start" />}
                    <div>
                        <p className="text-[17px] font-bold tracking-[-0.02em]">{sponsor.name}</p>
                        {sponsor.blurb && <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{sponsor.blurb}</p>}
                    </div>
                    <span className="btn btn-ghost h-9 text-[13px] group-hover:bg-[var(--hover)] group-hover:text-foreground">访问{sponsor.name} <ArrowUpRight /></span>
                </div>
            </a>
        </aside>
    );
};

export default async function LandingPage() {
    const repo = await getRepoStats();
    const start = { href: '/sign-up', label: "免费开始使用" };

    return (
        <>
            <SponsorBanner />
            <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                    <MarketStatus />
                    <h1 className="mt-6 text-[44px] font-bold leading-[1.02] tracking-[-0.05em] md:text-[68px]">
                        看市场，<br />无需付费门槛。</h1>
                    <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
                        OpenStock 是昂贵行情平台的开源替代方案。跟踪价格、纵览市场、深入了解公司，为每个人开放构建。</p>
                    <div className="mt-8 flex flex-wrap items-center gap-2">
                        <Link href={start.href} className="btn btn-primary h-11 px-5 text-[15px]">{start.label}</Link>
                        <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn btn-ghost h-11 px-5 text-[15px]">
                            <Github /> 自行部署{repo && <span className="num text-faint">{formatCount(repo.stars)} 星标</span>}
                        </a>
                    </div>
                </div>
                <div className="hatch">
                    <div className="card px-6 pb-5 pt-6"><MarketDial /></div>
                </div>
            </section>

            <section className="mx-auto mt-16 max-w-[1200px] px-5">
                <ProductPreview />
            </section>

            <section id="inside" className="mx-auto mt-28 max-w-[1200px] scroll-mt-24 px-5">
                <SectionHead kicker="功能介绍" title="每个人都能使用的行情终端。" sub="将跟踪市场所需的工具汇集一处，无需订阅。" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(({ icon, title, body }) => (
                        <IconCard key={title} icon={icon} title={title}>{body}</IconCard>
                    ))}
                </div>
            </section>

            <section id="data" className="mx-auto mt-28 max-w-[1200px] scroll-mt-24 px-5">
                <SectionHead
                    kicker="数据来源"
                    title="选择适合你的行情更新频率。"
                    sub="图表始终由 TradingView 实时提供，报价、自选股和提醒使用 Finnhub 数据，更新频率如下。"
                />
                <div className="grid gap-3 lg:grid-cols-3">
                    {TIERS.map((tier) => (
                        <div key={tier.name} className="hatch">
                            <div className="card flex h-full flex-col gap-4 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-[18px] font-bold tracking-[-0.02em]">{tier.name}</h3>
                                    {tier.tag && <span className="pill is-brand">{tier.tag}</span>}
                                </div>
                                <p className="bento-value text-[30px]">{tier.price}{tier.per && <small className="text-faint"> {tier.per}</small>}</p>
                                <p className="text-[14px] leading-relaxed text-muted-foreground">{tier.body}</p>
                                <div className="mt-auto flex flex-col gap-2">
                                    <CadenceRail perHour={tier.perHour} />
                                    <p className="num flex justify-between text-[12px] text-faint">
                                        <span>{tier.cadence}</span>
                                        <span>每小时更新 {tier.perHour} 次</span>
                                    </p>
                                </div>
                                <Link
                                    href={tier.cta.href}
                                    className={cn('btn', tier.name === "社区版" ? 'btn-primary' : 'btn-ghost')}
                                    {...(tier.cta.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                                >
                                    {tier.cta.label}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="self-host" className="mx-auto mt-28 grid max-w-[1200px] scroll-mt-24 items-start gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                <div>
                    <SectionHead
                        kicker="自行部署"
                        title="自己的服务器和密钥，自己的实时行情。"
                        sub="可添加多个免费 Finnhub 密钥，每个密钥提供每分钟 60 次请求。切换为实时模式后，每 15 秒刷新价格。"
                    />
                    <a href={`${REPO_URL}#docker-setup`} target="_blank" rel="noreferrer" className="btn btn-ghost">查看 README 中的完整配置</a>
                </div>
                <div className="hatch">
                    <pre className="card mono overflow-x-auto p-5 text-[13px] leading-7 text-muted-foreground">
                        <span className="text-faint">$ </span><span className="text-foreground">git clone {REPO_URL}.git</span>{'\n'}
                        <span className="text-faint">$ </span><span className="text-foreground">cd OpenStock</span>{'\n\n'}
                        <span className="text-faint"># .env（所有变量均在 README 中说明）</span>{'\n'}
                        <span className="text-brand-ink">FINNHUB_API_KEYS</span>=key_one,key_two,key_three{'\n'}
                        <span className="text-brand-ink">NEXT_PUBLIC_OPENSTOCK_DATA_MODE</span>=realtime{'\n\n'}
                        <span className="text-faint">$ </span><span className="text-foreground">docker compose up -d --build</span>
                    </pre>
                </div>
            </section>

            <section id="sponsor" className="mx-auto mt-28 max-w-[1200px] scroll-mt-24 px-5">
                <SectionHead
                    kicker="支持项目"
                    title="OpenStock 正在招募赞助商。"
                    sub="个人与企业的支持让它保持免费。你可以量力赞助，也可以贡献时间。"
                />
                <div className="grid gap-3 lg:grid-cols-3">
                    {SUPPORT.map(({ icon, title, body, cta, primary }) => (
                        <IconCard
                            key={title}
                            icon={icon}
                            title={title}
                            footer={
                                <a href={cta.href} {...(cta.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})} className={cn('btn w-full', primary ? 'btn-primary' : 'btn-ghost')}>
                                    {cta.label}
                                </a>
                            }
                        >
                            {body}
                        </IconCard>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-28 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card grid gap-10 p-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:p-12">
                        <div>
                            <p className="kicker text-brand-ink">Open Dev Society</p>
                            <blockquote className="mt-4 text-[26px] font-semibold leading-snug tracking-[-0.03em] md:text-[30px]">
                                技术应属于每个人，知识应当开放、免费、触手可及。</blockquote>
                            <div className="mt-8 flex flex-wrap gap-2">
                                <Link href={start.href} className="btn btn-primary h-11 px-5 text-[15px]">{start.label}</Link>
                                <Link href="/about" className="btn btn-ghost h-11 px-5 text-[15px]">阅读项目宣言</Link>
                            </div>
                        </div>
                        {repo && (
                            <dl className="grid grid-cols-2 content-end gap-3">
                                {[
                                    ["星标", formatCount(repo.stars)],
                                    ["分支", formatCount(repo.forks)],
                                    ["许可证", repo.license ?? 'AGPL-3.0'],
                                    ["开发语言", 'TypeScript'],
                                ].map(([label, value]) => (
                                    <div key={label} className="bento-tile col-span-1 bg-page">
                                        <dt className="kicker">{label}</dt>
                                        <dd className="bento-value text-[26px]">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
