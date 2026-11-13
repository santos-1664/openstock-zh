import TradingViewWidget from '@/components/TradingViewWidget';

// The widget frame clips overflow, so the attribution TradingView requires sits under it,
// visible, with their link left as nofollow the way their embed snippet ships it.
export default function TradingViewEmbed({
    scriptUrl,
    config,
    height,
    creditHref,
    creditLabel,
}: {
    scriptUrl: string;
    config: Record<string, unknown>;
    height: number;
    creditHref: string;
    creditLabel: string;
}) {
    return (
        <div>
            <TradingViewWidget scriptUrl={scriptUrl} config={config} height={height} allowExpand labels={{ fullScreen: "全屏", exitFullScreen: "退出全屏", exitFullScreenHint: "退出全屏（Esc）" }} />
            <p className="tradingview-widget-copyright">
                <a href={creditHref} target="_blank" rel="noopener nofollow">{creditLabel}</a>
            </p>
        </div>
    );
}
