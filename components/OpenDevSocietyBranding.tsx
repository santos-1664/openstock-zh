import type { CSSProperties } from 'react';

type Props = {
    text?: string;
    name?: string;
    style?: CSSProperties;
    className?: string;
    logoSize?: number;
    textColor?: string;
    outerStyle?: CSSProperties;
    outerClassName?: string;
};

// Keep upstream attribution and source access without a promotional badge.
export default function OpenDevSocietyBranding({ outerClassName = '', outerStyle }: Props) {
    return <div className={outerClassName} style={outerStyle}>
        <p className="text-xs leading-6 text-faint">
            OpenStock · Open Dev Society ·{' '}
            <a href="https://github.com/santos-1664/openstock-zh" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">AGPL-3.0 源码</a>
        </p>
    </div>;
}
