// Supabase contactsテーブルの行を表す型
// 各カラムの型はSupabase側のスキーマに合わせる

// statusカラムで許可する3値（DB上も日本語で保存）
export type ContactStatus = "未対応" | "対応中" | "完了";

export type Contact = {
  id: string;          // UUIDまたはbigint。ここではstringとして扱う
  name: string;        // 氏名
  email: string;       // メールアドレス
  subject: string;     // 件名
  message: string;     // 本文
  status: ContactStatus; // ステータス（未対応/対応中/完了）
  created_at: string;  // ISO8601形式の日時文字列
};
