"use client";

// 問い合わせフォーム本体の Client Component
// useState でフォーム状態を保持し、useTransition で送信中の pending を管理する。
// 既存の StatusSelect / DeleteButton と同じパターンを踏襲。
// バリデーションはクライアントで1回、Server Action 側でもう1回（二重防御）。

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createContact } from "@/app/contacts/actions";
import {
  validateContactInput,
  type ContactInput,
  type ContactErrors,
} from "@/lib/contactValidation";

// フィールドに紐づかない全体エラー（Supabase接続失敗等）を入れる特別キー _form を
// ContactErrors に足した拡張型。フィールド別エラーとシステムエラーを同じ state で管理する。
type FormErrors = ContactErrors & { _form?: string };

export default function ContactForm() {
  // フォーム4項目の値を1つのオブジェクトでまとめて保持
  // useState を4つ作るより、スプレッド構文で1箇所から更新する方が管理しやすい
  const [form, setForm] = useState<ContactInput>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // フィールド別エラー + 全体エラーを1つの state にまとめる
  const [errors, setErrors] = useState<FormErrors>({});

  // 送信中の pending フラグ管理
  // useTransition を使う理由：Server Action 呼び出し中のローディング状態を
  // React が管理してくれ、UI をブロックせず isPending を取り出せる
  const [isPending, startTransition] = useTransition();

  // 成功時のリダイレクト用ルーター
  const router = useRouter();

  // フォーム送信ハンドラ
  // 1. クライアント側バリデーション → エラーあれば赤字表示して終了
  // 2. Server Action createContact を呼ぶ
  // 3. 戻り値に応じて fieldErrors / error / 成功リダイレクト を分岐
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. クライアント側バリデーション
    const clientErrors = validateContactInput(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    // バリデーション通過時は古いエラー表示をクリア
    setErrors({});

    // 2. Server Action 呼び出し
    startTransition(async () => {
      const res = await createContact(form);

      // サーバー側バリデーションで弾かれたフィールドエラーを受け取る
      if (res.fieldErrors) {
        setErrors(res.fieldErrors);
        return;
      }

      // システムエラー（Supabase接続失敗等）はフォーム上部に出す
      if (res.error) {
        setErrors({ _form: res.error });
        return;
      }

      // 3. 成功 → 完了ページへクライアント側ルーティングで遷移
      router.push("/contact/thanks");
    });
  };

  // noValidate を付けてブラウザの HTML5 バリデーションを無効化
  // 自前の validateContactInput と二重に走ると挙動がブレるため片方に統一する
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* 全体エラー（フィールドに紐づかない Supabase 接続失敗等） */}
      {errors._form && (
        <p className="text-red-600 border border-red-300 rounded p-2">
          {errors._form}
        </p>
      )}

      {/* お名前 */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          お名前<span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          maxLength={100}
          disabled={isPending}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="w-full border rounded px-3 py-2 disabled:opacity-50"
        />
        {errors.name && (
          <p id="name-error" className="text-red-600 text-sm mt-1">
            {errors.name}
          </p>
        )}
      </div>

      {/* メールアドレス */}
      {/* type="email" にしない理由：ブラウザごとの実装差で自動バリデーションが効いてしまうと */}
      {/*                    自前の noValidate と組み合わせて混乱の元になるため、素の text にする */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          メールアドレス<span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          type="text"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          maxLength={200}
          disabled={isPending}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full border rounded px-3 py-2 disabled:opacity-50"
        />
        {errors.email && (
          <p id="email-error" className="text-red-600 text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* 件名 */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-1">
          件名<span className="text-red-600">*</span>
        </label>
        <input
          id="subject"
          type="text"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          maxLength={200}
          disabled={isPending}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className="w-full border rounded px-3 py-2 disabled:opacity-50"
        />
        {errors.subject && (
          <p id="subject-error" className="text-red-600 text-sm mt-1">
            {errors.subject}
          </p>
        )}
      </div>

      {/* 本文（複数行） */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          本文<span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          maxLength={2000}
          disabled={isPending}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full border rounded px-3 py-2 disabled:opacity-50"
        />
        {errors.message && (
          <p id="message-error" className="text-red-600 text-sm mt-1">
            {errors.message}
          </p>
        )}
      </div>

      {/* 送信ボタン */}
      {/* type="submit" にすることで Enter キー送信も効く */}
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {isPending ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
