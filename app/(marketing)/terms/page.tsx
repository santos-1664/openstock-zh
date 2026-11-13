import { Metadata } from 'next';
import { AlertTriangle, Check, X } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';

export const metadata: Metadata = {
    title: "使用条款 | OpenStock",
    description: "面向社区的公平、透明、公开的使用条款。",
};

const PROMISES = [
    "核心功能将永久免费。",
    "我们不会出售你的个人数据。",
    "条款变更将公开讨论。",
    "你的自选股和分析成果归你所有。",
];

const RULES = {
    do: ["自由分享知识", "将 API 用于个人项目", "尊重其他社区成员"],
    dont: ["过度抓取数据", "分享 API 密钥", "使用 OpenStock 进行高频交易"],
};

export default function TermsPage() {
    return (
        <>
            <PageHero
                kicker="使用条款 · 更新于 2025 年 10 月"
                title="使用条款"
                sub="以信任、透明和社区价值为基础，规则清晰，没有隐藏条件。"
            />

            <section className="mx-auto mt-14 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card flex gap-4 p-6 shadow-[inset_0_0_0_1px_oklch(0.76_0.119_70/0.35)]">
                        <AlertTriangle className="mt-0.5 size-5 flex-none text-warn" />
                        <div>
                            <h2 className="font-bold text-warn">投资免责声明</h2>
                            <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
                                <strong className="text-foreground">OpenStock 是学习和分析工具，不是财务顾问。</strong>{' '}
                                数据按原样提供，仅供参考。请勿投入无法承受损失的资金。作出财务决策前，请独立研究或咨询有资质的专业人士。</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="我们的承诺" title="值得信赖的原则。" />
                <div className="grid gap-3 sm:grid-cols-2">
                    {PROMISES.map((promise) => (
                        <div key={promise} className="hatch">
                            <div className="card flex h-full items-center gap-3 p-5">
                                <span className="bento-ico bg-brand-soft text-brand-ink"><Check /></span>
                                <span className="font-semibold">{promise}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="社区规则" title="可以做什么，应避免什么。" />
                <div className="grid gap-3 md:grid-cols-2">
                    {([['Do', RULES.do, Check, 'text-up'], ['Don’t', RULES.dont, X, 'text-down']] as const).map(([title, items, Icon, tone]) => (
                        <div key={title} className="hatch">
                            <div className="card h-full p-5">
                                <h3 className="kicker">{title}</h3>
                                <ul className="mt-3 flex flex-col gap-2.5">
                                    {items.map((item) => (
                                        <li key={item} className="flex items-center gap-2.5">
                                            <Icon className={`size-4 flex-none ${tone}`} />
                                            <span className="text-muted-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-8 text-muted-foreground">
                    对条款有疑问？请发送邮件至<a href="mailto:opendevsociety@gmail.com" className="font-semibold text-brand-ink hover:underline">opendevsociety@gmail.com</a>.
                </p>
            </section>
        </>
    );
}
