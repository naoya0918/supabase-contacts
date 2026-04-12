"use client";

// 削除ボタンの Client Component
// window.confirm() で確認後、Server Action で物理削除する

import { useTransition } from "react";
import { deleteContact } from "./actions";

type Props = {
  contactId: string;
};

export default function DeleteButton({ contactId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm("この問い合わせを削除しますか？")) {
      return;
    }

    startTransition(async () => {
      const res = await deleteContact(contactId);
      if (res.error) {
        alert(`削除に失敗しました: ${res.error}`);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? "削除中..." : "削除"}
    </button>
  );
}
