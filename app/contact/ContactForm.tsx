"use client";

// 問い合わせフォーム本体の Client Component
// useState でフォーム状態を保持し、useTransition で送信中の pending を管理する
// バリデーションはクライアントで1回、Server Action 側でもう1回（二重防御）

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createContact } from "@/app/contacts/actions";
import {
  validateContactInput,
  type ContactInput,
  type ContactErrors,
} from "@/lib/contactValidation";

// フィールドに紐づかない全体エラー（Supabase接続失敗等）を入れる特別キー _form を
// ContactErrors に足した拡張型
type FormErrors = ContactErrors & { _form?: string };

export default function ContactForm() {
  const [form, setForm] = useState<ContactInput>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const clientErrors = validateContactInput(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      const res = await createContact(form);

      if (res.fieldErrors) {
        setErrors(res.fieldErrors);
        return;
      }

      if (res.error) {
        setErrors({ _form: res.error });
        return;
      }

      router.push("/contact/thanks");
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* 全体エラー */}
        {errors._form && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            {errors._form}
          </p>
        )}

        {/* お名前 */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
            お名前<span className="text-red-500 ml-0.5">*</span>
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
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* メールアドレス */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
            メールアドレス<span className="text-red-500 ml-0.5">*</span>
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
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* 件名 */}
        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-1.5">
            件名<span className="text-red-500 ml-0.5">*</span>
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
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          {errors.subject && (
            <p id="subject-error" className="text-red-500 text-sm mt-1">
              {errors.subject}
            </p>
          )}
        </div>

        {/* 本文 */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">
            本文<span className="text-red-500 ml-0.5">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            maxLength={2000}
            disabled={isPending}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-vertical"
          />
          {errors.message && (
            <p id="message-error" className="text-red-500 text-sm mt-1">
              {errors.message}
            </p>
          )}
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "送信中..." : "送信する"}
        </button>
      </form>
    </div>
  );
}
