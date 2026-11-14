'use client';
import { useId, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

const tabs = ['chart', 'study', 'company', 'technicals'] as const;
export default function StockWorkspace({ chart, study, company, technicals }: Record<typeof tabs[number], ReactNode>) {
    const t = useTranslations('StockWorkspace');
    const id = useId();
    const [selected, setSelected] = useState(0);
    const [visited, setVisited] = useState([0]);
    const panels = [chart, study, company, technicals];
    const select = (index: number) => { setSelected(index); setVisited(current => current.includes(index) ? current : [...current, index]); };
    return <section className="min-w-0">
        <div role="tablist" aria-label={t('label')} className="mb-3 flex flex-wrap gap-2 border-b border-line pb-3" onKeyDown={event => {
            const next = event.key === 'ArrowRight' ? (selected + 1) % tabs.length : event.key === 'ArrowLeft' ? (selected + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
            if (next === null) return;
            event.preventDefault(); select(next);
            event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
        }}>
            {tabs.map((tab, index) => <button key={tab} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => select(index)} className={`pill min-h-11 px-4 ${selected === index ? 'is-brand' : ''}`}>{t(tab)}</button>)}
        </div>
        {tabs.map((tab, index) => <div key={tab} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={selected !== index} tabIndex={0}>{visited.includes(index) ? panels[index] : null}</div>)}
    </section>;
}
