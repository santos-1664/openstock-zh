import Link from 'next/link';
export const metadata = { title: '开源信息 | OpenStock' };
export default function AboutPage() {
    return <section className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="page-title">开源信息</h1>
        <p className="mt-6 leading-7 text-muted-foreground">本站基于 Open Dev Society 的 OpenStock 开源项目构建，采用 AGPL-3.0 许可证，包含中文界面、Google 登录、免费行情和站内提醒等调整。</p>
        <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn btn-ghost" href="https://github.com/Open-Dev-Society/OpenStock" target="_blank" rel="noopener noreferrer">上游项目</a>
            <a className="btn btn-ghost" href="https://github.com/santos-1664/openstock-zh" target="_blank" rel="noopener noreferrer">本站源码</a>
            <a className="btn btn-ghost" href="https://github.com/santos-1664/openstock-zh/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">许可证</a>
            <Link href="/dashboard" className="btn btn-primary">返回工作台</Link>
        </div>
    </section>;
}
