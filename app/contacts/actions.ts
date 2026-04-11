"use server";

// Server Actions は "use server" ディレクティブをファイル先頭に置くことで
// このファイル内の全ての export 関数がサーバー側で実行される関数として扱われる。
// クライアントから直接呼び出しても、実体はサーバーで動くため anon key などの
// 秘密情報をクライアントに晒さずに済む。

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { ContactStatus } from "@/types/contact";
import {
  validateContactInput,
  type ContactInput,
  type ContactErrors,
} from "@/lib/contactValidation";

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

// contactsテーブルに新規問い合わせを insert する Server Action
// 成功時は {}、フィールド別エラーは { fieldErrors }、システムエラーは { error } を返す。
// クライアント側でもバリデーションするが、POSTで直接叩かれた場合に備え、
// サーバー側でも同じ関数で再チェックする（二重防御）。
export async function createContact(
  input: ContactInput
): Promise<{ error?: string; fieldErrors?: ContactErrors }> {
  // 1. サーバー側バリデーション
  //    lib/contactValidation.ts の同じ関数を使うのでルールは1箇所だけ。
  const fieldErrors = validateContactInput(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // 2. status はサーバー側で固定値を付与する
  //    クライアントから任意の status を送らせない（POSTで直接叩かれても
  //    "未対応" 以外で登録されないようにする）。
  //    input を spread せず4フィールドを明示するのも同じ防御意図
  //    （余計なキーが混入しても insert に渡らない）。
  const { error } = await supabase.from("contacts").insert({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    status: "未対応",
  });

  if (error) {
    // Supabase の内部エラー詳細は訪問者に見せず、内部ログにだけ残す
    console.error("createContact error:", error);
    return { error: "送信に失敗しました。時間をおいて再度お試しください。" };
  }

  // 3. 管理ダッシュボードのキャッシュを無効化 → 次回アクセスで新着反映
  revalidatePath("/contacts");
  return {};
}
