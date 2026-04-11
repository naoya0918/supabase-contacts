// 問い合わせフォームの入力検証ルール本体
// クライアント側（ContactForm.tsx）とサーバー側（actions.ts の createContact）の
// 両方から import して「同じルールで二重チェック」を実現する。
// ルール本体を1箇所にまとめる理由：
//   ルール変更時に2箇所を直す手間と、クライアント/サーバー間のずれを防ぐため。

// フォームから受け取る4項目だけを表す型
// types/contact.ts の Contact 型（id, status, created_at を含む）とは別物として独立定義する。
// 「ユーザーが入力する範囲」と「DB に保存される範囲」を型レベルで分けるのが目的。
export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

// フィールド名 → エラーメッセージのマップ
// Partial にしているのは「エラーがないフィールドはキー自体存在しない」ことを表現するため
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

// メール形式の簡易チェック用正規表現
// RFC 準拠の厳密チェックではなく「@ があって前後が空でなくドットを含む」程度で止める。
// 公開フォームで過剰に厳しくすると正当なメールを弾いてしまうため。
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 入力値を検証し、エラー情報を返す
// 戻り値が空オブジェクト {} ならエラーなし（通過）。
// キーが入っていればそのフィールドにエラーがある。
export function validateContactInput(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};

  // name: 必須 → 長さ の順でチェック
  // trim() はバリデーション判定のみに使い、保存値は元のままにする（ユーザーの意図を尊重）
  if (input.name.trim().length === 0) {
    errors.name = "お名前を入力してください";
  } else if (input.name.length > 100) {
    errors.name = "お名前は100文字以内で入力してください";
  }

  // email: 必須 → 長さ → 形式 の順
  // 必須が NG のときは形式チェックまで進めない（一度に複数エラーを出さず、まず埋めさせる）
  if (input.email.trim().length === 0) {
    errors.email = "メールアドレスを入力してください";
  } else if (input.email.length > 200) {
    errors.email = "メールアドレスは200文字以内で入力してください";
  } else if (!EMAIL_REGEX.test(input.email)) {
    errors.email = "メールアドレスの形式が正しくありません";
  }

  // subject: 必須 → 長さ
  if (input.subject.trim().length === 0) {
    errors.subject = "件名を入力してください";
  } else if (input.subject.length > 200) {
    errors.subject = "件名は200文字以内で入力してください";
  }

  // message: 必須 → 長さ
  if (input.message.trim().length === 0) {
    errors.message = "本文を入力してください";
  } else if (input.message.length > 2000) {
    errors.message = "本文は2000文字以内で入力してください";
  }

  return errors;
}
