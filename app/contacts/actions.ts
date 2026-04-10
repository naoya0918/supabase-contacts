"use server";

// Server Actions は "use server" ディレクティブをファイル先頭に置くことで
// このファイル内の全ての export 関数がサーバー側で実行される関数として扱われる。
// クライアントから直接呼び出しても、実体はサーバーで動くため anon key などの
// 秘密情報をクライアントに晒さずに済む。

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { ContactStatus } from "@/types/contact";

// 許可するステータス値。Server Action は POST で直接叩けるため
// 二重防御として値のバリデーションをサーバー側でも行う。
const ALLOWED_STATUSES: ContactStatus[] = ["未対応", "対応中", "完了"];

// contactsテーブルの特定行のstatusを更新する Server Action
// 成功時は {}、失敗時は { error: string } を返す
export async function updateContactStatus(
  id: string,
  status: ContactStatus
): Promise<{ error?: string }> {
  // 不正なstatus値を弾く
  if (!ALLOWED_STATUSES.includes(status)) {
    return { error: "不正なステータスです" };
  }

  // Supabase で該当行のstatusだけを更新
  const { error } = await supabase
    .from("contacts")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("updateContactStatus error:", error);
    return { error: error.message };
  }

  // 一覧ページのキャッシュを無効化 → Server Component が再取得される
  revalidatePath("/contacts");
  return {};
}

// contactsテーブルから指定IDの行を物理削除する Server Action
// 成功時は {}、失敗時は { error: string } を返す
export async function deleteContact(
  id: string
): Promise<{ error?: string }> {
  // Supabase で該当行を削除
  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteContact error:", error);
    return { error: error.message };
  }

  // 一覧ページのキャッシュを無効化 → Server Component が再取得される
  revalidatePath("/contacts");
  return {};
}
