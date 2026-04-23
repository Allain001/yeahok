import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import { SiteNav } from "@/components/site-nav";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Linear Algebra Visualizer",
  description: "看见线性代数：从公式到直觉。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={inter.className}>
        <SiteNav />
        <main>{children}</main>
        <footer className="border-t border-white/10 py-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-sm text-muted-foreground">
            <span>Linear Algebra Visualizer · Next.js 14 · Three.js · KaTeX</span>
            <Link href="/svd" className="text-cyan hover:text-cyan-soft">
              打开 SVD 实验
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
