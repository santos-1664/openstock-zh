export type Guide = {
    slug: string;
    kicker: string;
    title: string;
    description: string;
    lede: string;
    sections: { heading: string; paragraphs: string[] }[];
    faqs: { question: string; answer: string }[];
};

// Honest comparison pages. Names of other products appear because that is the search,
// and the copy says what OpenStock does and does not do.
export const GUIDES: Guide[] = [
    {
        "slug": "free-tradingview-alternative",
        "kicker": "产品对比",
        "title": "免费的 TradingView 开源替代方案",
        "description": "OpenStock 是免费开源的股票跟踪工具。图表采用保留品牌标识的 TradingView 组件，自选股和邮件提醒由 OpenStock 提供。",
        "lede": "需要 Pine Script、券商登录或 TradingView 社交功能，请使用 TradingView。若需要可自行运行的免费自选股、图表和邮件提醒，OpenStock 提供围绕这些图表构建的开源应用。",
        "sections": [
            {
                "heading": "你可以获得什么",
                "paragraphs": [
                    "OpenStock 是采用 AGPL-3.0 许可证的网页应用。托管站点可免费注册、搜索公司和查看图表。K 线、绘图工具、财务数据、技术指标和公司资料来自 TradingView 嵌入组件，保留其标志和来源链接。",
                    "应用增加了账号、最多 50 个代码的自选股、浏览器式标签页，以及美国、印度、德国、加拿大、澳大利亚、加密货币和外汇市场工作台。配置邮件和 AI 服务后，可每周汇总关注股票的新闻。"
                ]
            },
            {
                "heading": "功能边界",
                "paragraphs": [
                    "OpenStock 无法替代 TradingView 订阅，不提供 Pine Script、策略回测、期权链或下单功能。可跨图表保留的常用指标包括 SMA、EMA、布林带、VWAP、RSI、MACD、随机指标和 ATR；其他指标仅在当前 TradingView 组件中使用。",
                    "公开公司页面仅提供 TradingView 图表和 SEC 公告，不单独显示报价。登录后的应用从其他提供商获取报价，这些报价不会在公开页面重新发布。"
                ]
            },
            {
                "heading": "使用成本",
                "paragraphs": [
                    "社区站点免费，报价约每小时更新一次，不启用邮件价格提醒。尚未开售的 OpenStock Cloud 计划每月 5 美元，提供实时行情和邮件提醒。自行部署免费，需自备行情密钥并启用实时模式，价格提醒每五分钟检查一次。"
                ]
            }
        ],
        "faqs": [
            {
                "question": "需要 TradingView 账号吗？",
                "answer": "不需要，图表使用免费的嵌入组件。只有需要保存布局或 Pine Script 等 TradingView 站内功能时，才需要其账号。"
            },
            {
                "question": "可以发布脚本或设置 TradingView 式提醒吗？",
                "answer": "图表不提供这些功能。OpenStock 提醒是在美股或加密货币价格突破目标时发送邮件，仅支持实时模式（自行部署或未来的 Cloud 服务）。"
            },
            {
                "question": "源码真的公开吗？",
                "answer": "是的，Open-Dev-Society/OpenStock 仓库采用 AGPL-3.0，可阅读、运行和修改。以网络服务形式提供修改版本时，须遵守 AGPL 的源码共享要求。"
            }
        ]
    },
    {
        "slug": "self-hosted-stock-tracker",
        "kicker": "自行部署",
        "title": "自行部署股票跟踪工具",
        "description": "使用 Docker 或预构建镜像在自己的服务器运行 OpenStock，使用自己的数据库和行情密钥，启用实时模式后可发送邮件价格提醒。",
        "lede": "OpenStock 基于 Next.js 和 MongoDB，可在小型 VPS 运行。托管站点便于直接使用；运行同一套代码，可通过自己的密钥控制数据与提醒。",
        "sections": [
            {
                "heading": "需要运行哪些服务",
                "paragraphs": [
                    "Docker Compose 同时启动应用和 MongoDB，数据库仅位于 Docker 内部网络，不发布到宿主机。每次推送 main 后，ghcr.io/open-dev-society/openstock 会发布 amd64 和 arm64 镜像。README 也介绍 Railway、Vercel 和一键托管方案。",
                    "源码构建需要 Node 22、MongoDB 和 Finnhub API 密钥。图表在浏览器直接从 TradingView 加载，无需该密钥；报价、搜索和邮件提醒使用密钥。Finnhub 常见套餐限个人用途，公开页面不展示这些报价。"
                ]
            },
            {
                "heading": "数据更新频率",
                "paragraphs": [
                    "默认缓存模式约每小时刷新报价，同一实例内的用户共享数据。实时模式约每 15 秒刷新报价，价格提醒每五分钟检查，触发时发送邮件。实时模式需要在构建时设置 NEXT_PUBLIC_OPENSTOCK_DATA_MODE=realtime 并提供自己的密钥。预构建镜像使用缓存模式，实时模式需自行构建。",
                    "欢迎邮件、提醒和每周一摘要需要 Inngest；邮件需要邮箱配置；摘要还需要 AI 服务密钥。未配置时，图表和自选股仍可使用。"
                ]
            },
            {
                "heading": "适合哪些用户",
                "paragraphs": [
                    "适合希望在自己设备上管理自选股的人，或共享同一实例的团队。这是单一网页应用，不是多租户托管平台。许可证为 AGPL-3.0，将修改版本作为服务提供时，须向用户提供源码。"
                ]
            }
        ],
        "faqs": [
            {
                "question": "自行部署包含图表吗？",
                "answer": "包含。TradingView 图表在浏览器中加载，不经过你的 API 密钥。"
            },
            {
                "question": "默认 Docker 镜像支持提醒吗？",
                "answer": "预构建镜像使用缓存模式，不发送价格提醒。需启用实时模式并重新构建，再配置邮件与 Inngest。"
            },
            {
                "question": "在哪里查看安装指南？",
                "answer": "README 的 Self-hosting 部分介绍 Docker Compose、容器镜像、Railway、Vercel 和相关环境变量。"
            }
        ]
    },
    {
        "slug": "free-stock-watchlist",
        "kicker": "自选股",
        "title": "带邮件提醒的免费自选股工具",
        "description": "免费账号可保存最多 50 个股票代码。邮件提醒目前需要自行部署并启用实时模式，公开托管站点暂不提供。",
        "lede": "自选股帮助你集中跟踪实际关注的公司。在搜索中添加代码并保留图表。邮件提醒目前需自行部署，公开站点不发送提醒，OpenStock Cloud 尚未开售。",
        "sections": [
            {
                "heading": "免费托管站点提供什么",
                "paragraphs": [
                    "注册账号后可添加最多 50 个代码，自选股与账号绑定，在侧边栏展示并持续保存。社区站点报价约每小时更新一次，不启用价格提醒，因为共享数据的更新频率不足以每几分钟检查目标价。",
                    "每个代码均可查看图表、财务数据、技术指标和公司资料。部署环境配置邮件后，还可提供每周一摘要。"
                ]
            },
            {
                "heading": "何时发送提醒邮件",
                "paragraphs": [
                    "仅在实时模式中，每五分钟检查提醒。需自行部署并配置行情密钥及 NEXT_PUBLIC_OPENSTOCK_DATA_MODE=realtime，或使用未来的 OpenStock Cloud（计划每月 5 美元）。邮件发送至账号邮箱，触发条件为高于或低于设置的价格。",
                    "提醒仅支持美股和加密货币。其他市场可加入自选股，但免费提醒数据源不提供这些市场的报价，因此不会触发提醒。"
                ]
            },
            {
                "heading": "不包含哪些功能",
                "paragraphs": [
                    "没有券商连接或下单按钮，自选股仅用于跟踪价格和接收越过目标价的通知。它不是选股器，不能按财务比率或成交量筛选全市场。搜索支持公司名称或代码，公开股票目录包含标普 500 和纳斯达克 100。"
                ]
            }
        ],
        "faqs": [
            {
                "question": "可以关注多少个代码？",
                "answer": "当前每个账号最多 50 个。"
            },
            {
                "question": "为什么没有收到提醒邮件？",
                "answer": "公开社区站点未启用提醒。实时模式每五分钟检查一次并向账号邮箱发送邮件。请确认代码属于美股或加密货币，且目标价方向设置正确。"
            },
            {
                "question": "自选股是私密的吗？",
                "answer": "是的，自选股与账号绑定。公开公司页面不是你的自选股，也不会展示你的提醒。"
            }
        ]
    },
    {
        "slug": "open-source-bloomberg-alternative",
        "kicker": "产品对比",
        "title": "彭博式行情终端的开源替代选择",
        "description": "OpenStock 是免费开源的股票跟踪工具，提供图表、自选股和 SEC 公告，无法替代专业行情终端。",
        "lede": "专业终端集成新闻、通讯、债券交易和定价服务，月费可能达数千美元。OpenStock 并不提供这些能力，而是让个人免费跟踪上市公司、阅读图表和监管公告。",
        "sections": [
            {
                "heading": "OpenStock 覆盖的范围",
                "paragraphs": [
                    "支持美国、印度、德国、加拿大、澳大利亚股票及加密货币和外汇，提供 TradingView 图表与绘图工具、自选股、实时模式的邮件提醒和每周新闻摘要。标普 500 与纳斯达克 100 的公开页面附有 SEC EDGAR 年报与季报链接。",
                    "项目源码公开，采用 AGPL-3.0。开发者可以检查报价如何从数据源传递到界面，这种透明性是封闭终端难以提供的。"
                ]
            },
            {
                "heading": "不覆盖的范围",
                "paragraphs": [
                    "不提供实时新闻专线、聊天工具、订单路由、固定收益、衍生品分析、Excel 插件或合规归档。登录后行情使用 Finnhub 个人用途套餐，可能延时。页面内容不构成买入或卖出报价。",
                    "如用于代客交易或持仓估值，应选择提供商业展示许可的数据供应商。OpenStock 用于个人学习和研究，公开页面避免重新发布受限制的行情。"
                ]
            },
            {
                "heading": "合理的使用方式",
                "paragraphs": [
                    "学生、自行部署用户和个人投资者可无需席位许可地管理关注列表、阅读公告。图表和公告仅作为信息参考，涉及资金决策时，请阅读公司原始报告并使用有权依赖的数据来源。"
                ]
            }
        ],
        "faqs": [
            {
                "question": "OpenStock 可以替代彭博终端吗？",
                "answer": "仅能满足免费跟踪股票、阅读图表与公告的有限需求，不能替代专业终端。"
            },
            {
                "question": "企业能在办公室展示 OpenStock 吗？",
                "answer": "代码采用 AGPL-3.0，可按许可运行；修改后作为服务提供时须遵守源码共享要求。常用行情套餐仅限个人用途，企业展示报价需要另向数据供应商获得商业许可，OpenStock 不授予该许可。"
            },
            {
                "question": "公开公司页面的数据来自哪里？",
                "answer": "图表来自 TradingView，板块和指数成分为静态数据，公告日期及行业代码来自 SEC EDGAR；公开页面不单独提供报价。"
            }
        ]
    },
    {
        "slug": "stock-market-app-for-students",
        "kicker": "学生入门",
        "title": "面向学生的股票市场应用",
        "description": "无需信用卡即可使用免费的股票跟踪工具：图表、自选股、美国大型公司的 SEC 公告，以及可供课程项目阅读的源码。",
        "lede": "OpenStock 免费注册，源码也可免费阅读。它帮助你学习行情界面如何运作，不会告诉你该买什么。",
        "sections": [
            {
                "heading": "在网站上可以做什么",
                "paragraphs": [
                    "打开美国大型公司的页面，查看 TradingView 图表，并跳转至 EDGAR 阅读最新 10-K 或 10-Q，将代码保存到自选股。登录后还可浏览印度、德国、加拿大、澳大利亚、加密货币和外汇市场。",
                    "社区站点无需信用卡。邮件提醒属于自行部署的实时模式或未来的付费 Cloud 服务，不包含在免费托管站点中。每小时更新的行情适合学习界面，不应视为交易信号。"
                ]
            },
            {
                "heading": "如何使用源码学习",
                "paragraphs": [
                    "应用采用 Next.js、TypeScript、Tailwind 和 MongoDB，后台任务使用 Inngest。可从 good first issue 标签的问题入手。课程项目可 Fork 仓库、连接数据库，学习真实的登录流程、自选股和图表嵌入。许可证为 AGPL-3.0：仅在本机完成课程作业属于一般使用，将修改版本上线供他人使用时须共享源码。"
                ]
            },
            {
                "heading": "请勿将它作为投资建议",
                "paragraphs": [
                    "OpenStock 不是经纪商或财务顾问，公告和图表仅供参考。完成投资组合课程作业时，应引用公司原始公告并说明各项数字的来源。公开公司页面会区分 EDGAR 事实和 TradingView 图表。"
                ]
            }
        ],
        "faqs": [
            {
                "question": "注册需要付费吗？",
                "answer": "不需要，社区站点免费。包含实时行情和邮件提醒的付费 Cloud 方案已公布，但尚未开售。"
            },
            {
                "question": "可以在作业中引用 OpenStock 吗？",
                "answer": "请引用原始来源。美国公司的收入或风险因素应引用 EDGAR 的 10-K；图表应注明由 OpenStock 嵌入的 TradingView 组件提供。"
            },
            {
                "question": "有手机应用吗？",
                "answer": "暂无独立手机应用，网站支持响应式布局，可以添加到手机主屏幕。"
            }
        ]
    },
    {
        "slug": "track-nse-stocks",
        "kicker": "印度市场",
        "title": "免费跟踪 NSE 股票",
        "description": "了解 OpenStock 如何展示印度股票：登录后的应用提供 BSE 图表和收盘行情，当前不提供印度股票的公开页面或 EDGAR 对应关系。",
        "lede": "无需付费即可关注印度公司。登录后应用使用 BSE 代码，因为免费的 TradingView 嵌入组件未授权 NSE 图表。目前公开股票目录仅包含美股。",
        "sections": [
            {
                "heading": "登录后可以使用什么",
                "paragraphs": [
                    "印度市场包含 Reliance、TCS、Infosys、HDFC Bank 等流动性较好的 BSE 公司，提供收盘行情而非实时数据。搜索接受常见的 NSE 后缀 .NS，图表会映射到同一公司的 BSE 上市代码，因为 TradingView 免费组件无法显示 NSE 图表。",
                    "这些代码不支持价格提醒。提醒需要服务器每五分钟重新检查报价，目前仅支持美股和加密货币。"
                ]
            },
            {
                "heading": "公开页面尚未提供什么",
                "paragraphs": [
                    "公开目录 /s 包含标普 500 和纳斯达克 100，并附有 EDGAR 链接。目前不提供印度代码页面或 EDGAR 映射。NIFTY 50 页面需逐一验证 TradingView 嵌入后再考虑增加；不会使用禁止再分发的数据套餐构建公开报价页。"
                ]
            },
            {
                "heading": "如何跟踪一家公司",
                "paragraphs": [
                    "注册后搜索公司，将其加入自选股。图表提供收盘数据，公司资料和财务数据由 TradingView 组件提供。查看公司行动或业绩时，请阅读交易所公告或公司投资者关系页面。OpenStock 不是经纪商，不会在 NSE 或 BSE 下单。"
                ]
            }
        ],
        "faqs": [
            {
                "question": "为什么不显示 NSE 图表？",
                "answer": "TradingView 免费组件不接受 NSE 代码，OpenStock 将其映射至同一公司的 BSE 代码以加载图表。这是授权限制，无法通过界面样式解决。"
            },
            {
                "question": "印度行情是实时的吗？",
                "answer": "不是，印度市场标注为收盘数据。美股和加密货币可根据部署配置提供实时或每小时更新的报价。"
            },
            {
                "question": "能为 Reliance 或 TCS 设置邮件提醒吗？",
                "answer": "目前不支持，邮件提醒仅适用于美股和加密货币。"
            }
        ]
    }
];

const BY_SLUG = new Map(GUIDES.map((guide) => [guide.slug, guide]));

export function findGuide(slug: string): Guide | undefined {
    return BY_SLUG.get(slug);
}
