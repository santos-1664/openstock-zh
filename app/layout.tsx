import type { Metadata } from "next";
import {Toaster} from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenStock",
  description: "OpenStock 是开源股票行情平台，支持行情跟踪、自选股、价格提醒和公司分析。",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN" className="dark" suppressHydrationWarning>
            <body
                className="font-sans antialiased"
            >
                {children}
                <Toaster/>
            </body>
        </html>
    );
}
