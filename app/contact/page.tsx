// /contact ページ本体（Server Component）
// 訪問者向けの公開問い合わせフォームを配置するだけの薄い入れ物。
// 実際のフォーム操作は Client Component である ContactForm が担当する。
// Server Component にしている理由：ページ自体は静的な文言とフォームの配置だけで
// ブラウザ側 JS が不要なため、デフォルトの Server Component のまま書ける。
import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">お問い合わせ</h1>
      <p className="text-sm text-gray-600 mb-6">
        以下のフォームに必要事項をご記入の上、送信してください。
      </p>
      <ContactForm />
    </main>
  );
}
