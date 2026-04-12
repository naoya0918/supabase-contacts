import { supabase } from "@/lib/supabase";
import type { Contact } from "@/types/contact";
import StatusSelect from "./StatusSelect";
import DeleteButton from "./DeleteButton";

// Server Component として実行
// → サーバー側で直接Supabaseに問い合わせるため、anon keyがクライアントに不要なロジックを通らずに済み高速
export default async function ContactsPage() {
  // contactsテーブル全件を作成日時の降順で取得
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  // エラー時はメッセージ表示
  if (error) {
    console.error("Supabase fetch error:", error);
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl font-bold text-slate-800">問い合わせ管理</h1>
        <p className="text-red-500 mt-4">エラーが発生しました: {error.message}</p>
      </main>
    );
  }

  const contacts = (data ?? []) as Contact[];

  // 統計用: 未対応の件数をカウント
  const pendingCount = contacts.filter((c) => c.status === "未対応").length;

  // データなしの場合の表示
  if (contacts.length === 0) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl font-bold text-slate-800">問い合わせ管理</h1>
        <p className="text-slate-500 mt-4">データがありません</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー: タイトル + 統計バッジ */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">問い合わせ管理</h1>
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            全体 {contacts.length}
          </span>
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
            未対応 {pendingCount}
          </span>
        </div>
      </div>

      {/* テーブル: 白背景カード内に配置 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">名前</th>
                <th className="px-4 py-3">件名</th>
                <th className="px-4 py-3">メール</th>
                <th className="px-4 py-3">ステータス</th>
                <th className="px-4 py-3">受信日</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.subject}</td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3">
                    <StatusSelect contactId={c.id} status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(c.created_at).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-4 py-3">
                    <DeleteButton contactId={c.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
