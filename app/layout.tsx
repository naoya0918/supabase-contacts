import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// サイトタイトルをアプリの内容に合わせて変更
export const metadata: Metadata = {
  title: "Contacts - 問い合わせ管理",
  description: "問い合わせフォームと管理ダッシュボード",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 全ページ共通ヘッダー */}
        <Header />
        {/* ページ本体 */}
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
