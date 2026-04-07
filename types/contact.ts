// Supabase contactsテーブルの行を表す型
// 各カラムの型はSupabase側のスキーマに合わせる
export type Contact = {
  id: string;          // UUIDまたはbigint。ここではstringとして扱う
  name: string;        // 氏名
  email: string;       // メールアドレス
  subject: string;     // 件名
  message: string;     // 本文
  status: string;      // ステータス（例: new, read, archived）
  created_at: string;  // ISO8601形式の日時文字列
};
