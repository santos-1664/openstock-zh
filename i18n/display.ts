const sectors: Record<string, string> = {
  "Communication Services": "通信服务",
  "Consumer Discretionary": "可选消费",
  "Consumer Staples": "必需消费",
  "Energy": "能源",
  "Financials": "金融",
  "Health Care": "医疗健康",
  "Industrials": "工业",
  "Information Technology": "信息技术",
  "Materials": "原材料",
  "Real Estate": "房地产",
  "Utilities": "公用事业",
  "Technology": "科技",
  "Healthcare": "医疗健康",
  "Consumer Cyclical": "周期性消费",
  "Consumer Defensive": "防御性消费",
  "Basic Materials": "基础材料",
  "Financial Services": "金融服务",
  "Communication": "通信"
};
export const sectorLabel = (sector: string) => sectors[sector] ?? sector;

const indexNames: Record<string,string> = { "S&P 500":"标普 500", "Nasdaq 100":"纳斯达克 100", "Dow 30":"道琼斯 30", "Russell 2000":"罗素 2000", "Bitcoin":"比特币", "Ethereum":"以太坊", "Solana":"索拉纳", "EUR / USD":"欧元／美元", "GBP / USD":"英镑／美元", "USD / JPY":"美元／日元", "AUD / USD":"澳元／美元" };
export const indexLabelZh = (name: string) => indexNames[name] ?? name;
