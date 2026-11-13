import Image from 'next/image';
import { Code, Globe, Heart } from 'lucide-react';
import PageHero from '@/components/marketing/PageHero';
import SectionHead from '@/components/marketing/SectionHead';
import IconCard from '@/components/marketing/IconCard';
import { GOOD_FIRST_ISSUES_URL, REPO_URL } from '@/lib/constants';

export const metadata = {
    title: "关于项目 | OpenStock",
    description: "了解 OpenStock 与 Open Dev Society 的故事。",
};

const PRINCIPLES = [
    { icon: Globe, title: "开放使用", body: "核心功能没有付费门槛。所有人都能免费使用图表、自选股和研究工具，自行部署即可使用全部功能。" },
    { icon: Code, title: "开源透明", body: "代码完全公开。你可以审查算法、贡献功能，与我们一起改进产品。" },
    { icon: Heart, title: "社区共建", body: "依靠捐赠和志愿者持续运作，始终以用户需求为先。" },
];

export default function AboutPage() {
    return (
        <>
            <PageHero
                kicker="关于项目"
                title="让每个人都能使用的市场工具。"
                sub="我们相信金融信息不应被付费门槛阻隔。OpenStock 由社区共同构建，为社区服务。"
            >
                <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn btn-primary h-11 px-5 text-[15px]">查看源码</a>
                <a href={GOOD_FIRST_ISSUES_URL} target="_blank" rel="noreferrer" className="btn btn-ghost h-11 px-5 text-[15px]">参与贡献</a>
            </PageHero>

            <section className="mx-auto mt-20 max-w-[1200px] px-5">
                <SectionHead kicker="项目原则" title="我们坚持的原则。" />
                <div className="grid gap-3 md:grid-cols-3">
                    {PRINCIPLES.map(({ icon, title, body }) => <IconCard key={title} icon={icon} title={title}>{body}</IconCard>)}
                </div>
            </section>

            <section className="mx-auto mt-24 max-w-[1200px] px-5">
                <div className="hatch">
                    <div className="card grid items-center gap-10 p-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:p-12">
                        <div className="flex flex-col gap-4">
                            <p className="kicker text-brand-ink">Open Dev Society</p>
                            <h2 className="text-[30px] font-bold leading-tight tracking-[-0.04em]">源于一个简单的疑问。</h2>
                            <p className="text-[16px] leading-relaxed text-muted-foreground">
                                为什么强大的金融工具如此昂贵？OpenStock 就是我们的回答。</p>
                            <p className="text-[16px] leading-relaxed text-muted-foreground">
                                我们是一群来自 Open Dev Society 的开发者、设计师和金融爱好者。我们的使命是打造优质的开源软件，为专有平台提供人人可用的替代选择。</p>
                            <a href="https://github.com/Open-Dev-Society" target="_blank" rel="noreferrer" className="btn btn-ghost mt-2 self-start">
                                在 GitHub 了解 Open Dev Society</a>
                        </div>
                        <div className="relative grid aspect-square max-h-[340px] place-items-center rounded-[16px] bg-page shadow-[inset_0_0_0_1px_var(--line)]">
                            <Image src="/assets/icons/odsLogo.svg" alt="Open Dev Society" fill className="object-contain p-16 opacity-90" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
