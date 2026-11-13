import Link from 'next/link';
import Image from 'next/image';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh bg-page">
            <header className="border-b border-line">
                <nav className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-5 py-4" aria-label="导航">
                    <Link href="/dashboard" aria-label="OpenStock 工作台"><Image src="/assets/images/logo.png" alt="OpenStock" width={140} height={35} priority /></Link>
                    <Link href="/heatmaps" className="btn btn-ghost">热力图</Link>
                    <Link href="/s" className="btn btn-ghost">股票</Link>
                    <Link href="/dashboard" className="btn btn-primary ms-auto">进入工作台</Link>
                </nav>
            </header>
            <main>{children}</main>
            <footer className="mx-auto mt-16 flex max-w-[1200px] flex-wrap items-center gap-x-5 gap-y-3 px-5 py-8 text-xs text-faint">
                <span>© {new Date().getFullYear()} Open Dev Society · AGPL-3.0</span>
                <Link href="/help" className="hover:underline">使用帮助</Link>
                <Link href="/terms" className="hover:underline">使用条款</Link>
                <Link href="/about" className="hover:underline">开源信息</Link>
                <a href="https://github.com/santos-1664/openstock-zh" target="_blank" rel="noopener noreferrer" className="hover:underline">本站源码</a>
            </footer>
        </div>
    );
}
