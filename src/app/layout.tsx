import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Q-C | 泰国市场一站式供应与技术服务平台",
  description:
    "Q-C 面向泰国市场，连接潮流商品、定制开发、本地电商、软硬件方案与资源销售。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#05070d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
