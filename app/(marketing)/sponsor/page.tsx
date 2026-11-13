import { Check, Cloud, HandCoins, MessageCircle, Minus, Users } from "lucide-react";
import IconCard from "@/components/marketing/IconCard";
import { getRepoStats, formatCount } from "@/lib/github";
import { DISCORD_URL, sponsorCheckoutUrl } from "@/lib/constants";
import { ACTIVE_SPONSORS, FUNDING_USES, REGISTERED_USERS, SPONSOR_CONTACT_EMAIL, SPONSOR_GOAL, SPONSOR_RECIPIENT, SPONSOR_TIERS, tierBorder, type SponsorTierId } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export const metadata = {
    title: "赞助 OpenStock",
    description: "支持免费开源的行情工具。可按月赞助、一次性捐赠，或联系我们洽谈合作。",
};

const MAILTO = `mailto:${SPONSOR_CONTACT_EMAIL}?subject=Sponsoring%20OpenStock`;

// Where each tier shows up. Mirrors the perks in lib/sponsors.ts.
const PLACEMENTS: { label: string; from: SponsorTierId }[] = [
    { label: "在 README 赞助名单展示名称", from: 'backer' },
    { label: "在赞助墙展示名称与头像", from: 'supporter' },
    { label: "在所有公开页面的页脚展示标志", from: 'company' },
    { label: "在 README 展示标志", from: 'company' },
    { label: "在首页展示标志", from: 'partner' },
    { label: "在应用侧边栏展示赞助席位", from: 'partner' },
];
const TIER_ORDER: SponsorTierId[] = ['backer', 'supporter', 'company', 'partner'];

const FAQ = [
    ["如何支付？", "通过 GitHub Sponsors 使用银行卡或 PayPal 支付，可选择按月赞助或一次性捐赠。"],
    ["可以取消吗？", "可以，随时在 GitHub Sponsors 设置中取消。"],
    ["企业可以赞助吗？", "可以。使用组织的 GitHub 账号赞助，然后提供标志和链接。如需发票或定制合作，请联系我们。"],
];

export default async function SponsorPage() {
    const repo = await getRepoStats();
    const goalPercent = Math.min(100, (SPONSOR_GOAL.current / SPONSOR_GOAL.target) * 100);
    const fundingTotal = FUNDING_USES.reduce((sum, use) => sum + (use.monthly ?? 0), 0);

    return (
        <div className="mx-auto max-w-[1200px] px-5">
            <section className="grid items-end gap-10 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1fr)_380px]">
                <div>
                    <p className="kicker flex items-center gap-2 text-brand-ink"><span className="live-dot" /> 赞助席位开放中</p>
                    <h1 className="mt-4 text-[44px] font-bold leading-[1.02] tracking-[-0.05em] md:text-[64px]">一起支持<br />免费的行情数据。</h1>
                    <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
                        OpenStock 是一款开源行情终端，已有{REGISTERED_USERS} 位注册用户{repo ? `, with ${formatCount(repo.stars)} stars on GitHub` : ''}。赞助让无法负担付费终端的人也能使用免费、独立的市场工具。</p>
                    <div className="mt-8 flex flex-wrap gap-2">
                        <a href="#tiers" className="btn btn-primary h-11 px-5 text-[15px]">查看档位</a>
                        <a href={MAILTO} className="btn btn-ghost h-11 px-5 text-[15px]">联系我们</a>
                    </div>
                </div>

                <div className="hatch">
                    <div className="card flex flex-col gap-4 p-5">
                        <div className="flex items-baseline justify-between gap-3">
                            <p className="kicker">目标</p>
                            <p className="num text-[13px] text-faint">{SPONSOR_GOAL.current} ／{SPONSOR_GOAL.target.toLocaleString('en-US')}</p>
                        </div>
                        <p className="text-[20px] font-bold tracking-[-0.02em]">{SPONSOR_GOAL.target.toLocaleString('en-US')} {SPONSOR_GOAL.label}</p>
                        <div className="h-2.5 overflow-hidden rounded-full bg-page shadow-[inset_0_0_0_1px_var(--line)]" role="progressbar" aria-valuenow={SPONSOR_GOAL.current} aria-valuemax={SPONSOR_GOAL.target}>
                            <div className="h-full rounded-full bg-brand" style={{ width: `max(${goalPercent}%, 6px)` }} />
                        </div>
                        {repo && (
                            <dl className="grid grid-cols-3 gap-2">
                                {[['Users', REGISTERED_USERS.replace(',000', 'K')], ["星标", formatCount(repo.stars)], ["分支", formatCount(repo.forks)]].map(([label, value]) => (
                                    <div key={label} className="rounded-[12px] bg-page px-3.5 py-3 shadow-[inset_0_0_0_1px_var(--line)]">
                                        <dt className="kicker">{label}</dt>
                                        <dd className="bento-value mt-1 text-[22px]">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>
                </div>
            </section>

            <section id="tiers" className="mt-24 scroll-mt-24">
                <p className="kicker text-brand-ink">按月赞助</p>
                <h2 className="mt-2 text-[32px] font-bold tracking-[-0.04em] md:text-[40px]">选择赞助档位。</h2>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {SPONSOR_TIERS.map((tier) => {
                        const filled = ACTIVE_SPONSORS.filter((s) => s.tier === tier.id).length;
                        const taken = tier.slots ? filled >= tier.slots : false;
                        return (
                            <div
                                key={tier.id}
                                className={cn('hatch', tier.featured && 'shadow-[0_6px_18px_oklch(0_0_0/0.22)]')}
                                style={{ outline: `1px solid ${tierBorder(tier.id)}` }}
                            >
                                <div className="card flex h-full flex-col gap-4 p-5">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-[17px] font-bold tracking-[-0.02em]">{tier.name}</h3>
                                        {tier.featured && <span className="pill is-brand">适合团队</span>}
                                        {tier.slots && <span className={cn('pill', !taken && 'is-up')}>{taken ? "席位已满" : `${tier.slots - filled} of ${tier.slots} open`}</span>}
                                    </div>
                                    <p className="bento-value text-[36px]"><small>$</small>{tier.monthly}<small className="text-faint"> ／月</small></p>
                                    <p className="text-[14px] leading-relaxed text-muted-foreground">{tier.blurb}</p>
                                    <ul className="flex flex-col gap-2 text-[13.5px]">
                                        {tier.perks.map((perk) => (
                                            <li key={perk} className="flex gap-2">
                                                <Check className="mt-0.5 size-4 flex-none text-brand-ink" />
                                                <span>{perk}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={taken ? MAILTO : sponsorCheckoutUrl(tier.monthly)}
                                        target={taken ? undefined : '_blank'}
                                        rel="noreferrer"
                                        className={cn('btn mt-auto', tier.featured ? 'btn-primary' : 'btn-ghost')}
                                    >
                                        {taken ? "加入等候名单" : `Sponsor $${tier.monthly}/month`}
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="hatch">
                        <div className="card flex h-full flex-col gap-3 p-5 sm:flex-row sm:items-center">
                            <span className="bento-ico size-10 bg-brand-soft text-brand-ink"><HandCoins className="size-5" /></span>
                            <div className="flex-1">
                                <h3 className="text-[16px] font-bold">一次性捐赠</h3>
                                <p className="text-[14px] text-muted-foreground">通过 GitHub Sponsors 一次性捐赠，金额不限。</p>
                            </div>
                            <a href={sponsorCheckoutUrl(undefined, 'one-time')} target="_blank" rel="noreferrer" className="btn btn-ghost">一次性捐赠</a>
                        </div>
                    </div>
                    <div className="hatch">
                        <div className="card flex h-full flex-col gap-3 p-5 sm:flex-row sm:items-center">
                            <span className="bento-ico size-10 bg-brand-soft text-brand-ink"><MessageCircle className="size-5" /></span>
                            <div className="flex-1">
                                <h3 className="text-[16px] font-bold">有其他合作想法？</h3>
                                <p className="text-[14px] text-muted-foreground">可提供数据或基础设施额度、定制展示或其他合作。</p>
                            </div>
                            <div className="flex gap-2">
                                <a href={MAILTO} className="btn btn-primary">联系我们</a>
                                <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-ghost">Discord</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-24">
                <p className="kicker text-brand-ink">公开透明</p>
                <h2 className="mt-2 text-[28px] font-bold tracking-[-0.04em] md:text-[34px]">赞助资金的用途。</h2>
                <p className="mt-3 max-w-2xl text-[16px] text-muted-foreground">
                    赞助款通过 GitHub Sponsors 支付给{SPONSOR_RECIPIENT.name}{' '}
                    (<a href={`https://github.com/${SPONSOR_RECIPIENT.handle}`} target="_blank" rel="noreferrer" className="font-semibold text-brand-ink hover:underline">@{SPONSOR_RECIPIENT.handle}</a>),{' '}
                    {SPONSOR_RECIPIENT.role}，用于让 OpenStock 保持免费：</p>
                <div className="hatch mt-8">
                    <div className="card row-list">
                        {FUNDING_USES.map((use, i) => (
                            <div key={use.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-center sm:gap-6">
                                <span className="flex items-center gap-3 font-bold">
                                    <span className="mono text-[12px] text-faint">{String(i + 1).padStart(2, '0')}</span>
                                    {use.label}
                                </span>
                                <span className="text-muted-foreground">{use.detail}</span>
                                {fundingTotal > 0 && (
                                    <span className="num text-right font-semibold">
                                        {use.monthly ? `$${use.monthly}/mo · ${Math.round((use.monthly / fundingTotal) * 100)}%` : '—'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {fundingTotal > 0 && (
                    <p className="num mt-4 text-muted-foreground">
                        {FUNDING_USES.every((use) => use.monthly)
                            ? <>运行 OpenStock 每月约需<b className="text-foreground">${fundingTotal} ／月</b>.</>
                            : <>目前已知成本：<b className="text-foreground">${fundingTotal} ／月</b>.</>}
                    </p>
                )}

                <div className="mt-10 grid gap-3 md:grid-cols-2">
                    <IconCard icon={Cloud} title="OpenStock Cloud 将承担托管成本">
                        Cloud 每月 5 美元，即将上线，提供实时行情与价格提醒。订阅收入将覆盖服务器、数据库和行情数据成本，让免费站点能够持续运行。</IconCard>
                    <IconCard icon={Users} title="赞助支持社区持续发展">
                        赞助支持 OpenStock 背后的维护工作，包括审查社区代码、修复问题、开发新功能，以满足{REGISTERED_USERS} 用户的期待，同时让核心功能对所有人保持免费。</IconCard>
                </div>
            </section>

            <section className="mt-24">
                <p className="kicker text-brand-ink">展示位置</p>
                <h2 className="mt-2 text-[28px] font-bold tracking-[-0.04em] md:text-[34px]">你的名称会展示在哪里。</h2>
                <div className="hatch mt-8">
                    <div className="card overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>展示位置</th>
                                    {TIER_ORDER.map((id) => <th key={id} className="text-center">{SPONSOR_TIERS.find((t) => t.id === id)!.name}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {PLACEMENTS.map(({ label, from }) => (
                                    <tr key={label}>
                                        <td className="font-semibold text-foreground">{label}</td>
                                        {TIER_ORDER.map((id) => (
                                            <td key={id} className="text-center">
                                                {TIER_ORDER.indexOf(id) >= TIER_ORDER.indexOf(from)
                                                    ? <Check className="mx-auto size-4 text-brand-ink" aria-label="Included" />
                                                    : <Minus className="mx-auto size-4 text-line-strong" aria-label="不包含" />}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="mt-24 grid gap-3 md:grid-cols-3">
                {FAQ.map(([q, a]) => (
                    <div key={q} className="hatch">
                        <div className="card h-full p-5">
                            <h3 className="font-bold">{q}</h3>
                            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{a}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
