// 送信完了ページ
// フォーム送信成功後に router.push("/contact/thanks") で遷移してくる
// フォーム領域を含めないことで、戻るボタンでの再送を防ぐ
import Link from "next/link";

export default function ContactThanksPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="text-center">
        {/* チェックマークアイコン（CSSで作成、外部ライブラリ不使用） */}
        {/* w-20 h-20 の円にブルー背景、中央に ✓ を配置 */}
        <div className="mx-auto mb-6 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* 完了メッセージ */}
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          送信が完了しました
        </h1>

        {/* 補足テキスト */}
        <p className="text-slate-500 mb-8">
          24時間以内にご返信いたします
        </p>

        {/* トップへ戻るリンク */}
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700 font-medium hover:underline"
        >
          トップページに戻る
        </Link>
      </div>
    </main>
  );
}
