# OpenStock 中文站

线上网站：[openstock-zh-five.vercel.app](https://openstock-zh-five.vercel.app)

基于 [Open Dev Society / OpenStock](https://github.com/Open-Dev-Society/OpenStock) 的个人中文部署，保留 [AGPL-3.0 许可证](LICENSE) 和上游贡献者署名。本站修改源码公开于 [santos-1664/openstock-zh](https://github.com/santos-1664/openstock-zh)。

## 保留的功能

- Google 登录、个人账号与 MongoDB 数据存储。
- 市场概览、指数跟踪 ETF 报价、股票搜索和相关新闻。
- 标普 500、纳斯达克 100 热力图与 TradingView 图表、财务及技术分析。
- 自选股、自定义分组、站内价格提醒。
- 不依赖 AI 的看盘工具：按股票保存日/周/月线与指标预设；21/63/126/252 根日线的阶段高低点、MA20/60/200、量能对比、SPY 相对表现及价位提醒联动。
- 公开热力图、股票资料、使用帮助及开源信息。

默认使用 Yahoo Finance 免费报价，五分钟共享缓存；TradingView 图表有各自的数据来源和延时。指数卡片显示跟踪 ETF 的价格，并非指数点位。部分市值、股息等字段可能缺失。

站内提醒在网页打开时每分钟检查缓存报价，关闭网页后不发送邮件或推送。

## 已精简的内容

已移除运行时的赞助位、捐赠入口与弹窗、Onto 推广、更新横幅、营销首页、登录页宣传预览、Vercel 访客统计、社交情绪/预测市场组件，以及注册欢迎邮件和 AI 摘要任务。

`/sponsor`、`/love`、`/compare` 及其子页面、`/changelog`、`/api-docs`、`/local-preview` 和 `/api/inngest` 已停用，返回 404。旧代码可通过 Git 历史查阅。首页直接进入工作台，未登录时进入登录页。

## 本地与部署

1. 使用 Node.js 22，运行 `npm ci`。
2. 参考 `.env.example` 配置 MongoDB、会话密钥、站点地址及 Google OAuth；密钥不得提交到 GitHub。
3. 本地：`npm run dev`。检查：`npx tsc --noEmit`、`npm test`。构建：`npm run build`。
4. 默认 `NEXT_PUBLIC_OPENSTOCK_DATA_MODE=delayed`、`NEXT_PUBLIC_OPENSTOCK_ALERT_MODE=in-app`。修改公开环境变量后须重新构建。

正式站 Google OAuth 回调：`https://openstock-zh-five.vercel.app/api/auth/callback/google`。OAuth 当前处于 Testing 模式，仅已添加的测试账号可登录。

Vercel 当前采用直接源码部署，GitHub 推送不会自动更新线上站点。Google Cloud、MongoDB Atlas、Vercel 的配置及凭据保持独立管理。

保留的 SMTP 配置仅用于密码找回，不用于营销邮件。行情和图表仅供参考，不构成投资建议。

## 看盘工具的数据口径

股票详情页保留 TradingView 原图表，并新增独立日线统计。历史数据来自 Yahoo Finance，两年日线按五分钟缓存，统计面板支持手动刷新。接口要求已登录，并限制每用户每分钟 20 次读取；无需额外密钥或 AI 服务。

高低点取所选区间的日内极值，MA 为日线收盘价的简单平均，成交量与此前 20 根日线均量对比。SPY 对比只使用共同交易日期，并统一采用复权收盘价；复权数据不完整时双方统一使用收盘价。数据不足或基准暂不可用会明确提示。最新日线可能尚未收盘，统计与图表周期独立。

本站周期按钮和指标选择按股票保存在当前浏览器；预设选择指标类型，图内参数采用 TradingView 默认值。切换配置会重载嵌入图表，手动画线不会保存。高低点与均线的提醒按钮只预填表单，确认后才创建提醒。

图表配置参考：[TradingView Advanced Chart](https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/)。
