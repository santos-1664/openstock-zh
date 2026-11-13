import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/marketing/PageHero';
import { GUIDES } from '@/lib/seo/comparisons';
import { siteUrl } from '@/lib/seo/site';

const title = "使用指南 | OpenStock";
const description = "了解 OpenStock 的能力与边界：开源股票跟踪工具，支持 TradingView 图表、自选股、邮件提醒和自行部署。无需账号即可阅读客观对比。";

export function generateMetadata(): Metadata {
    const url = `${siteUrl()}/compare`;
    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, siteName: 'OpenStock', type: 'website' },
        twitter: { card: 'summary', title, description },
    };
}

export default function GuideIndexPage() {
    return (
        <>
            <PageHero
                kicker="使用指南"
                title="OpenStock 能帮你做什么。"
                sub="围绕常见问题提供简明说明。本站图表采用 TradingView 组件，登录后可免费体验应用。"
            />
            <section className="mx-auto mt-12 grid max-w-[1200px] gap-3 px-5 md:grid-cols-2">
                {GUIDES.map((guide) => (
                    <Link key={guide.slug} href={`/compare/${guide.slug}`} className="hatch group">
                        <article className="card flex h-full flex-col gap-3 p-6">
                            <p className="kicker text-brand-ink">{guide.kicker}</p>
                            <h2 className="text-[22px] font-bold tracking-[-0.03em] group-hover:text-brand-ink">{guide.title}</h2>
                            <p className="text-[15px] leading-relaxed text-muted-foreground">{guide.description}</p>
                        </article>
                    </Link>
                ))}
            </section>
        </>
    );
}
