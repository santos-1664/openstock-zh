# OpenStock 本地界面预览

官方源码：https://github.com/Open-Dev-Society/OpenStock

启动：`npm run dev -- --hostname 127.0.0.1 --port 3000`

- 官方首页：http://localhost:3000/
- 本地工作台预览：http://localhost:3000/local-preview

`app/local-preview/page.tsx` 复用官方工作台页面和组件，用空自选列表和本地展示身份呈现界面，仅在 development 模式可用。未更改原有登录保护。

未配置 MongoDB、Finnhub、邮件或 AI 服务。行情组件是否显示取决于外部数据源和网络，空值不会用虚构价格替代。登录、自选保存、搜索、通知未验收。

本任务没有创建远程仓库或部署资源，未涉及阿里云效和飞书。


## 简体中文

默认语言为简体中文，侧边栏可以切换其他语言。完整的应用界面与邮件文案见 `messages/zh.json`；公开页面、指南和更新日志已翻译为中文。品牌、公司名称、股票代码、技术参数和第三方来源内容保留原文。

图表通过 TradingView 的 `zh_CN` 配置显示中文控件。没有配置数据库、行情密钥、邮件或 AI 服务，因此本次仅验收页面和翻译，未开通账户、提醒或邮件功能。
