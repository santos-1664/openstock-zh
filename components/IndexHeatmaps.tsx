import TradingViewWidget from '@/components/TradingViewWidget';
import Panel from '@/components/Panel';
import { STOCK_HEATMAP_CONFIG } from '@/lib/constants';

const SCRIPT = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
const INDEXES = [
    { id: 'sp500', source: 'SPX500', zh: '标普 500 热力图', en: 'S&P 500 heatmap' },
    { id: 'nasdaq100', source: 'NASDAQ100', zh: '纳斯达克 100 热力图', en: 'Nasdaq 100 heatmap' },
] as const;

export default function IndexHeatmaps({ locale = 'zh' }: { locale?: string }) {
    const chinese = locale === 'zh';
    const labels = chinese
        ? { fullScreen: '全屏', exitFullScreen: '退出全屏', exitFullScreenHint: '退出全屏（Esc）' }
        : { fullScreen: 'Full screen', exitFullScreen: 'Exit full screen', exitFullScreenHint: 'Exit full screen (Esc)' };
    return (
        <div className="flex flex-col gap-6">
            {INDEXES.map(index => (
                <div key={index.id} id={index.id} className="scroll-mt-24">
                    <Panel title={chinese ? index.zh : index.en}
                        sub={chinese ? '面积代表市值，颜色与百分比代表当日涨跌；可缩放或全屏查看。' : 'Sized by market cap, coloured by daily change. Zoom or expand for detail.'}>
                        <TradingViewWidget scriptUrl={SCRIPT}
                            config={{ ...STOCK_HEATMAP_CONFIG, dataSource: index.source, locale: chinese ? 'zh_CN' : locale, hasTopBar: true }}
                            height={620} allowExpand labels={labels} />
                    </Panel>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                        {chinese ? '数据与图表由 TradingView 提供。' : 'Data and chart by TradingView. '}
                        <a href={`https://www.tradingview.com/heatmap/stock/?dataset=${index.source}`}
                            target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                            {chinese ? '在 TradingView 查看' : 'View on TradingView'}
                        </a>
                    </p>
                </div>
            ))}
        </div>
    );
}
