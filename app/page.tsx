import Link from "next/link";

// トップページ。問い合わせフォームとダッシュボードへの導線を提供
export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Supabase Contacts Demo
      </h1>
      <p className="text-slate-500 mb-8">
        問い合わせフォームと管理ダッシュボードのデモアプリ
      </p>
      <div className="flex gap-4">
        <Link
          href="/contact"
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition-colors"
        >
          お問い合わせ
        </Link>
        <Link
          href="/contacts"
          className="bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-5 py-2.5 text-sm border border-slate-200 transition-colors"
        >
          管理ダッシュボード
        </Link>
      </div>
    </main>
  );
}
