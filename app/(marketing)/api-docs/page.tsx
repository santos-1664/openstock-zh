import { BarChart2, Clock, Mail, UserX } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';
import IconCard from '@/components/marketing/IconCard';
import { REPO_URL } from '@/lib/constants';

export const metadata = {
    title: "技术架构 | OpenStock",
    description: "了解 OpenStock 的行情数据、后台任务和邮件 AI 服务如何运作。",
};

const DATA_MODES = [
    { name: "缓存模式", cadence: "每小时", body: "公开站点的默认模式。每小时获取一次行情并供所有用户共享，成本随股票代码数量增长，而非随用户数增长。" },
    { name: "实时模式", cadence: "每 15 秒", body: "适用于 OpenStock Cloud 和自行部署。设置 NEXT_PUBLIC_OPENSTOCK_DATA_MODE=realtime，即可实时刷新价格并启用邮件价格提醒。" },
];

const COVERAGE = [
    ["美股、加密货币", "实时", 'Yes'],
    ['Forex', "实时", 'No'],
    ["加拿大、澳大利亚", "延时", 'No'],
    ["沙特阿拉伯、波兰（Yahoo Finance）", "延时", 'No'],
    ["印度（BSE）、德国", "收盘数据", 'No'],
];

const FLOW = ["用户注册或定时任务触发", "Inngest 执行函数", "Gemini 生成文本", "Gemini 失败时由 MiniMax 接替", "发送邮件"];

const JOBS = [
    { icon: Mail, title: "欢迎邮件", trigger: "注册时", body: "AI 根据注册时选择的国家、投资目标、风险偏好和行业生成个性化介绍。" },
    { icon: BarChart2, title: "每周新闻摘要", trigger: "每周一 09:00", body: "汇总一周市场新闻，通过 Kit 广播发送。" },
    { icon: Clock, title: "价格提醒", trigger: "每 5 分钟", body: "对照 Finnhub 报价检查所有生效提醒，触发时向用户发送邮件，仅限实时模式。" },
    { icon: UserX, title: 'Re-engagement', trigger: "每天 10:00", body: "识别长期未活跃的账号，发送友好的提醒。" },
];

const STACK = [
    ['Finnhub', "提供报价、公司资料、搜索和新闻，使用密钥池按请求轮换。", 'https://finnhub.io'],
    ['TradingView', "实时嵌入走势图、热力图、技术分析和行情组件。", 'https://www.tradingview.com/widget/'],
    ['Inngest', "支持重试的后台任务与定时调度。", 'https://www.inngest.com'],
    ['Better Auth', "支持邮箱、Google 和 GitHub 登录，使用 MongoDB 存储会话。", 'https://www.better-auth.com'],
    ['MongoDB Atlas', "存储用户、自选股和提醒。", 'https://www.mongodb.com/atlas'],
    ['Kit', "通过邮件广播发送每周摘要。", 'https://kit.com'],
];

export default function ArchitecturePage() {
    return (
        <>
            <PageHero
                kicker="技术架构"
                title="OpenStock 如何运作。"
                sub="了解行情和邮件背后的事件驱动架构，以及多个服务提供商的协作方式。"
            >
                <span className="pill h-8 px-3">v1.0.0</span>
                <span className="pill h-8 px-3">Gemini 主服务，MiniMax 备用</span>
                <span className="pill h-8 px-3">开源 · AGPL-3.0</span>
            </PageHero>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="行情数据" title="两种数据模式，共享一套缓存。" sub="图表始终由 TradingView 提供。自行获取的报价统一经过共享缓存并设置超时，避免数据源响应缓慢拖住页面。" />
                <div className="grid gap-3 md:grid-cols-2">
                    {DATA_MODES.map(({ name, cadence, body }) => (
                        <div key={name} className="hatch">
                            <div className="card flex h-full flex-col gap-2 p-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[16px] font-bold">{name}</h3>
                                    <span className="pill is-brand">{cadence}</span>
                                </div>
                                <p className="text-[14px] leading-relaxed text-muted-foreground">{body}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hatch mt-3">
                    <div className="card overflow-x-auto">
                        <table className="data-table">
                            <thead><tr><th>市场</th><th>图表</th><th>报价与提醒</th></tr></thead>
                            <tbody>
                                {COVERAGE.map(([market, charts, quotes]) => (
                                    <tr key={market}>
                                        <td className="font-semibold text-foreground">{market}</td>
                                        <td className="text-muted-foreground">{charts}</td>
                                        <td><span className={quotes === 'Yes' ? 'pill is-up' : 'pill'}>{quotes}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <a href={`${REPO_URL}/blob/main/MARKET_SUPPORT.md`} target="_blank" rel="noreferrer" className="btn btn-ghost mt-4">查看完整市场支持说明</a>
            </section>

            <section className="mx-auto mt-24 grid max-w-[1200px] items-start gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                    <SectionHead kicker="AI" title="单一服务故障不会中断邮件生成。" sub="欢迎邮件和新闻摘要由 Gemini 2.5 Flash-Lite 生成，失败时默认改用 MiniMax-M3.1-Flash 重试。可通过 MINIMAX_MODEL 设置 MiniMax-M3 或其他模型。" />
                </div>
                <div className="hatch">
                    <ol className="card flex flex-col gap-1 p-4">
                        {FLOW.map((step, i) => (
                            <li key={step} className="flex items-center gap-3 rounded-[10px] px-2 py-2.5">
                                <span className="mono grid size-7 flex-none place-items-center rounded-full bg-page text-[12px] text-brand-ink shadow-[inset_0_0_0_1px_var(--line)]">{i + 1}</span>
                                <span className="font-semibold">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <SectionHead kicker="后台任务" title="四项任务维持日常运作。" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {JOBS.map(({ icon, title, trigger, body }) => (
                        <IconCard key={title} icon={icon} title={title} footer={<span className="pill mono">{trigger}</span>}>{body}</IconCard>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <SectionHead kicker="Stack" title="基于公开透明的服务构建。" />
                <div className="hatch">
                    <div className="card row-list">
                        {STACK.map(([name, body, url]) => (
                            <a key={name} href={url} target="_blank" rel="noreferrer" className="group flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-hover/40 sm:flex-row sm:items-center sm:gap-6">
                                <span className="w-40 flex-none font-bold text-foreground group-hover:text-brand-ink">{name}</span>
                                <span className="text-muted-foreground">{body}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
