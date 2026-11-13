// OpenStock's changelog, newest first. The banner and its modal show RELEASES[0]; /changelog shows the whole timeline.
// Write "#123" in an item to link that pull request.
// Who made a release happen: pull requests they wrote and issues they opened that led to a change.
// Taken from GitHub (PR authors and the issues each PR closed); bots aren't listed.
export type Credit = { login: string; prs?: number[]; issues?: number[] };

export type Release = {
    id: string;
    date: string;
    title: string;
    summary: string;
    highlights?: string[]; // the short list in the banner's modal (latest release only)
    sections: { title: string; items: string[] }[];
    credits: Credit[];
};

export const MAINTAINER = 'ravixalgorithm';

export const RELEASES: Release[] = [
    {
        "id": "2026-11-09",
        "date": "9 11 月 2026",
        "title": "11 月更新",
        "summary": "新增沙特和波兰市场、股息率及公开股票页面",
        "highlights": [
            "新增沙特阿拉伯（Tadawul）和波兰（华沙）市场，提供延时行情。",
            "股票页面增加股息率。",
            "公司资料和对比指南无需登录即可访问。",
            "Docker 自行部署恢复实时模式支持。"
        ],
        "sections": [
            {
                "title": "市场",
                "items": [
                    "新增沙特阿拉伯（Tadawul）市场：TASI、Aramco、Al Rajhi 和 STC 指数卡片、涨跌排行及报价表。因 TradingView 不允许嵌入 Tadawul，改用 Yahoo Finance；股票页和自选股也显示报价。 #145",
                    "新增波兰（华沙 GPW）市场：WIG20、WIG、mWIG40、sWIG80 卡片、涨跌排行及蓝筹报价表。因 TradingView 嵌入仅有收盘数据，采用 Yahoo Finance 延时行情；股票页和自选股也显示报价。 #147"
                ]
            },
            {
                "title": "股票页面",
                "items": [
                    "新增股息率卡片，使用 Finnhub 真实数据；不分红的股票和加密货币显示横线。 #137",
                    "公开公司资料和对比页面无需登录即可访问，并提供搜索引擎可读取的 robots.txt 与 sitemap.xml。 #136"
                ]
            },
            {
                "title": "自选股",
                "items": [
                    "自定义自选股分组：最多创建 10 个分组，每组 50 个代码，可从自选股行或搜索中直接添加。 #148"
                ]
            },
            {
                "title": "语言",
                "items": [
                    "新增波兰语：应用、登录页、错误提示、欢迎和重置密码邮件均支持，可跟随浏览器语言或在侧边栏手动选择。 #157",
                    "新增阿拉伯语：应用、登录页、错误和邮件均支持，使用 IBM Plex Sans Arabic，布局从右向左，菜单从右侧打开。 #146"
                ]
            },
            {
                "title": "自行部署",
                "items": [
                    "Docker 和 Railway 自行部署恢复实时模式，数据模式在构建时传入。 #134",
                    "未指定其他模型时，MiniMax 默认使用 MiniMax-M3.1-Flash。 #140",
                    "升级至 better-auth 1.7.10 和 nodemailer 10.1.2，减少 81 个依赖包。 #132 #133",
                    "修复每周新闻邮件仅保存为 Kit 草稿时仍报告成功的问题，避免重复重试生成更多草稿。 #151",
                    "实验性支持 Cloudflare Workers，每个请求独立连接数据库，限流器仅信任 Cloudflare 提供的客户端地址；官方托管站点仍在 Vercel。 #150"
                ]
            },
            {
                "title": "社区",
                "items": [
                    "每个版本列出贡献者，页面底部汇总所有参与构建 OpenStock 的朋友。 #131",
                    "重写 README，反映当前功能，并增加最新版本徽章。 #135 #141",
                    "加入行为准则（Contributor Covenant 2.1）和 FLOSS/fund 资助清单。 #139 #138"
                ]
            }
        ],
        "credits": [
            {
                "login": "ravixalgorithm",
                "prs": [
                    131,
                    132,
                    133,
                    134,
                    135,
                    136,
                    138,
                    139,
                    141,
                    145,
                    150
                ]
            },
            {
                "login": "ahmaddirar-ios",
                "prs": [
                    142,
                    146,
                    148
                ]
            },
            {
                "login": "octo-patch",
                "prs": [
                    140
                ]
            },
            {
                "login": "pawisoon",
                "prs": [
                    147,
                    157
                ]
            },
            {
                "login": "samki6576",
                "prs": [
                    137
                ]
            },
            {
                "login": "dajiaohuang",
                "prs": [
                    151
                ]
            },
            {
                "login": "soarkit",
                "issues": [
                    149
                ]
            }
        ]
    },
    {
        "id": "2026-10-18",
        "date": "18 10 月 2026",
        "title": "10 月更新",
        "summary": "图表绘制、指标持久保存与更安全的登录",
        "highlights": [
            "Draw trend lines, Fibonacci and text on any stock chart.",
            "The indicators you pick stay on every chart.",
            "Tickers like M&M, Bajaj-Auto and Ericsson B now chart correctly.",
            "Sign-in and password reset are rate-limited, and a reset signs out your other devices.",
            "A prebuilt Docker image for self-hosting."
        ],
        "sections": [
            {
                "title": "图表",
                "items": [
                    "股票图表支持趋势线、水平线、斐波那契、形状和文字绘制。 #118",
                    "已选技术指标（SMA、EMA、布林带、VWAP、RSI、MACD、随机指标、ATR）会跨图表保留，刷新与全屏后仍然有效。 #119",
                    "修复包含 - 或 & 的股票代码图表，包括印度 M&M、Bajaj-Auto、斯德哥尔摩 Ericsson B、哥本哈根 Novo Nordisk B。 #117"
                ]
            },
            {
                "title": "自选股",
                "items": [
                    "自选股最多保存 50 只，达到上限时提示。 #127",
                    "侧边栏关注列表独立滚动，不再挤压页面。 #110"
                ]
            },
            {
                "title": "安全",
                "items": [
                    "登录、注册和重置密码增加限流，降低密码猜测和邮件滥发风险。 #126",
                    "重置密码后退出其他设备的会话。 #125",
                    "阻止注册信息中的链接或标记注入欢迎邮件。 #122",
                    "修复后台任务误向整个订阅列表发送邮件的风险，日志不再记录订阅邮箱。 #120",
                    "更新 Next.js 安全版本，覆盖约 30 项安全公告。 #121"
                ]
            },
            {
                "title": "自行部署",
                "items": [
                    "提供基于 Node 22 LTS 的 amd64 和 arm64 预构建 Docker 镜像：ghcr.io/open-dev-society/openstock。 #128",
                    "构建 Docker 镜像无需数据库或密钥，镜像不存储密钥。 #123",
                    "Docker Compose 不再向宿主网络公开 MongoDB，密码通过 .env 配置。 #124",
                    "支持 RepoCloud、ZopDay 和 Railway 一键部署。 #111 #115 #94"
                ]
            },
            {
                "title": "社区",
                "items": [
                    "新增社区支持墙，展示赞助者、支持者及社区文章、视频和动态。",
                    "Orbit 和 RapidProxy 加入赞助商。"
                ]
            }
        ],
        "credits": [
            {
                "login": "ravixalgorithm",
                "prs": [
                    116,
                    117,
                    118,
                    119,
                    120,
                    121,
                    122,
                    123,
                    124,
                    125,
                    126,
                    127,
                    128,
                    129,
                    130
                ]
            },
            {
                "login": "cosmind-rusu",
                "prs": [
                    94
                ]
            },
            {
                "login": "Yi-111-a",
                "prs": [
                    110
                ]
            },
            {
                "login": "cosark",
                "prs": [
                    111
                ]
            },
            {
                "login": "muskanbandta23",
                "prs": [
                    115
                ]
            },
            {
                "login": "nexitpl",
                "issues": [
                    47,
                    54
                ]
            },
            {
                "login": "brainistry10",
                "issues": [
                    113
                ]
            },
            {
                "login": "Greatz08",
                "issues": [
                    83
                ]
            },
            {
                "login": "saschabrockel",
                "issues": [
                    36
                ]
            },
            {
                "login": "a-lacruz",
                "issues": [
                    109
                ]
            }
        ]
    },
    {
        "id": "2026-09-25",
        "date": "25 9 月 2026",
        "title": "全新界面设计",
        "summary": "全新界面、公开首页、更多市场和多项修复",
        "sections": [
            {
                "title": "新增",
                "items": [
                    "重新设计应用：悬浮工作区、浏览器式标签页和更温暖的配色。 #106",
                    "新增公开首页、纽约交易时段表盘和赞助页面。 #106",
                    "工作台新增美国、印度、德国、加拿大、澳大利亚、加密货币和外汇市场。 #106",
                    "新增个人资料页，可修改资料、查看关联登录和修改密码，并支持 Google、GitHub 登录。 #106"
                ]
            },
            {
                "title": "调整",
                "items": [
                    "免费站点的所有用户共享每小时刷新的行情。 #106",
                    "价格提醒调整为 OpenStock Cloud 和自行部署功能。",
                    "服务端函数迁移至数据库附近的孟买区域，提高响应速度。"
                ]
            },
            {
                "title": "修复",
                "items": [
                    "自选股与提醒操作绑定当前登录用户，修复此前可能修改他人数据的问题。 #106",
                    "恢复欢迎邮件、价格提醒、每周摘要及密码重置流程。 #106",
                    "行情响应缓慢不再拖住页面，支持包含 + 的邮箱地址。 #106",
                    "修复 TradingView 不支持的交易所和港股图表持续卡住的问题。",
                    "改善自行部署的环境检查提示。 #104",
                    "修正 README：新闻摘要为每周发送，而非每日。 #91",
                    "合入社区修复：市值不再显示 NaN #82、国家选项增加台湾 #70、全屏后保留指标 #68、邮件设置可选 #69、提醒操作测试 #93。"
                ]
            }
        ],
        "credits": [
            {
                "login": "ravixalgorithm",
                "prs": [
                    106
                ]
            },
            {
                "login": "keshav-005",
                "prs": [
                    68,
                    69,
                    70
                ]
            },
            {
                "login": "Mubashirrrr",
                "prs": [
                    82
                ]
            },
            {
                "login": "fuxicodex",
                "prs": [
                    93
                ]
            },
            {
                "login": "BambaSatoru",
                "prs": [
                    104
                ]
            },
            {
                "login": "kuishou68",
                "prs": [
                    91
                ]
            },
            {
                "login": "nexitpl",
                "issues": [
                    49
                ]
            },
            {
                "login": "juipeter-pixel",
                "issues": [
                    34
                ]
            },
            {
                "login": "soonfatt",
                "issues": [
                    38
                ]
            },
            {
                "login": "khajaG321",
                "issues": [
                    28
                ]
            }
        ]
    },
    {
        "id": "2026-08",
        "date": "6 月 – 8 月 2026",
        "title": "夏季修复",
        "summary": "市场支持指南、更可靠的邮件和更新的 AI 模型",
        "sections": [
            {
                "title": "更新内容",
                "items": [
                    "新增市场支持指南，说明各交易所的图表、报价和提醒支持范围及原因。 #84",
                    "邮件功能改为可选，未配置也可运行应用，警告信息不再乱码。 #85",
                    "个性化邮件默认使用 MiniMax 较新的 M3 模型。 #87"
                ]
            }
        ],
        "credits": [
            {
                "login": "akoweicollinxx",
                "prs": [
                    84,
                    85
                ]
            },
            {
                "login": "octo-patch",
                "prs": [
                    87
                ]
            },
            {
                "login": "maxsyst",
                "issues": [
                    37
                ]
            }
        ]
    },
    {
        "id": "2026-05",
        "date": "4 月 – 5 月 2026",
        "title": "密码重置",
        "summary": "邮件重置密码、实时密码规则提示与搜索改进",
        "sections": [
            {
                "title": "更新内容",
                "items": [
                    "支持通过邮件重置忘记的密码。 #71",
                    "注册时实时展示密码规则与满足情况。 #79",
                    "图表使用正确时区。 #72",
                    "搜索显示正确的交易所和公司信息。 #73",
                    "本地启动不再出现 Turbopack 项目根目录警告。 #74"
                ]
            }
        ],
        "credits": [
            {
                "login": "keshav-005",
                "prs": [
                    71,
                    72,
                    73,
                    74
                ]
            },
            {
                "login": "Chukwuebuka-2003",
                "prs": [
                    79
                ]
            },
            {
                "login": "danieldanielecki",
                "issues": [
                    66
                ]
            },
            {
                "login": "nexitpl",
                "issues": [
                    35
                ]
            },
            {
                "login": "aaronwork1205",
                "issues": [
                    55
                ]
            },
            {
                "login": "k2alzhang",
                "issues": [
                    39
                ]
            }
        ]
    },
    {
        "id": "2026-03",
        "date": "3 月 2026",
        "title": "市场情绪与 40 多个交易所",
        "summary": "了解市场情绪，覆盖更多交易所",
        "sections": [
            {
                "title": "更新内容",
                "items": [
                    "每个股票页增加 Reddit、X、新闻和 Polymarket 的热度与看涨情绪。 #64",
                    "支持 40 多个国际交易所的图表。 #65",
                    "MiniMax 可作为个性化邮件的替代 AI 服务。 #61",
                    "更新依赖与后台任务。 #63"
                ]
            }
        ],
        "credits": [
            {
                "login": "alexander-schneider",
                "prs": [
                    64
                ]
            },
            {
                "login": "Bortlesboat",
                "prs": [
                    65
                ]
            },
            {
                "login": "octo-patch",
                "prs": [
                    61
                ]
            },
            {
                "login": "TPTBusiness",
                "prs": [
                    63
                ]
            },
            {
                "login": "NicolasBohn",
                "prs": [
                    63
                ]
            },
            {
                "login": "maplelaef0320",
                "issues": [
                    24
                ]
            }
        ]
    },
    {
        "id": "2026-02",
        "date": "2 月 2026",
        "title": "中国内地与香港图表",
        "summary": "上海、深圳和香港股票图表正常显示",
        "sections": [
            {
                "title": "更新内容",
                "items": [
                    "将上海、深圳和香港股票代码转换为 TradingView 格式，确保图表正常加载。 #57"
                ]
            }
        ],
        "credits": [
            {
                "login": "CrixusWen",
                "prs": [
                    57
                ]
            },
            {
                "login": "ravixalgorithm",
                "prs": [
                    51
                ]
            }
        ]
    },
    {
        "id": "2026-01",
        "date": "1 月 2026",
        "title": "自选股、提醒和新闻",
        "summary": "保存股票、接收提醒，阅读相关市场新闻",
        "sections": [
            {
                "title": "新增",
                "items": [
                    "新增自选股页面，可保存股票、跟踪价格并按代码排序。 #40 #46",
                    "股价高于或低于目标时触发价格提醒。 #40",
                    "提供自选股相关新闻流。 #40",
                    "图表支持全屏。 #45",
                    "新增关于、帮助与 API 文档页，Siray.ai 可作为备用 AI 服务。 #40",
                    "修复 README 中失效的链接。 #42"
                ]
            }
        ],
        "credits": [
            {
                "login": "ravixalgorithm",
                "prs": [
                    40,
                    45,
                    46,
                    48
                ]
            },
            {
                "login": "ettoreciolli",
                "prs": [
                    42
                ]
            },
            {
                "login": "nexitpl",
                "issues": [
                    33,
                    44
                ]
            },
            {
                "login": "cn-zeus-jp",
                "issues": [
                    27
                ]
            }
        ]
    },
    {
        "id": "2025-12",
        "date": "12 月 2025",
        "title": "安全与支持",
        "summary": "修复严重框架漏洞，并增加项目支持入口",
        "sections": [
            {
                "title": "更新内容",
                "items": [
                    "修复 React Server Components 严重漏洞。 #30",
                    "接入 Vercel 网站分析。 #31",
                    "增加项目捐赠入口。 #32"
                ]
            }
        ],
        "credits": [
            {
                "login": "ravixalgorithm",
                "prs": [
                    32
                ]
            }
        ]
    },
    {
        "id": "2025-10",
        "date": "10 月 2025",
        "title": "OpenStock 正式发布",
        "summary": "面向所有人的免费开源行情跟踪工具",
        "sections": [
            {
                "title": "发布",
                "items": [
                    "项目于 2025 年 9 月 28 日启动，10 月 4 日首次部署，提供账号、股票搜索及基于 TradingView 的工作台。 #1 #9",
                    "支持 Docker 和 Docker Compose。 #17",
                    "修复项目发布初期反馈的构建错误。 #25"
                ]
            }
        ],
        "credits": [
            {
                "login": "ravixalgorithm",
                "prs": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14
                ]
            },
            {
                "login": "chinnsenn",
                "prs": [
                    17
                ]
            },
            {
                "login": "nb-src",
                "prs": [
                    25
                ]
            },
            {
                "login": "Terry0930",
                "issues": [
                    23
                ]
            }
        ]
    }
];

export const LATEST_RELEASE = RELEASES[0];
