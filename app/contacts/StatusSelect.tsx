"use client";

// ステータスを変更するセレクトボックス
// useTransition で Server Action 呼び出し中の pending 状態を管理する

import { useTransition } from "react";
import { updateContactStatus } from "./actions";
import type { ContactStatus } from "@/types/contact";

type Props = {
  contactId: string;
  status: ContactStatus;
};

// ステータスに応じたバッジ色を返すヘルパー
// Tailwind のクラスをステータスごとに定義し、セレクトボックスの見た目を変える
const statusStyles: Record<ContactStatus, string> = {
  "未対応": "bg-amber-100 text-amber-800",
  "対応中": "bg-blue-100 text-blue-700",
  "完了": "bg-emerald-100 text-emerald-700",
};

export default function StatusSelect({ contactId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as ContactStatus;
    startTransition(async () => {
      const res = await updateContactStatus(contactId, next);
      if (res.error) {
        alert(`更新に失敗しました: ${res.error}`);
      }
    });
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${statusStyles[status]}`}
    >
      <option value="未対応">未対応</option>
      <option value="対応中">対応中</option>
      <option value="完了">完了</option>
    </select>
  );
}
