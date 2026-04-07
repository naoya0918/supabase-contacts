import { createClient } from "@supabase/supabase-js";

// 環境変数からSupabaseの接続情報を読み込む
// NEXT_PUBLIC_ プレフィックスはクライアント・サーバー両方から参照可能
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数が未設定なら起動時に明示的に失敗させる
// → 本番デプロイ時などの設定ミスを早期に検知するため
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "環境変数 NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を .env.local に設定してください"
  );
}

// Supabaseクライアントを1箇所で初期化し、アプリ全体で使い回す
// 公式の createClient を使う理由: 認証・リアルタイム等の拡張をそのまま利用できる
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
