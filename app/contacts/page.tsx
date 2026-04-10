import { supabase } from "@/lib/supabase";
import type { Contact } from "@/types/contact";
import StatusSelect from "./StatusSelect";
import DeleteButton from "./DeleteButton";

// Server Component として実行
// → サーバー側で直接Supabaseに問い合わせるため、anon keyがクライアントに不要なロジックを通らずに済み高速
export default async function ContactsPage() {
  // contactsテーブル全件を作成日時の降順で取得
  // select('*') は全カラム取得。必要に応じて絞ることも可能
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  // エラー時はメッセージ表示。コンソールにも出力して開発時に確認しやすくする
  if (error) {
    console.error("Supabase fetch error:", error);
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Contacts</h1>
        <p className="text-red-600">エラーが発生しました: {error.message}</p>
      </main>
    );
  }

  const contacts = (data ?? []) as Contact[];

  // データなしの場合の表示
  if (contacts.length === 0) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Contacts</h1>
        <p>データがありません</p>
      </main>
    );
  }

  // 一覧を表形式でレンダリング
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">Subject</th>
              <th className="border px-3 py-2 text-left">Message</th>
              <th className="border px-3 py-2 text-left">Status</th>
              <th className="border px-3 py-2 text-left">Created At</th>
              <th className="border px-3 py-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id}>
                <td className="border px-3 py-2">{c.id}</td>
                <td className="border px-3 py-2">{c.name}</td>
                <td className="border px-3 py-2">{c.email}</td>
                <td className="border px-3 py-2">{c.subject}</td>
                <td className="border px-3 py-2 whitespace-pre-wrap">{c.message}</td>
                <td className="border px-3 py-2">
                  <StatusSelect contactId={c.id} status={c.status} />
                </td>
                <td className="border px-3 py-2">{c.created_at}</td>
                <td className="border px-3 py-2">
                  <DeleteButton contactId={c.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
