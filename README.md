# OpenStock 中文站

线上网站：[openstock-zh-five.vercel.app](https://openstock-zh-five.vercel.app)

基于 [Open Dev Society / OpenStock](https://github.com/Open-Dev-Society/OpenStock) 的个人中文部署，保留 [AGPL-3.0 许可证](LICENSE) 和上游贡献者署名。本站修改源码公开于 [santos-1664/openstock-zh](https://github.com/santos-1664/openstock-zh)。

## 保留的功能

- Google 登录、个人账号与 MongoDB 数据存储。
- 市场概览、指数跟踪 ETF 报价、股票搜索和相关新闻。
- 标普 500、纳斯达克 100 热力图与 TradingView 图表、财务及技术分析。
- 自选股、自定义分组、站内价格提醒。
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
