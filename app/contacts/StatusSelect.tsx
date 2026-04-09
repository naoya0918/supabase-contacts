"use client";

// このコンポーネントはブラウザ側で動く Client Component。
// セレクトボックスの onChange イベントで Server Action を呼び出すために
// クライアント側の JS が必要なので "use client" を付けている。

import { useTransition } from "react";
import { updateContactStatus } from "./actions";
import type { ContactStatus } from "@/types/contact";

type Props = {
  contactId: string;
  status: ContactStatus;
};

// status を変更するためのセレクトボックス
// useTransition を使う理由:
//   Server Action を呼んでいる間の "pending" 状態を React が管理してくれ、
//   UI をブロックせずに更新中のフラグ(isPending)を取り出せる。
export default function StatusSelect({ contactId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as ContactStatus;
    startTransition(async () => {
      const res = await updateContactStatus(contactId, next);
      // エラー時はシンプルに alert で通知（トーストは将来拡張）
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
      className="border rounded px-2 py-1 text-sm disabled:opacity-50"
    >
      <option value="未対応">未対応</option>
      <option value="対応中">対応中</option>
      <option value="完了">完了</option>
    </select>
  );
}
