import { Metadata } from 'next';
import { BookOpen, ChevronDown, Github, MessageCircle } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';
import IconCard from '@/components/marketing/IconCard';
import { DISCORD_URL, REPO_URL } from '@/lib/constants';

export const metadata: Metadata = {
    title: "使用帮助 | OpenStock",
    description: "由社区提供 OpenStock 使用支持，无需付费。",
};

const FAQS = [
    {
        question: "OpenStock 真的免费吗？",
        answer: "是的。项目依靠赞助和社区贡献运作，图表、自选股和研究工具保持免费。即将上线的 OpenStock Cloud 每月 5 美元，提供实时行情与邮件价格提醒；自行部署也包含这两项功能。",
    },
    {
        question: "如何添加自选股？",
        answer: "按 ⌘K 或点击侧边栏“搜索股票”，打开公司页面后点击“加入自选”，即可在自选股列表和侧边栏查看。",
    },
    {
        question: "行情数据来自哪里？",
        answer: "图表由 TradingView 实时提供。报价、自选股价格和提醒使用 Finnhub 数据，本站每小时刷新一次，每个价格均注明最近成交时间。",
    },
    {
        question: "支持哪些市场？",
        answer: "支持美股、加密货币和外汇实时行情；加拿大和澳大利亚延时行情；沙特阿拉伯和波兰由 Yahoo Finance 提供延时行情；印度（BSE）和德国提供收盘数据。价格提醒支持美股和加密货币。",
    },
    {
        question: "为什么价格提醒没有触发？",
        answer: "价格提醒属于 OpenStock Cloud，也可在自行部署的实时模式中使用。系统每五分钟检查一次，价格突破目标时发送邮件。请在自选股页面检查提醒状态。",
    },
    {
        question: "我可以贡献代码或设计吗？",
        answer: "当然可以。带有“good first issue”标签的问题适合入门，我们欢迎设计师、开发者和文档作者参与。",
    },
];

export default function HelpPage() {
    return (
        <>
            <PageHero kicker="使用帮助" title="需要什么帮助？" sub="面向所有人的社区支持。" />

            <section className="mx-auto mt-14 grid max-w-[1200px] gap-3 px-5 md:grid-cols-3">
                <IconCard icon={BookOpen} title="工作原理" footer={<a href="/api-docs" className="btn btn-ghost w-full">了解技术架构</a>}>
                    了解数据来源、后台任务和邮件生成使用的 AI。</IconCard>
                <IconCard icon={MessageCircle} title="社区交流" footer={<a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn btn-ghost w-full">加入 Discord</a>}>
                    向其他用户与项目维护者寻求帮助。</IconCard>
                <IconCard icon={Github} title="反馈问题" footer={<a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer" className="btn btn-ghost w-full">提交问题</a>}>
                    发现功能异常？请在 GitHub 反馈。</IconCard>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <SectionHead kicker="FAQ" title="常见问题。" />
                <div className="hatch">
                    <div className="card row-list overflow-hidden">
                        {FAQS.map(({ question, answer }) => (
                            <details key={question} className="group">
                                {/* Padding lives on the summary so the whole row is the click target, in every browser */}
                                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-foreground transition-colors hover:bg-hover/40 [&::-webkit-details-marker]:hidden">
                                    {question}
                                    <ChevronDown className="size-4 flex-none text-faint transition-transform duration-200 group-open:rotate-180" />
                                </summary>
                                <p className="max-w-3xl px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">{answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card flex flex-col items-start justify-between gap-5 p-8 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-[22px] font-bold tracking-[-0.03em]">仍然没有解决？</h2>
                            <p className="mt-1 text-muted-foreground">团队和社区提供免费的邮件支持。</p>
                        </div>
                        <a href="mailto:opendevsociety@gmail.com" className="btn btn-primary h-11 px-5 text-[15px]">邮件支持</a>
                    </div>
                </div>
            </section>
        </>
    );
}
