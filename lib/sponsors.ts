// Everything sponsor-related lives here: edit this file when someone starts or stops sponsoring.
// Perks only name placements the code actually renders (README, sponsor wall, site footer,
// landing page, in-app sidebar), so the page never promises something the site doesn't do.

export type Sponsor = {
    name: string;
    url: string;
    logo?: string;       // white/transparent logo in /public, shown on dark surfaces
    iconOnly?: boolean;  // logo is a mark without the name, so the name is shown beside it
    banner?: string;     // sponsor-supplied banner, shown whole in the sponsor band instead of the logo
    blurb?: string;      // one line for the floating banner on the landing page
    tier?: SponsorTierId;
    period?: string;     // e.g. "2026"
    hideInFooter?: true; // past sponsor kept off the footer band (still on /love and in the README)
};

export type SponsorTierId = 'backer' | 'supporter' | 'company' | 'partner';

// One border colour per tier, shared by the tier cards on /sponsor and the sponsor band.
export const TIER_COLOR: Record<SponsorTierId, string> = {
    backer: 'oklch(0.72 0.11 50)',
    supporter: 'oklch(0.72 0.12 250)',
    company: 'oklch(0.8 0.13 176)',
    partner: 'oklch(0.72 0.14 300)',
};
export const tierBorder = (tier: SponsorTierId) => `color-mix(in oklch, ${TIER_COLOR[tier]} 55%, transparent)`;

// Registered accounts on the hosted app (13K+ as of September 2026). Update from the user collection count.
export const REGISTERED_USERS = '13,000+';

// Partners share the app sidebar; the Partner tier sells exactly this many slots.
export const SIDEBAR_SPONSOR_SLOTS = 3;

export const SPONSOR_TIERS: {
    id: SponsorTierId;
    name: string;
    monthly: number;
    blurb: string;
    perks: string[];
    slots?: number;
    featured?: boolean;
}[] = [
    {
        id: 'backer', name: '基础赞助', monthly: 5,
        blurb: '适合希望 OpenStock 保持免费的个人用户。',
        perks: ['在 README 赞助名单展示姓名', '每月致谢'],
    },
    {
        id: 'supporter', name: '支持者', monthly: 25,
        blurb: '适合希望持续支持开源项目的用户。',
        perks: ['包含基础赞助的全部权益', '在赞助墙展示姓名与头像', '在本页展示'],
    },
    {
        id: 'company', name: '企业赞助', monthly: 100, featured: true,
        blurb: '适合面向开发者和投资者的团队与产品。',
        perks: ['在所有公开页面的页脚展示标志', '在 README 展示标志', '在本页展示标志并链接至你的网站'],
    },
    {
        id: 'partner', name: '合作伙伴', monthly: 500, slots: SIDEBAR_SPONSOR_SLOTS,
        blurb: 'OpenStock 最醒目的展示位置，仅限三个。',
        perks: ['包含企业赞助的全部权益', `应用侧边栏三个赞助席位之一，面向 ${REGISTERED_USERS} 位注册用户`, '在首页展示标志'],
    },
];

export const ACTIVE_SPONSORS: Sponsor[] = [
    { name: 'Orbit', url: 'https://github.com/diip3sh/orbit', logo: '/assets/icons/orbit.png', iconOnly: true, tier: 'partner', blurb: '免费开源的 macOS 录屏与视频编辑工具。' },
];

export const PREVIOUS_SPONSORS: Sponsor[] = [
    { name: 'Atlas Cloud', url: 'https://www.atlascloud.ai', logo: '/assets/icons/atlascloud.svg', tier: 'partner' },
    { name: 'Siray.ai', url: 'https://www.siray.ai', logo: '/assets/icons/siray.svg', tier: 'partner', period: '2026' },
    { name: 'RapidProxy', url: 'https://www.rapidproxy.io', logo: '/assets/icons/rapidproxy.png', tier: 'company', period: '2026', hideInFooter: true },
];

// People who sponsored publicly on GitHub (private sponsors stay anonymous). Avatars come from GitHub.
export const SUPPORTERS: { name: string; login: string }[] = [
    { name: 'Jonas Gunklach', login: 'jonasgunklach' },
    { name: 'Dan Sellars', login: 'xlab-nyc' },
    { name: 'Mangolito', login: 'Mangolito' },
];

// Counted from GitHub Sponsors; individual sponsors stay anonymous unless they sponsor publicly.
export const SPONSOR_GOAL = { label: '每月赞助者', target: 1000, current: 1 };

export const SPONSOR_CONTACT_EMAIL = 'opendevsociety@gmail.com';

// Who receives sponsorships today (GitHub Sponsors is on the founder's personal account).
export const SPONSOR_RECIPIENT = { name: 'Ravi Pratap Singh', handle: 'ravixalgorithm', role: 'Open Dev Society 创始人' };

// Where sponsorship money goes. Add `monthly` (USD) to a line once the real bill is known;
// the page then shows amounts and each line's share. Lines without it never show a figure.
export const FUNDING_USES: { label: string; detail: string; monthly?: number }[] = [
    { label: '托管服务', detail: 'Vercel 托管应用与网站，当前流量已超过免费额度。' },
    { label: '行情数据', detail: 'Finnhub 密钥保证报价响应速度，并支持 OpenStock Cloud 上线。' },
    { label: '数据库', detail: 'MongoDB Atlas 存储账号、自选股和提醒。' },
    { label: 'AI 与邮件', detail: 'Gemini 生成欢迎邮件和每周摘要，并支付邮件发送成本。' },
    { label: '项目维护', detail: '用于审查社区代码、修复问题和开发新功能。' },
];

export const sidebarSponsors = () => ACTIVE_SPONSORS.filter((s) => s.tier === 'partner').slice(0, SIDEBAR_SPONSOR_SLOTS);
