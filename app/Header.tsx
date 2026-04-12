"use client";

// 全ページ共通のナビゲーションヘッダー
// usePathname で現在のパスを取得し、アクティブなリンクをブルー太字にする
// Client Component にする理由: usePathname はブラウザ側でURLを読む Hook なので "use client" が必要

import Link from "next/link";
import { usePathname } from "next/navigation";

// ナビゲーションリンクの定義を配列で管理
// href と label のペアを1箇所にまとめることで、リンクの追加・変更が楽になる
const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/contacts", label: "管理" },
];

export default function Header() {
  // usePathname() は現在のURLパスを返す Hook
  // 例: /contacts にいるとき pathname === "/contacts"
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-slate-200">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* ロゴ（テキスト） */}
        <Link href="/" className="text-lg font-bold text-slate-800">
          Contacts
        </Link>

        {/* ナビリンク */}
        <div className="flex gap-6">
          {navLinks.map((link) => {
            // 現在のパスと一致するリンクをアクティブ状態にする
            // "/" は完全一致、それ以外は前方一致で判定
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "text-sm font-semibold text-blue-500"
                    : "text-sm text-slate-500 hover:text-slate-800"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
