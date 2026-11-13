import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";
import { formatCount, getRepoStats } from "@/lib/github";
import OpenDevSocietyBranding from "@/components/OpenDevSocietyBranding";
import SponsorsBand from "@/components/sponsors/SponsorsBand";
import UpdateBanner from "@/components/UpdateBanner";
import { DISCORD_URL, REPO_URL } from "@/lib/constants";

const FOOTER_LINKS = [
    { href: '/s', label: "股票" },
    { href: '/compare', label: "使用指南" },
    { href: '/about', label: "关于项目" },
    { href: '/help', label: "使用帮助" },
    { href: '/api-docs', label: "技术架构" },
    { href: '/terms', label: "使用条款" },
    { href: '/sponsor', label: "赞助支持" },
    { href: '/love', label: "社区支持墙" },
    { href: '/changelog', label: "更新日志" },
    { href: REPO_URL, label: 'GitHub' },
    { href: DISCORD_URL, label: 'Discord' },
    { href: 'https://www.linkedin.com/company/opendevsociety-in/', label: 'LinkedIn' },
];

// No session read here: it made every public page (and every <Link> prefetch of one) a function call.
// The header always shows the signed-out buttons; /sign-in and /sign-up send a signed-in visitor to /dashboard.
export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
    const repo = await getRepoStats();

    return (
        <div className="min-h-dvh bg-page">
            <UpdateBanner className="mx-5 mt-3 xl:mx-auto xl:max-w-[1160px]" />
            <header className="sticky top-0 z-40 border-b border-transparent bg-page/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-5">
                    <Link href="/" aria-label="OpenStock 首页" className="shrink-0">
                        <Image src="/assets/images/logo.png" alt="OpenStock" width={140} height={35} priority />
                    </Link>
                    <nav className="hidden items-center gap-1 md:flex">
                        {[['/heatmaps', '市场热力图'], ['/#inside', "产品功能"], ['/#data', "数据来源"], ['/#self-host', "自行部署"], ['/about', "关于项目"]].map(([href, label]) => (
                            <Link key={href} href={href} className="side-item h-8 font-semibold">{label}</Link>
                        ))}
                        <Link href="/sponsor" className="side-item h-8 gap-2 font-semibold text-brand-ink hover:text-brand-ink">
                            <span className="live-dot" /> 赞助支持</Link>
                    </nav>
                    <div className="ml-auto flex items-center gap-2">
                        <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn btn-ghost hidden h-9 px-3 sm:inline-flex" aria-label="在 GitHub 查看 OpenStock">
                            <Github />
                            {repo && <span className="num">{formatCount(repo.stars)}</span>}
                        </a>
                        <Link href="/sign-in" className="btn h-9 px-3 text-muted-foreground hover:text-foreground">登录</Link>
                        <Link href="/sign-up" className="btn btn-primary h-9">开始使用</Link>
                    </div>
                </div>
            </header>

            <main>{children}</main>

            <SponsorsBand />

            <footer className="mx-auto mt-24 flex max-w-[1200px] flex-col gap-6 px-5 pb-10 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-3">
                    <Image src="/assets/images/logo.png" alt="OpenStock" width={120} height={30} />
                    <p className="text-[13px] text-faint">© {new Date().getFullYear()} Open Dev Society · AGPL-3.0</p>
                </div>
                <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-muted-foreground">
                    {FOOTER_LINKS.map(({ href, label }) => (
                        <Link key={label} href={href} className="transition-colors hover:text-foreground" {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                            {label}
                        </Link>
                    ))}
                </nav>
                <OpenDevSocietyBranding />
            </footer>
        </div>
    );
}
