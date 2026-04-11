// 送信完了ページ
// ContactForm から router.push("/contact/thanks") でここに遷移してくる。
// ユーザーが戻るボタンを押して再送しないよう、フォーム領域を含めず完了メッセージのみを表示する。
// Server Component として静的に返すだけでクライアント JS は不要。
import Link from "next/link";

export default function ContactThanksPage() {
  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">送信しました</h1>
      <p className="mb-6">
        お問い合わせありがとうございました。内容を確認の上、追ってご連絡いたします。
      </p>
      {/* トップに戻るリンク。Next.js の Link を使うとクライアント側ルーティングで高速 */}
      <Link href="/" className="text-blue-600 underline">
        トップへ戻る
      </Link>
    </main>
  );
}
