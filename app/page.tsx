import Link from "next/link";

// トップページ。最小実装で /contacts への導線のみ提供
export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Supabase Contacts Demo</h1>
      <Link href="/contacts" className="text-blue-600 underline">
        Contacts一覧を見る →
      </Link>
    </main>
  );
}
