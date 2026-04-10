"use client";

// 削除ボタンの Client Component
// window.confirm() で確認後、Server Action で物理削除する。
// useTransition で削除中の pending 状態を管理し、二重送信を防ぐ。

import { useTransition } from "react";
import { deleteContact } from "./actions";

type Props = {
  contactId: string;
};

// 各行に配置する削除ボタン
export default function DeleteButton({ contactId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // 確認ダイアログでキャンセルされたら何もしない
    if (!window.confirm("この問い合わせを削除しますか？")) {
      return;
    }

    startTransition(async () => {
      const res = await deleteContact(contactId);
      // エラー時はアラートで通知（StatusSelect と同じパターン）
      if (res.error) {
        alert(`削除に失敗しました: ${res.error}`);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
    >
      {isPending ? "削除中..." : "削除"}
    </button>
  );
}
