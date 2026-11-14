import Link from 'next/link';

export const metadata = { title: '使用帮助 | OpenStock' };
const FAQS = [
    ['看盘工具在哪里，如何使用？', '进入股票详情页，在走势图上方选择日、周、月线或指标预设；走势图下方可查看阶段高低点、均线、量能和与 SPY 的表现对比。统计独立使用日线，支持21、63、126、252根日线区间；提醒按钮会预填价格，确认后才创建。本站图表配置按股票保存在当前浏览器，手动画线不保存。'],
    ['如何查看行情？', '登录后进入市场概览，查看指数跟踪 ETF 报价、标普 500 和纳斯达克 100 热力图。搜索股票可打开价格、走势图、技术指标和公司资料。'],
    ['报价是实时的吗？', '本站使用 Yahoo Finance 免费报价，服务器缓存五分钟。TradingView 图表有各自的数据来源和延时，请查看图表中的数据标记。指数卡片展示跟踪指数的 ETF 价格，并非指数点位。'],
    ['如何添加和整理自选股？', '点击搜索股票或按 ⌘K，进入股票页面后点击关注。自选股页面支持创建分组，并通过每行的分组按钮添加股票。'],
    ['站内价格提醒如何工作？', '在股票页或自选股列表点击铃铛设置目标价格。保持网页打开，系统每分钟检查缓存报价，达到条件后在站内提示；关闭网页后不会发送邮件或推送。'],
    ['为什么某些字段为空？', '免费行情源未提供部分公司的市值、股息等字段，或第三方服务暂时无法访问。走势图和财务面板由 TradingView 提供，可查看对应板块。'],
    ['如何登录？', '在登录页面选择 Google 登录。账号、自选股、分组和提醒保存在本站数据库中。'],
];
export default function HelpPage() {
    return <section className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="page-title">使用帮助</h1>
        <p className="mt-3 text-muted-foreground">本站的功能与数据说明。</p>
        <div className="mt-8 divide-y divide-line rounded-2xl border border-line">
            {FAQS.map(([question, answer]) => <details key={question} className="px-5 py-4">
                <summary className="cursor-pointer font-semibold">{question}</summary>
                <p className="mt-3 leading-7 text-muted-foreground">{answer}</p>
            </details>)}
        </div>
        <Link href="/dashboard" className="btn btn-primary mt-8">返回工作台</Link>
    </section>;
}
