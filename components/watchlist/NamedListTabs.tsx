'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { createWatchlistList, deleteWatchlistList, type WatchlistListSummary } from '@/lib/actions/watchlist-lists.actions';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Tabs across the starred list and the named ones. The selection lives in the URL (?list=…), so the
// panel below can stay a server component and fetch quotes for the one list being looked at.
export default function NamedListTabs({
    lists,
    activeId,
    starredCount,
}: {
    lists: WatchlistListSummary[];
    activeId: string | null;
    starredCount: number;
}) {
    const router = useRouter();
    const t = useTranslations('NamedLists');
    const common = useTranslations('Common');
    const [name, setName] = useState('');
    const [busy, setBusy] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
    const active = lists.find((l) => l.id === activeId) ?? null;

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        try {
            const result = await createWatchlistList(name);
            if ('error' in result) {
                toast.error(result.error);
                return;
            }
            setName('');
            toast.success(t('created', { list: result.name }));
            router.push(`/watchlist?list=${result.id}`);
            router.refresh();
        } catch {
            toast.error(t('createFailed'));
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        if (!deleteTarget || busy) return;
        setBusy(true);
        try {
            const result = await deleteWatchlistList(deleteTarget.id);
            if ('error' in result) {
                toast.error(result.error);
                return;
            }
            toast.success(t('deleted', { list: deleteTarget.name }));
            setDeleteTarget(null);
            router.push('/watchlist');
            router.refresh();
        } catch {
            toast.error(t('deleteFailed'));
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
        <div className="flex flex-wrap items-center gap-1.5 px-1 pb-1" aria-busy={busy}>
            <Link href="/watchlist" className={cn('pill h-8', !activeId && 'is-up')}>
                <Star className="size-3.5" /> {t('starred')} <span className="num">· {starredCount}</span>
            </Link>

            {lists.map((list) => (
                <Link key={list.id} href={`/watchlist?list=${list.id}`} className={cn('pill h-8', activeId === list.id && 'is-up')}>
                    {list.name} <span className="num">· {list.count}</span>
                </Link>
            ))}

            {active && (
                <button type="button" onClick={() => setDeleteTarget({ id: active.id, name: active.name })} disabled={busy} className="pill h-8 is-danger" title={t('deleteTitle', { list: active.name })}>
                    <Trash2 className="size-3.5" /> {t('delete')}
                </button>
            )}

            <form onSubmit={create} className="flex items-center gap-1.5">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('newListName')}
                    aria-label={t('newListName')}
                    className="h-8 w-40 rounded-full bg-page px-3 text-[13px] shadow-[inset_0_0_0_1px_var(--line)] outline-none placeholder:text-faint focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button type="submit" disabled={busy || !name.trim()} className="pill h-8" title={t('createTitle')}>
                    <Plus className="size-3.5" /> {t(busy && !deleteTarget ? 'creating' : 'create')}
                </button>
            </form>
        </div>
        <Dialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open && !busy) setDeleteTarget(null); }}>
            <DialogContent showCloseButton={!busy} className="sm:max-w-[420px]">
                <DialogTitle>{t('deleteTitle', { list: deleteTarget?.name ?? '' })}</DialogTitle>
                <DialogDescription>{t('deleteConfirm', { list: deleteTarget?.name ?? '' })}</DialogDescription>
                <DialogFooter>
                    <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => setDeleteTarget(null)} autoFocus>{common('cancel')}</button>
                    <button type="button" className="btn btn-ghost text-down" disabled={busy} onClick={remove} aria-busy={busy}>
                        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Trash2 className="size-4" aria-hidden="true" />}
                        {t(busy ? 'deleting' : 'delete')}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
